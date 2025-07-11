import os
import re
import json
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.memory import ConversationBufferMemory
from langchain_community.vectorstores import FAISS
from langchain_community.utilities import WikipediaAPIWrapper
from langchain.agents import Tool, initialize_agent
from langchain_tavily import TavilySearch
from langchain_core.runnables import RunnableMap

from agents.bot_agent.prompt import qa_prompt 
from agents.bot_agent.schema import BotInput, BotOutput

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

load_dotenv()

def load_vectorstore(path: str = "knowledge_index") -> FAISS:
    embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    return FAISS.load_local(
        path,
        embeddings=embedding,
        allow_dangerous_deserialization=True
    )

def get_private_docs_tool(retriever) -> Tool:
    def search_private_docs(query: str) -> str:
        results = retriever.invoke(query)
        return "\n\n".join([
            f"{doc.page_content}\n🔗 Source: {doc.metadata.get('source', 'PrivateDoc')}"
            for doc in results
        ])
    return Tool(
        name="PrivateDocs",
        func=search_private_docs,
        description="Search private/internal documents and resumes. Input should be a question."
    )

def get_wikipedia_tool() -> Tool:
    wiki = WikipediaAPIWrapper()

    def get_summary_with_url(query: str) -> str:
        docs = wiki.load(query)
        if not docs:
            return "No results found."
        page_title = docs[0].metadata.get("title", "Wikipedia")
        page_url = f"https://en.wikipedia.org/wiki/{page_title.replace(' ', '_')}"
        return f"{docs[0].page_content}\n\n🔗 Source: {page_url}"

    return Tool(
        name="Wikipedia",
        func=get_summary_with_url,
        description="Answer general knowledge or factual questions using Wikipedia."
    )

def get_custom_prompt_tool(llm) -> Tool:
    def prompt_fn(query: str) -> str:
        search = TavilySearch()
        search_results = search.run(query + " site:techcrunch.com OR site:arstechnica.com OR site:thenextweb.com")
        articles = search_results if isinstance(search_results, list) else []
        top_links = "\n".join([
            f"- {article['title']}\n  🔗 {article['url']}"
            for article in articles[:3]
            if "title" in article and "url" in article
        ]) or "No relevant links found."

        past = memory.load_memory_variables({}).get("chat_history", "")
        enriched_context = f"{past}\n\n🌐 Web Links:\n{top_links}"

        chain = (
            RunnableMap({
                "context": lambda _: enriched_context,
                "question": lambda _: query
            })
            | qa_prompt
            | llm
        )

        response = chain.invoke({})
        return response.content if hasattr(response, "content") else str(response)

    return Tool(
        name="QACustomPrompt",
        func=prompt_fn,
        description="Enhanced contextual reasoning with live search and memory."
    )

def extract_json_from_code_block(text: str) -> dict:
    match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass
    return {}

def remove_links_from_text(text: str) -> str:
    text = re.sub(r'\[([^\]]+)\]\((https?://[^\)]+)\)', r'\1', text)
    text = re.sub(r'https?://[^\s\)]+', '', text)
    return text.strip()

def extract_links_from_text(text: str) -> list:
    markdown_links = re.findall(r'\[.*?\]\((https?://[^\)]+)\)', text)
    raw_links = re.findall(r'https?://[^\s\)]+', text)
    return list(set(markdown_links + raw_links))

def chat_with_rag(user_input: BotInput) -> BotOutput:
    try:
        llm = init_chat_model("google_genai:gemini-2.0-flash")
        retriever = load_vectorstore().as_retriever(search_kwargs={"k": 5})

        tools = [
            get_private_docs_tool(retriever),
            get_wikipedia_tool(),
            get_custom_prompt_tool(llm)
        ]

        agent_executor = initialize_agent(
            tools=tools,
            llm=llm,
            agent_type="zero-shot-react-description",
            memory=memory,
            verbose=False
        )

        result = agent_executor.invoke({"input": user_input.query})
        result_str = result.get("output", "") if isinstance(result, dict) else str(result)

        parsed = extract_json_from_code_block(result_str)
        raw_response = parsed.get("response", "").strip()

        if not raw_response:
            raw_response = result_str.strip()

        clean_response = remove_links_from_text(raw_response)
        extracted_links = parsed.get("tools_or_links", []) or extract_links_from_text(raw_response)

        return BotOutput(
            response=clean_response,
            resume_text=user_input.resume_text,
            sources=list(set(extracted_links))
        )

    except Exception as e:
        return BotOutput(
            response="",
            resume_text=user_input.resume_text,
            error=str(e),
            sources=[]
        )
