from pydantic import BaseModel
from typing import List, Literal, Optional, Union

class FreshInput(BaseModel):
    coding_level: Literal["basic", "intermediate", "advanced"]
    interests: List[str]
    self_description: str
    week_plan: int

class ResumeInput(BaseModel):
    resume_text: str
    traits: str
    week_plan: int

class PlannerState(BaseModel):
    input: Union[FreshInput, ResumeInput]
    domain: Optional[str] = None
    roadmap: Optional[str] = None
