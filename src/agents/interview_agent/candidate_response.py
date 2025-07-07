from langchain.chat_models import init_chat_model
from agents.interview_agent.prompt import candidate_prompt
from agents.interview_agent.schema import CandidateInput
from dotenv import load_dotenv
from langchain.agents import initialize_agent, Tool
from langchain.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper
from langchain.chat_models import init_chat_model


load_dotenv()



llm = init_chat_model("google_genai:gemini-2.0-flash")

def get_company_context(company_name: str) -> str:
    wiki_tool = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())
    
    agent_executor = initialize_agent(
        tools=[Tool(name="Wikipedia", func=wiki_tool.run, description="Search Wikipedia")],
        llm=llm,
        agent_type="zero-shot-react-description",
        verbose=False,
    )

    result = agent_executor.invoke(f"Get recent facts, culture, and interview experience for {company_name}")
    return result


def generate_candidate_response(agent_input: CandidateInput) -> str:
    company_facts = get_company_context(agent_input.company_name)

    enriched_description = (
        agent_input.company_description.strip() + f"\n\nInsights:\n{company_facts}"
    )

    chain = candidate_prompt | llm

    response = chain.invoke({
        "resume_text": agent_input.resume_text,
        "job_type": agent_input.job_type,
        "domain": agent_input.domain,
        "job_description": agent_input.job_description,
        "company_name": agent_input.company_name,
        "company_description": enriched_description,
        "role_applying_for": agent_input.role_applying_for,
        "coding_level": agent_input.coding_level,
        "interview_duration": agent_input.duration_until_interview,
    })

    return str(response.content) if hasattr(response, "content") else str(response)
