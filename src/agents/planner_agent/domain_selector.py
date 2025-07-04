from langchain.chat_models import init_chat_model
from .prompt import domain_selector_prompt
from dotenv import load_dotenv

load_dotenv()
llm = init_chat_model("google_genai:gemini-2.0-flash")

def suggest_domains(interests: list, coding_level: str, description: str) -> str:
    chain = domain_selector_prompt | llm
    return chain.invoke({
        "interests": ", ".join(interests),
        "coding_level": coding_level,
        "description": description
    })
