from pydantic import BaseModel
from typing import Optional
from typing import List, Dict


class InterviewerInput(BaseModel):
    resume_text: str 
    job_role: Optional[str] = None  


class CandidateInput(BaseModel):
    job_type: str 
    domain: str  
    job_description: str
    company_name: str
    company_description: str
    role_applying_for: str
    coding_level: str 
    duration_until_interview: str 
    resume_text: str  


class InterviewerState(BaseModel):
    input: InterviewerInput
    questions: Optional[list[str]] = None


class CandidateState(BaseModel):
    input: CandidateInput
    response: Optional[str] = None
