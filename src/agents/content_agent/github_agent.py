import os
import shutil
import tempfile
from git import Repo
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain.schema.document import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders.generic import GenericLoader
from langchain_community.document_loaders.parsers.language.language_parser import LanguageParser
from langchain.text_splitter import Language, RecursiveCharacterTextSplitter
from .prompt import github_prompt

load_dotenv()
llm = init_chat_model("google_genai:gemini-2.0-flash")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


def clone_repo(repo_url: str) -> str:
    repo_path = tempfile.mkdtemp(prefix="cloned_repo_")
    Repo.clone_from(repo_url, to_path=repo_path)
    return repo_path


def load_documents(repo_path: str):
    loader = GenericLoader.from_filesystem(
        repo_path,
        glob="**/*",
        suffixes=[".py", ".js", ".ts", ".jsx", ".tsx"],
        parser=LanguageParser(language=Language.PYTHON, parser_threshold=500)
    )
    return loader.load()


def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter.from_language(
        language=Language.PYTHON,
        chunk_size=2000,
        chunk_overlap=200
    )
    return splitter.split_documents(documents)


def generate_embeddings(chunks):
    embedder = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=GOOGLE_API_KEY
    )
    return embedder.embed_documents([chunk.page_content for chunk in chunks])


def generate_readme(agent_input) -> str:
    try:
        repo_path = clone_repo(str(agent_input.github_url))
        docs = load_documents(repo_path)
        chunks = split_documents(docs)
        content_summary = "\n\n".join([chunk.page_content[:1000] for chunk in chunks[:5]])

        chain = github_prompt | llm
        result = chain.invoke({
            "repo_url": str(agent_input.github_url),
            "description": agent_input.description,
            "tech_stack": agent_input.tech_stack,
            "content_snippets": content_summary
        })

        return result.content if hasattr(result, "content") else str(result)
    except Exception as e:
        return f"Error: {str(e)}"
