from pydantic import BaseModel
from typing import Optional

class BotInput(BaseModel):
    query: str
    resume_text: Optional[str] = None

class BotOutput(BaseModel):
    response: str
    resume_text: Optional[str] = None
    error: Optional[str] = None