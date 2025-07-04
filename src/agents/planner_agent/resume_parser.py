from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chat_models import init_chat_model
from .prompt import resume_domain_prompt
from dotenv import load_dotenv

load_dotenv()

llm = init_chat_model("google_genai:gemini-2.0-flash")
embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
db = FAISS.load_local("knowledge_index", embedding, allow_dangerous_deserialization=True)

def extract_domain_from_resume(resume: str, traits: str) -> str:
    chain = resume_domain_prompt | llm
    return chain.invoke({"resume": resume, "traits": traits})
