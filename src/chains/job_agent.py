from langgraph.graph import StateGraph, END
from agents.job_agent.schema import JobAgentState
from agents.resume_agent.load_resume import load_resume
from agents.job_agent.fetch_jobs import fetch_google_jobs, process_job_data
from agents.job_agent.job_agent_response import generate_job_suggestions
import json
import re


def load_and_prepare_resume(state: JobAgentState) -> JobAgentState:
    resume_text = load_resume(state.input.resume_path)
    updated_input = state.input.copy(update={"resume_text": resume_text})
    return state.copy(update={"input": updated_input})

def fetch_matching_jobs(state: JobAgentState) -> JobAgentState:
    raw_jobs = fetch_google_jobs(
    job_role=state.input.job_role,
    job_type=state.input.job_type,
    mode=state.input.mode,
    city=state.input.city)
    jobs = process_job_data(raw_jobs)
    return state.copy(update={"jobs": jobs})



def clean_json_string(raw: str) -> str:
    """Removes triple backticks and markdown if present."""
    return re.sub(r"^```json|```$", "", raw.strip()).strip()


from langchain.schema import AIMessage  # Make sure you import this

def analyze_jobs_and_generate_recommendations(state: JobAgentState) -> JobAgentState:
    results = []

    for job in state.jobs:
        llm_response, fit_score = generate_job_suggestions(job, state.input.resume_text)

        # 🧼 Clean and parse JSON
        raw_content = llm_response.content if isinstance(llm_response, AIMessage) else str(llm_response)
        try:
            cleaned = clean_json_string(raw_content)
            parsed = json.loads(cleaned)
        except json.JSONDecodeError:
            print("❌ Failed to parse LLM output:\n", raw_content)
            parsed = {}

        result = {
            "job_title": job.get("title", ""),
            "company": job.get("company_name", ""),
            "location": job.get("location", ""),
            "fit_score": int(fit_score),
            "reasons": parsed.get("highlight_skills", ["Not provided"]),
            "improvements": parsed.get("revise_recommendations", ["No improvements suggested"]),
            "interview_tips": parsed.get("interview_tips", ["No tips available"]),
            "job_url": job.get("apply_options", [{}])[0].get("link", ""),
            "company_insights": (
                f"{parsed.get('company_summary', '')} — {parsed.get('role_summary', '')}"
                if parsed.get("company_summary") or parsed.get("role_summary") else "N/A"
            ),
            "fit_message": parsed.get("fit_message", "Not provided")
        }

        results.append(result)

    results.sort(key=lambda x: x["fit_score"], reverse=True)
    return state.copy(update={"results": results})




def start_node(state: JobAgentState) -> JobAgentState:
    return state

def build_job_graph():
    graph = StateGraph(JobAgentState)

    graph.add_node("start", start_node)
    graph.add_node("load_resume", load_and_prepare_resume)
    graph.add_node("fetch_jobs", fetch_matching_jobs)
    graph.add_node("score_and_suggest", analyze_jobs_and_generate_recommendations)

    graph.set_entry_point("start")
    graph.add_edge("start", "load_resume")
    graph.add_edge("load_resume", "fetch_jobs")
    graph.add_edge("fetch_jobs", "score_and_suggest")
    graph.add_edge("score_and_suggest", END)

    return graph.compile()
