import pytest
import joblib
import json
import numpy as np
import pandas as pd
from backend.app.config import MODEL_FILE, PREPROCESSOR_FILE, METRICS_FILE, METADATA_FILE, FEATURES_FILE
from backend.app.services.prediction_service import prediction_service
from backend.app.schemas.predict_schema import StudentPredictionInput

def test_artifacts_exist():
    assert MODEL_FILE.exists()
    assert PREPROCESSOR_FILE.exists()
    assert METRICS_FILE.exists()
    assert METADATA_FILE.exists()
    assert FEATURES_FILE.exists()

def test_metrics_integrity():
    with open(METRICS_FILE, "r") as f:
        metrics = json.load(f)
    assert "model_comparison" in metrics
    assert "best_model_name" in metrics
    assert "comparison_table" in metrics
    assert len(metrics["comparison_table"]) >= 4
    
    # Check all required models exist in comparison table
    model_names = [m["model"] for m in metrics["comparison_table"]]
    assert "Logistic Regression" in model_names
    assert "Random Forest" in model_names
    assert "Support Vector Machine" in model_names
    assert "K-Nearest Neighbors" in model_names

def test_model_inference_and_probability():
    sample_input = StudentPredictionInput(
        gender="Male",
        branch="CSE",
        college_tier="Tier 1",
        volunteer_experience="Yes",
        age=22,
        cgpa=8.8,
        internships_count=2,
        projects_count=4,
        certifications_count=3,
        coding_skill_score=88.5,
        aptitude_score=85.0,
        communication_skill_score=82.0,
        logical_reasoning_score=86.0,
        hackathons_participated=3,
        github_repos=8,
        linkedin_connections=650,
        mock_interview_score=90.0,
        attendance_percentage=92.0,
        backlogs=0,
        extracurricular_score=75.0,
        leadership_score=80.0,
        sleep_hours=7.0,
        study_hours_per_day=5.0
    )
    
    response = prediction_service.predict_student(sample_input)
    assert response.prediction in ["Placed", "Not Placed"]
    assert response.placement_code in [0, 1]
    assert 0.0 <= response.probability <= 1.0
    assert response.risk_level in [
        "High Placement Probability",
        "Moderate Placement Probability",
        "Low Placement Probability"
    ]
    assert len(response.top_factors) > 0
    assert "category_recommendations" in response.recommendations
