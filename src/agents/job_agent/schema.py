from pydantic import BaseModel
from typing import Optional, List

class JobAgentInput(BaseModel):
    resume_path: str
    job_type: str
    city: str
    mode: str
    expected_ctc: Optional[str] = None
    years_of_experience: Optional[str] = None
    job_role: Optional[str] = None  

class JobResult(BaseModel):
    job_title: str
    company: str
    location: str
    fit_score: int
    reasons: List[str]
    improvements: List[str]
    interview_tips: List[str]
    job_url: Optional[str] = None
    company_insights: Optional[str] = None

class JobAgentState(BaseModel):
    input: JobAgentInput
    jobs: Optional[List[dict]] = None
    results: Optional[List[JobResult]] = None

class JobSearchInput(BaseModel):
    job_type: str
    city: str
    mode: str
    ctc: Optional[str] = None
    resume_text: str
    job_role: Optional[str] = None  
