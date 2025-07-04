from langchain.chat_models import init_chat_model
from .prompt import roadmap_prompt
from dotenv import load_dotenv

load_dotenv()
llm = init_chat_model("google_genai:gemini-2.0-flash")

def generate_roadmap(domain: str, duration: int, level: str) -> str:
    chain = roadmap_prompt | llm
    return chain.invoke({
        "domain": domain,
        "duration": duration,
        "coding_level": level
    })
