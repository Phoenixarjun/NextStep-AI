from langchain.chat_models import init_chat_model
from .prompt import interviewer_prompt
from dotenv import load_dotenv
from agents.interview_agent.schema import InterviewerInput

load_dotenv()

llm = init_chat_model("google_genai:gemini-2.0-flash")

def generate_interviewer_response(agent_input: InterviewerInput) -> str:
    chain = interviewer_prompt | llm

    return chain.invoke({
        "resume_text": agent_input.resume_text,
        "job_role": agent_input.job_role or "General Software Role"
    })
