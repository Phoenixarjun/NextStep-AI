from agents.job_agent.fetch_jobs import fetch_google_jobs, process_job_data
from agents.job_agent.schema import JobSearchInput
from agents.job_agent.prompt import suggestion_prompt
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os

load_dotenv()
llm = init_chat_model("google_genai:gemini-2.0-flash")


# 🔍 Resume ↔ Job similarity score
def calculate_resume_fit(resume_text: str, job_description: str) -> float:
    resume_words = set(resume_text.lower().split())
    job_words = set(job_description.lower().split())
    overlap = resume_words.intersection(job_words)
    score = len(overlap) / max(len(job_words), 1)
    return round(score * 100, 2)


# 🧠 For each job → generate insights, suggestions, score
def generate_job_suggestions(job: dict, resume_text: str) -> tuple:
    fit_score = calculate_resume_fit(resume_text, job.get("description", ""))
    
    # Prompt chain execution
    chain = suggestion_prompt | llm
    response = chain.invoke({
        "job_title": job.get("title", ""),
        "company_name": job.get("company_name", ""),
        "description": job.get("description", ""),
        "fit_score": fit_score,
        "resume_text": resume_text,
    })
    
    return response, fit_score


# 🔁 Orchestrates full job search + LLM enrichment
def generate_job_results(user_input: JobSearchInput) -> list:
    raw_jobs = fetch_google_jobs(
        query=f"{user_input.job_type} {user_input.mode}",
        location=user_input.city
    )
    processed_jobs = process_job_data(raw_jobs)

    results = []
    for job in processed_jobs:
        suggestions, fit_score = generate_job_suggestions(job, user_input.resume_text)
        results.append({
            "job": job,
            "fit_score": fit_score,
            "llm_suggestions": suggestions
        })

    results.sort(key=lambda x: x["fit_score"], reverse=True)

    return results
