from pydantic import BaseModel
from typing import List, Optional

class InterviewAgentInput(BaseModel):
    domain: str
    job_type: str
    experience_level: str  
    resume_text: str
    job_description: Optional[str] = ""
    preferred_company: Optional[str] = ""
    mode: Optional[str] = "text"

class QuestionAnswer(BaseModel):
    question: str
    answer: str
    score: Optional[int] = None
    strengths: Optional[str] = None
    improvements: Optional[str] = None

class InterviewAgentState(BaseModel):
    input: InterviewAgentInput
    questions: Optional[List[str]] = None
    qa_pairs: Optional[List[QuestionAnswer]] = None
    summary: Optional[str] = None
    recommendations: Optional[List[str]] = None
