import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["preprocessor_loaded"] is True

def test_model_info_endpoint():
    response = client.get("/api/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "best_model" in data
    assert "input_features" in data
    assert data["training_records"] == 80000

def test_metrics_endpoint():
    response = client.get("/api/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "comparison_table" in data
    assert "tuned_metrics" in data

def test_features_endpoint():
    response = client.get("/api/features")
    assert response.status_code == 200
    data = response.json()
    assert "feature_importances" in data
    assert "correlations" in data

def test_analytics_endpoint():
    response = client.get("/api/analytics")
    assert response.status_code == 200
    data = response.json()
    assert data["total_students"] == 100000
    assert "placement_by_branch" in data
    assert "placement_by_tier" in data

def test_valid_prediction():
    payload = {
        "gender": "Female",
        "branch": "IT",
        "college_tier": "Tier 2",
        "volunteer_experience": "No",
        "age": 21,
        "cgpa": 8.0,
        "internships_count": 1,
        "projects_count": 3,
        "certifications_count": 2,
        "coding_skill_score": 75.0,
        "aptitude_score": 70.0,
        "communication_skill_score": 72.0,
        "logical_reasoning_score": 68.0,
        "hackathons_participated": 1,
        "github_repos": 4,
        "linkedin_connections": 350,
        "mock_interview_score": 78.0,
        "attendance_percentage": 88.0,
        "backlogs": 0,
        "extracurricular_score": 60.0,
        "leadership_score": 55.0,
        "sleep_hours": 7.0,
        "study_hours_per_day": 3.5
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] in ["Placed", "Not Placed"]
    assert "probability" in data
    assert "risk_level" in data
    assert "recommendations" in data

def test_invalid_prediction_missing_field():
    payload = {
        "gender": "Male",
        "branch": "CSE"
        # missing required fields
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422

def test_invalid_prediction_out_of_range():
    payload = {
        "gender": "Male",
        "branch": "CSE",
        "college_tier": "Tier 1",
        "volunteer_experience": "Yes",
        "age": 21,
        "cgpa": 15.0, # Out of range: cgpa <= 10.0
        "internships_count": 2,
        "projects_count": 3,
        "certifications_count": 2,
        "coding_skill_score": 80.0,
        "aptitude_score": 75.0,
        "communication_skill_score": 80.0,
        "logical_reasoning_score": 70.0,
        "hackathons_participated": 1,
        "github_repos": 4,
        "linkedin_connections": 300,
        "mock_interview_score": 75.0,
        "attendance_percentage": 85.0,
        "backlogs": 0,
        "extracurricular_score": 60.0,
        "leadership_score": 50.0,
        "sleep_hours": 7.0,
        "study_hours_per_day": 3.0
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422
