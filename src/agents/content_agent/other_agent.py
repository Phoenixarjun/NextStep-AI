from langchain.chat_models import init_chat_model
from .prompt import other_prompt
from agents.content_agent.schema import OtherInput  # Optional, but good for clarity
from dotenv import load_dotenv

load_dotenv()

llm = init_chat_model("google_genai:gemini-2.0-flash")

def generate_other_content(agent_input: OtherInput) -> str:
    chain = other_prompt | llm

    return chain.invoke({
        "custom_input": agent_input.custom_input or "",
        "tone": agent_input.tone or "professional"
    })
