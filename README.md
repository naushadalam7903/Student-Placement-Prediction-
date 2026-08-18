# Student Placement Prediction & Intelligence System (PlacementIQ)

A machine-learning-based analytics platform and intelligence system that predicts student campus placement probability, identifies critical predictive factors, and generates personalized analytical career preparation suggestions.

Built with **FastAPI**, **Scikit-learn**, **Pandas**, **React (TypeScript)**, and **Vite**, trained and audited on an actual dataset of **100,000 student records**.

---

## Key Highlights

- **Real Machine Learning Pipeline**: Full offline model training, stratified evaluation, and hyperparameter tuning using scikit-learn.
- **Leakage Prevention**: Strictly dropped identifiers (`student_id`) and post-placement leakage features (`salary_package_lpa`).
- **Required Model Comparison**: Rigorously evaluates 4 required models (Logistic Regression, Random Forest, Support Vector Machine, K-Nearest Neighbors) plus HistGradientBoosting.
- **Fast Real-Time Inference**: Sub-10ms inference using pre-cached pipeline and model artifacts.
- **Explainability & Responsible AI**: Model-supported feature importances, Pearson correlations, clear distinction between correlation vs. causation, and ethical recommendations without demographic discrimination.
- **6 Modern Web Application Views**:
  1. **Dashboard**: High-level placement KPIs, branch & tier rates, CGPA vs. placement charts, and model benchmark summary.
  2. **Student Prediction**: Comprehensive multi-section profile input form with presets and real-time range validations.
  3. **Prediction Result**: Placement status hero card, calibrated probability meter, risk level badge, contributing factor attributions, and categorized action items.
  4. **Model Analytics**: Full model comparison table, confusion matrices, and hyperparameter tuning report.
  5. **Feature Intelligence**: Relative feature weights and statistical correlations.
  6. **Data Explorer**: Complete schema audit, missing value checks, and numerical distribution summaries.

---

## Dataset Schema & Audit Summary

- **Total Records**: 100,000 rows, 26 columns
- **Data Quality**: 0 missing values, 0 duplicate rows
- **Target Variable**: `placement_status` (54,459 Placed [54.46%], 45,541 Not Placed [45.54%])
- **Categorical Features (4)**: `gender`, `branch`, `college_tier`, `volunteer_experience`
- **Numerical Features (19)**: `age`, `cgpa`, `internships_count`, `projects_count`, `certifications_count`, `coding_skill_score`, `aptitude_score`, `communication_skill_score`, `logical_reasoning_score`, `hackathons_participated`, `github_repos`, `linkedin_connections`, `mock_interview_score`, `attendance_percentage`, `backlogs`, `extracurricular_score`, `leadership_score`, `sleep_hours`, `study_hours_per_day`

---

## Model Benchmark Results (Unseen Test Set: 20,000 Records)

| Model Architecture | Accuracy | Precision | Recall (Placed) | F1-Score | Recall (Not Placed) | Train Time |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Random Forest (Tuned)** | **56.50%** | **56.87%** | **83.50%** | **0.6765** | **24.60%** | **~8.2s** |
| **HistGradientBoosting** | 56.38% | 57.18% | 79.29% | 0.6644 | 28.99% | ~4.0s |
| **Support Vector Machine (LinearSVC Calibrated)** | 56.96% | 57.83% | 77.45% | 0.6626 | 32.27% | ~1.2s |
| **Logistic Regression** | 56.98% | 57.87% | 77.22% | 0.6616 | 32.77% | ~0.1s |
| **K-Nearest Neighbors (k=25)** | 53.37% | 54.12% | 71.60% | 0.6168 | 34.70% | ~0.02s |

---

## Project Structure

