from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, Literal, List, Union


class LinkedInInput(BaseModel):
    subcategory: Optional[str]
    title: str
    description: str
    achievements: Optional[List[str]] = None
    link: Optional[HttpUrl] = None
    tone: Optional[str] = "professional"


class GitHubInput(BaseModel):
    github_url: HttpUrl
    description: str
    tech_stack: Optional[List[str]] = Field(default_factory=list)
    tone: Optional[str] = "technical"


class TwitterInput(BaseModel):
    subcategory: Optional[str]
    title: str
    description: str
    tone: Optional[str] = "casual"
    link: Optional[str] = None
    hashtags: Optional[List[str]] = Field(default_factory=list)


class OtherInput(BaseModel):
    custom_input: str
    tone: Optional[str] = "neutral"


class ContentInput(BaseModel):
    category: Literal["linkedin", "github", "twitter", "other"]
    linkedin: Optional[LinkedInInput] = None
    github: Optional[GitHubInput] = None
    twitter: Optional[TwitterInput] = None
    other: Optional[OtherInput] = None


class ContentOutput(BaseModel):
    generated_text: Optional[str] = None
    error: Optional[str] = None
