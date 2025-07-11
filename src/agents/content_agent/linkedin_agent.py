from langchain.chat_models import init_chat_model
from .prompt import linkedin_prompt
from agents.content_agent.schema import LinkedInInput  # For type hinting
from dotenv import load_dotenv

load_dotenv()

# Fix typo in model name: "falsh" → "flash"
llm = init_chat_model("google_genai:gemini-2.0-flash")

def generate_linkedin_post(agent_input: LinkedInInput) -> str:
    chain = linkedin_prompt | llm

    return chain.invoke({
        "subcategory": agent_input.subcategory or "",
        "title": agent_input.title or "",
        "description": agent_input.description or "",
        "achievements": agent_input.achievements or [],
        "link": str(agent_input.link) if agent_input.link else "",
        "tone": agent_input.tone or "professional"
    })
