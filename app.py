from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
from pipeline.planner_agent import run_planner_agent
from agents.planner_agent.schema import FreshInput, ResumeInput
import json
app = FastAPI()

# CORS Configuration
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)