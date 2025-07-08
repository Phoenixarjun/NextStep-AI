from serpapi import GoogleSearch
from dotenv import load_dotenv
import os
import json

load_dotenv()

def fetch_google_jobs(job_role: str, job_type: str, mode: str, city: str) -> list:
    query_parts = [job_role, job_type, mode]
    query = " ".join(part for part in query_parts if part).strip()
    location = city

    search = GoogleSearch({
        "engine": "google_jobs",
        "q": query,
        "location": location,
        "api_key": os.getenv("SERP_API_KEY")  
    })

    results = search.get_dict()
    return results.get("jobs_results", [])


def process_job_data(jobs: list) -> list:
    processed_jobs = []
    
    for job in jobs:
        processed_job = {
            "title": job.get("title", ""),
            "company_name": job.get("company_name", ""),
            "location": job.get("location", ""),
            "via": job.get("via", ""),
            "posted_at": job.get("detected_extensions", {}).get("posted_at", ""),
            "schedule_type": job.get("detected_extensions", {}).get("schedule_type", ""),
            "qualifications": job.get("detected_extensions", {}).get("qualifications", ""),
            "description": job.get("description", ""),
            "job_id": job.get("job_id", ""),
            "apply_options": [{
                "title": option.get("title", ""),
                "link": option.get("link", "")
            } for option in job.get("apply_options", [])]
        }
        
        if "thumbnail" in job:
            processed_job["thumbnail"] = job["thumbnail"]
            
        processed_jobs.append(processed_job)
    
    return processed_jobs

if __name__ == "__main__":
    job_role = "Software Engineer"
    job_type = "Full-time"
    mode = "Onsite"
    city = "Chennai"
    jobs = fetch_google_jobs(job_role, job_type, mode, city)
    if not jobs:
        print("No jobs found for the given criteria.")
        exit(0)
    processed_jobs = process_job_data(jobs)
    
    json_output = json.dumps(processed_jobs, indent=2)
    print(json_output)
    