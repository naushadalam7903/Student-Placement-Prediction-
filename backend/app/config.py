import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR
DATA_PATH = DATA_DIR / "student_placement_prediction_dataset_2026.csv"
MODEL_DIR = BASE_DIR / "backend" / "app" / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_FILE = MODEL_DIR / "model.pkl"
PREPROCESSOR_FILE = MODEL_DIR / "preprocessor.pkl"
METRICS_FILE = MODEL_DIR / "metrics.json"
METADATA_FILE = MODEL_DIR / "metadata.json"
FEATURES_FILE = MODEL_DIR / "features.json"
DATASET_SUMMARY_FILE = MODEL_DIR / "dataset_summary.json"

# Leakage columns to drop
DROP_COLUMNS = ["student_id", "salary_package_lpa"]
TARGET_COLUMN = "placement_status"

# Categorical and Numerical features
CATEGORICAL_FEATURES = [
    "gender",
    "branch",
    "college_tier",
    "volunteer_experience"
]

NUMERICAL_FEATURES = [
    "age",
    "cgpa",
    "internships_count",
    "projects_count",
    "certifications_count",
    "coding_skill_score",
    "aptitude_score",
    "communication_skill_score",
    "logical_reasoning_score",
    "hackathons_participated",
    "github_repos",
    "linkedin_connections",
    "mock_interview_score",
    "attendance_percentage",
    "backlogs",
    "extracurricular_score",
    "leadership_score",
    "sleep_hours",
    "study_hours_per_day"
]

ALL_FEATURE_NAMES = CATEGORICAL_FEATURES + NUMERICAL_FEATURES

# Risk classification thresholds
HIGH_RISK_THRESHOLD = 0.75  # >= 75% -> High Placement Probability
MODERATE_RISK_THRESHOLD = 0.45  # 45% - 74.9% -> Moderate Placement Probability
# < 45% -> Low Placement Probability
