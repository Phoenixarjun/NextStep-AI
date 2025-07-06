from pydantic import BaseModel
from typing import Optional

class ResumeAgentInput(BaseModel):
    job_type: str               
    domain: str                 
    job_description: str    
    company_name: Optional[str] = None
    company_description: Optional[str] = None
    role_applying_for: Optional[str] = None
    resume_text: str            

class ResumeAgentState(BaseModel):
    input: ResumeAgentInput
    suggestions: Optional[str] = None  
