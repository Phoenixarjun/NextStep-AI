from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn

from pipeline.planner_agent import run_planner_agent
from pipeline.resume_agent import run_resume_agent 
from pipeline.interview_agent import run_candidate_agent, run_interviewer_agent 
from pipeline.job_agent import run_job_agent


from agents.planner_agent.schema import FreshInput, ResumeInput
from agents.resume_agent.schema import ResumeAgentInput  
from agents.interview_agent.schema import CandidateInput, InterviewerInput
from agents.job_agent.schema import JobAgentInput

from pathlib import Path
import tempfile



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the NextStep AI Planner API"}

@app.post("/api/plan/manual")
async def generate_plan_from_form(request: Request):
    try:
        form_data = await request.form()
        interests = form_data.getlist("interests")
        if isinstance(interests, str):
            interests = [interests]
        input_data = FreshInput(
            coding_level=form_data["coding_level"].lower(),
            interests=interests,
            self_description=form_data["self_description"],
            week_plan=int(form_data["week_plan"])
        )
        result = run_planner_agent(input_data)
        print("Generated Plan:", result)
        return {
            "domain": result["domain"],
            "roadmap": result["roadmap"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/plan/resume")
async def generate_plan_from_resume(
    file: UploadFile = File(...),
    traits: str = Form(...),
    week_plan: int = Form(...)
):
    try:
        contents = await file.read()
        resume_text = contents.decode("utf-8", errors="ignore")
        input_data = ResumeInput(
            resume_text=resume_text,
            traits=traits,
            week_plan=week_plan
        )
        result = run_planner_agent(input_data)
        print("Generated Plan from Resume:", result)
        return {
            "domain": result["domain"],
            "roadmap": result["roadmap"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/resume")
async def run_resume_agent_api(
    file: UploadFile = File(...),
    job_type: str = Form(...),
    domain: str = Form(...),
    job_description: str = Form(...),
    company_name: str = Form(...),
    company_description: str = Form(...),
    role_applying_for: str = Form(...),
):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(await file.read())
            temp_path = Path(temp_file.name)


        input_data = ResumeAgentInput(
            resume_text=str(temp_path),  
            job_type=job_type,
            domain=domain,
            job_description=job_description,
            company_name=company_name,
            company_description=company_description,
            role_applying_for=role_applying_for,
        )

        result = run_resume_agent(input_data)
        try:
            temp_path.unlink()
        except Exception as cleanup_error:
            print(f"Warning: Could not delete temp file: {cleanup_error}")

        return result

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/interview")
async def run_interview_agent_api(
    file: UploadFile = File(...),
    mode: str = Form(...),
    job_type: str = Form(None),
    domain: str = Form(None),
    job_description: str = Form(None),
    company_name: str = Form(None),
    company_description: str = Form(None),
    role_applying_for: str = Form(None),
    coding_level: str = Form(None),
    days_until_interview: int = Form(None),
    job_role: str = Form(None),
):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(await file.read())
            temp_path = Path(temp_file.name)

        if mode == "candidate":
            input_data = CandidateInput(
                job_type=job_type,
                domain=domain,
                job_description=job_description,
                company_name=company_name,
                company_description=company_description,
                role_applying_for=role_applying_for,
                coding_level=coding_level,
                duration_until_interview=str(days_until_interview),
                resume_text=str(temp_path),
            )
            result = run_candidate_agent(input_data)
        elif mode == "interviewer":
            input_data = InterviewerInput(
                job_role=job_role,
                resume_text=str(temp_path)
            )
            result = run_interviewer_agent(input_data)
        else:
            raise HTTPException(status_code=400, detail="Invalid mode")

        try:
            temp_path.unlink()
        except Exception as cleanup_error:
            print(f"Warning: Could not delete temp file: {cleanup_error}")
        print("Interview Agent Result:", result)

        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/job-match")
async def job_match_agent_api(
    file: UploadFile = File(...),
    job_type: str = Form(...),
    city: str = Form(...),
    mode: str = Form(...),
    job_role: str = Form(...),  
):

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(await file.read())
            temp_path = Path(temp_file.name)

        input_data = JobAgentInput(
            job_type=job_type.strip(),
            job_role=job_role.strip(),
            city=city.strip(),
            mode=mode.strip().lower(),
            resume_path=str(temp_path)
        )

        result = run_job_agent(input_data)

        try:
            temp_path.unlink()
        except Exception as cleanup_error:
            print(f"Warning: Could not delete temp file: {cleanup_error}")

        if "results" not in result:
            raise HTTPException(status_code=500, detail="'results' key missing in response.")

        if not result["results"]:
            return {
                "job_matches": [],
                "message": "No job matches found. Try adjusting your preferences.",
            }

        return {
            "job_matches": result["results"],
            "message": f"Found {len(result['results'])} matching job(s)",
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))




if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
