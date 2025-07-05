from langchain.chat_models import init_chat_model
from .prompt import resume_suggestions_prompt
from .resume_parser import basic_resume_parser
from dotenv import load_dotenv

load_dotenv()
llm = init_chat_model("google_genai:gemini-2.0-flash")

def generate_resume_suggestions(agent_input) -> str:
    parsed = basic_resume_parser(agent_input.resume_text)
    
    chain = resume_suggestions_prompt | llm

    return chain.invoke({
        "resume_text": agent_input.resume_text,
        "job_type": agent_input.job_type,
        "target_domain": agent_input.domain,
        "job_description": agent_input.job_description,
        "email": parsed.get("email", ""),
        "phone": parsed.get("phone", ""),
        "entities": parsed.get("entities", [])
    })
