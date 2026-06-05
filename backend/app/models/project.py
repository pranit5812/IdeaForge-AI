from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

class RoadmapMilestone(BaseModel):
    title: str
    timeline: str
    description: str

class OriginalityScores(BaseModel):
    innovation_score: int = Field(..., ge=0, le=100)
    commonness_score: int = Field(..., ge=0, le=100)
    trend_score: int = Field(..., ge=0, le=100)
    rationale: str

class QAPair(BaseModel):
    question: str
    answer: str

class VivaQuestions(BaseModel):
    technical: List[QAPair]
    hr: List[QAPair]
    architecture: List[QAPair]
    deployment: List[QAPair]

class ArchitectureFlow(BaseModel):
    overview: str = Field(
        default="",
        description="Plain-language summary of how data and requests move through the entire system from the user to storage and back.",
    )
    flow_steps: List[str] = Field(
        default_factory=list,
        description="Ordered, step-by-step narrative of the request lifecycle from user action to final response.",
    )
    frontend: str
    backend: str
    database: str
    api_flow: str

class ProjectIdea(BaseModel):
    title: str
    problem_statement: str
    features: List[str]
    tech_stack: List[str]
    future_scope: List[str]
    roadmap: List[RoadmapMilestone]
    datasets: List[str]
    difficulty: str
    resume_impact: int = Field(..., ge=1, le=100)
    originality: OriginalityScores
    architecture: ArchitectureFlow
    viva_questions: VivaQuestions

class ProjectCreateRequest(BaseModel):
    domain: str
    skills: List[str]
    difficulty: str
    team_size: int
    duration: str

class ProjectSaveRequest(BaseModel):
    project_data: ProjectIdea
    team_member_emails: Optional[List[EmailStr]] = []
    team_size: Optional[int] = Field(default=1, ge=1, le=4)

class ProjectOut(BaseModel):
    id: str
    user_id: str
    project_data: ProjectIdea
    created_at: datetime
    role: Optional[str] = "owner"
    owner_name: Optional[str] = None
    team_member_emails: Optional[List[str]] = []
