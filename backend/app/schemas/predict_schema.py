from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class StudentPredictionInput(BaseModel):
    gender: str = Field(..., description="Gender: Male, Female", examples=["Male"])
    branch: str = Field(..., description="Branch: CSE, IT, ECE, EEE, Mechanical, Civil", examples=["CSE"])
    college_tier: str = Field(..., description="College Tier: Tier 1, Tier 2, Tier 3", examples=["Tier 1"])
    volunteer_experience: str = Field(..., description="Volunteer Experience: Yes, No", examples=["Yes"])
    
    age: int = Field(..., ge=15, le=40, description="Age in years", examples=[21])
    cgpa: float = Field(..., ge=0.0, le=10.0, description="Cumulative Grade Point Average (0-10)", examples=[8.5])
    internships_count: int = Field(..., ge=0, le=20, description="Number of completed internships", examples=[2])
    projects_count: int = Field(..., ge=0, le=50, description="Number of completed academic/industry projects", examples=[4])
    certifications_count: int = Field(..., ge=0, le=30, description="Number of technical certifications", examples=[3])
    coding_skill_score: float = Field(..., ge=0.0, le=100.0, description="Coding assessment score (0-100)", examples=[85.0])
    aptitude_score: float = Field(..., ge=0.0, le=100.0, description="Aptitude score (0-100)", examples=[78.0])
    communication_skill_score: float = Field(..., ge=0.0, le=100.0, description="Communication skill score (0-100)", examples=[82.0])
    logical_reasoning_score: float = Field(..., ge=0.0, le=100.0, description="Logical reasoning score (0-100)", examples=[80.0])
    hackathons_participated: int = Field(..., ge=0, le=30, description="Number of hackathons participated in", examples=[2])
    github_repos: int = Field(..., ge=0, le=100, description="Number of public GitHub repositories", examples=[6])
    linkedin_connections: int = Field(..., ge=0, le=10000, description="Number of LinkedIn connections", examples=[500])
    mock_interview_score: float = Field(..., ge=0.0, le=100.0, description="Mock interview score (0-100)", examples=[85.0])
    attendance_percentage: float = Field(..., ge=0.0, le=100.0, description="Class attendance percentage (0-100)", examples=[90.0])
    backlogs: int = Field(..., ge=0, le=20, description="Current number of active backlogs", examples=[0])
    extracurricular_score: float = Field(..., ge=0.0, le=100.0, description="Extracurricular score (0-100)", examples=[70.0])
    leadership_score: float = Field(..., ge=0.0, le=100.0, description="Leadership score (0-100)", examples=[65.0])
    sleep_hours: float = Field(..., ge=0.0, le=24.0, description="Average sleep hours per day", examples=[7.0])
    study_hours_per_day: float = Field(..., ge=0.0, le=24.0, description="Average study hours per day", examples=[4.0])

class ContributingFactor(BaseModel):
    feature: str
    student_value: Any
    importance_percentage: float
    benchmark_status: str

class PredictionResponse(BaseModel):
    prediction: str = Field(..., description="'Placed' or 'Not Placed'")
    placement_code: int = Field(..., description="1 for Placed, 0 for Not Placed")
    probability: float = Field(..., description="Estimated placement probability (0.0 to 1.0)")
    placement_probability_percentage: str = Field(..., description="Formatted probability (e.g., '82.4%')")
    risk_level: str = Field(..., description="Placement risk category")
    model_name: str
    model_version: str
    timestamp: str
    top_factors: List[ContributingFactor]
    recommendations: Dict[str, Any]
    responsible_ai_notice: str
