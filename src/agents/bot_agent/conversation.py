import os
from langchain.chat_models import init_chat_model
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.memory import ConversationBufferMemory
from langchain_community.vectorstores import FAISS
from langchain_community.utilities import WikipediaAPIWrapper
from langchain_community.tools import WikipediaQueryRun

from langchain.agents import initialize_agent, Tool
from langchain_core.runnables import RunnableLambda

from agents.bot_agent.schema import BotInput, BotOutput

def get_memory():
    return ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True
    )

def load_vectorstore(path: str = "knowledge_index") -> FAISS:
    embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    return FAISS.load_local(
        path,
        embeddings=embedding,
        allow_dangerous_deserialization=True
    )

def get_private_docs_tool(retriever) -> Tool:
    def search_private_docs(query: str) -> str:
        results = retriever.get_relevant_documents(query)
        return "\n".join([doc.page_content for doc in results])

    return Tool(
        name="PrivateDocs",
        func=search_private_docs,
        description="Use this to search private/internal documents and resumes. Input should be a question."
    )


def get_wikipedia_tool() -> Tool:
    return Tool(
        name="Wikipedia",
        func=WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper()).run,
        description="Use this to answer general knowledge or factual questions about any topic."
    )

def chat_with_rag(user_input: BotInput) -> BotOutput:
    try:
        llm = init_chat_model("google_genai:gemini-2.0-flash")
        retriever = load_vectorstore().as_retriever(search_kwargs={"k": 5})
        memory = get_memory()

        private_docs_tool = get_private_docs_tool(retriever)
        wikipedia_tool = get_wikipedia_tool()

        agent_executor = initialize_agent(
            tools=[private_docs_tool, wikipedia_tool],
            llm=llm,
            agent_type="zero-shot-react-description",
            verbose=False,
            memory=memory
        )

        result = agent_executor.invoke({"input": user_input.query})

        return BotOutput(
            response=result.strip() if isinstance(result, str) else str(result),
            resume_text=user_input.resume_text
        )

    except Exception as e:
        return BotOutput(response="", resume_text=user_input.resume_text, error=str(e))
