from pydantic import BaseModel
from typing import Optional

class ResumeAgentInput(BaseModel):
    job_type: str               
    domain: str                 
    job_description: str    
    resume_text: str            

class ResumeAgentState(BaseModel):
    input: ResumeAgentInput
    suggestions: Optional[str] = None  