```text
py3/
├── backend/
│   └── app/
│       ├── main.py                  # FastAPI application entry point
│       ├── config.py                # Filepaths, feature lists & thresholds
│       ├── api/
│       │   ├── router.py            # Main API router (/api prefix)
│       │   ├── health.py            # GET /api/health
│       │   ├── model_info.py        # GET /api/model-info
│       │   ├── metrics.py           # GET /api/metrics
│       │   ├── features.py          # GET /api/features
│       │   ├── analytics.py         # GET /api/analytics & /api/data-explorer
│       │   └── predict.py           # POST /api/predict
│       ├── ml/
│       │   ├── data_loader.py       # Ingestion & data quality report
│       │   ├── preprocessor.py     # ColumnTransformer & StandardScaler / OneHotEncoder
│       │   ├── trainer.py           # Multi-model training and evaluation pipeline
│       │   ├── evaluator.py         # Accuracy, Precision, Recall, F1, Confusion Matrix
│       │   ├── tuner.py             # GridSearchCV hyperparameter tuning
│       │   ├── explainability.py   # Feature importance and correlations
│       │   └── recommender.py      # Profile-tailored recommendation engine
│       ├── models/                  # Serialized model & preprocessing artifacts
│       │   ├── model.pkl            # Final tuned classifier
│       │   ├── preprocessor.pkl     # Fitted ColumnTransformer
│       │   ├── metadata.json        # Training configuration & feature metadata
│       │   ├── metrics.json         # Complete benchmark comparison results
│       │   ├── features.json        # Feature importances & correlations
│       │   └── dataset_summary.json # Data quality audit summary
│       ├── schemas/                 # Pydantic validation schemas
│       └── services/                # Cached prediction and analytics services
├── frontend/                        # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── api/client.ts            # Typed API client
│   │   ├── components/              # Navbar, MetricCard, etc.
│   │   ├── pages/                   # 6 Application pages
│   │   ├── styles/index.css         # Modern design system CSS
│   │   ├── types/index.ts           # TypeScript interfaces
│   │   └── App.tsx                  # Root navigation & state container
├── scripts/
│   ├── train_models.py              # Offline ML training runner
│   └── run_app.py                   # One-click startup launcher for backend + frontend
├── tests/
│   ├── test_data_pipeline.py        # Data loading, leakage prevention & preprocessor tests
│   ├── test_ml_models.py            # Model artifacts & inference tests
│   └── test_api_endpoints.py        # FastAPI endpoints validation & prediction tests
├── requirements.txt
└── README.md
```

---

## Installation & Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Install Dependencies

```bash
# Install Python backend & ML dependencies
pip install -r requirements.txt

# Install Frontend dependencies
cd frontend
npm install
cd ..
```

---

## Running the Application

### Option A: One-Click Launcher (Recommended)
```bash
python scripts/run_app.py
```
This automatically boots both:
- **Backend API**: `http://127.0.0.1:8000` (Docs: `http://127.0.0.1:8000/docs`)
- **Frontend UI**: `http://127.0.0.1:5173`

### Option B: Running Separately

#### Backend Server
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Frontend Server
```bash
cd frontend
npm run dev
```

---

## Retraining the Machine Learning Pipeline

To re-run the full training, model comparison, tuning, and artifact serialization:
```bash
python scripts/train_models.py
```

---

## Running the Automated Test Suite

```bash
python -m pytest -v
```
Runs 15 unit and integration tests covering:
- Dataset loading & schema validation
- Target leakage prevention
- Preprocessor consistency
- Model artifact persistence
- Model probability calibration
- FastAPI prediction endpoint range validation and error handling

---

## API Documentation

### 1. `GET /api/health`
Health check verifying model and preprocessor are loaded in memory.

### 2. `GET /api/model-info`
Returns current model metadata, version, selection rationale, and training record counts.

### 3. `GET /api/metrics`
Returns performance metrics for all 4 required models, confusion matrices, and tuning reports.

### 4. `GET /api/features`
Returns model feature importances and dataset Pearson correlations.

### 5. `GET /api/analytics`
Returns dashboard dataset distributions (branch, tier, CGPA, internships).

### 6. `POST /api/predict`
Generates placement probability, risk level, contributing factors, and personalized recommendations.

**Sample Request Payload:**
```json
{
  "gender": "Male",
  "branch": "CSE",
  "college_tier": "Tier 1",
  "volunteer_experience": "Yes",
  "age": 21,
  "cgpa": 8.5,
  "internships_count": 2,
  "projects_count": 4,
  "certifications_count": 3,
  "coding_skill_score": 85.0,
  "aptitude_score": 78.0,
  "communication_skill_score": 82.0,
  "logical_reasoning_score": 80.0,
  "hackathons_participated": 2,
  "github_repos": 6,
  "linkedin_connections": 500,
  "mock_interview_score": 85.0,
  "attendance_percentage": 90.0,
  "backlogs": 0,
  "extracurricular_score": 70.0,
  "leadership_score": 65.0,
  "sleep_hours": 7.0,
  "study_hours_per_day": 4.0
}
```

---

## Responsible AI & Ethical Considerations

1. **Non-Discriminatory Advice**: Predictions and recommendations do not discriminate or suggest career modifications based on protected attributes such as gender.
2. **Estimates vs. Guarantees**: Model outputs are explicitly communicated as analytical statistical estimates rather than employment guarantees.
3. **Correlation vs. Causation**: Feature importances describe mathematical associations within historical training data and are not interpreted as direct causal guarantees.
