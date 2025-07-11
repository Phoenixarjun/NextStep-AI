from langchain.chat_models import init_chat_model
from .prompt import twitter_prompt
from agents.content_agent.schema import TwitterInput  # Optional: for type hinting
from dotenv import load_dotenv

load_dotenv()

# Initialize your model
llm = init_chat_model("google_genai:gemini-2.0-flash")

def generate_tweet(agent_input: TwitterInput) -> str:
    chain = twitter_prompt | llm

    return chain.invoke({
        "subcategory": agent_input.subcategory or "",
        "title": agent_input.title or "",
        "description": agent_input.description or "",
        "tone": agent_input.tone or "casual",
        "link": str(agent_input.link) if agent_input.link else "",
        "hashtags": agent_input.hashtags or []
    })
