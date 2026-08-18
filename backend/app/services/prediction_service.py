import joblib
import json
import datetime
import pandas as pd
import numpy as np
from typing import Dict, Any, Optional

from backend.app.config import (
    MODEL_FILE,
    PREPROCESSOR_FILE,
    METADATA_FILE,
    FEATURES_FILE,
    HIGH_RISK_THRESHOLD,
    MODERATE_RISK_THRESHOLD,
    CATEGORICAL_FEATURES,
    NUMERICAL_FEATURES,
    ALL_FEATURE_NAMES
)
from backend.app.schemas.predict_schema import StudentPredictionInput, PredictionResponse, ContributingFactor
from backend.app.ml.recommender import generate_student_recommendations

class PredictionService:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.metadata = {}
        self.features_info = {}
        self._load_artifacts()

    def _load_artifacts(self):
        """Loads and caches model and preprocessor artifacts into memory."""
        if MODEL_FILE.exists():
            self.model = joblib.load(MODEL_FILE)
        if PREPROCESSOR_FILE.exists():
            self.preprocessor = joblib.load(PREPROCESSOR_FILE)
        if METADATA_FILE.exists():
            with open(METADATA_FILE, "r") as f:
                self.metadata = json.load(f)
        if FEATURES_FILE.exists():
            with open(FEATURES_FILE, "r") as f:
                self.features_info = json.load(f)

    def is_ready(self) -> bool:
        return self.model is not None and self.preprocessor is not None

    def predict_student(self, student_data: StudentPredictionInput) -> PredictionResponse:
        if not self.is_ready():
            self._load_artifacts()
            if not self.is_ready():
                raise RuntimeError("Model artifacts not found. Please train models first.")

        # Convert Pydantic input to dict
        input_dict = student_data.model_dump()
        
        # Construct DataFrame in exact feature order
        df_input = pd.DataFrame([input_dict])

        # Preprocess input using fitted ColumnTransformer
        X_proc = self.preprocessor.transform(df_input)

        # Predict class and probability
        pred_code = int(self.model.predict(X_proc)[0])
        prediction_label = "Placed" if pred_code == 1 else "Not Placed"

        # Predict probability
        probability = 0.5
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(X_proc)[0]
            # Probability of Placed (class 1)
            probability = float(probs[1])
        elif hasattr(self.model, "decision_function"):
            dfunc = self.model.decision_function(X_proc)[0]
            probability = float(1 / (1 + np.exp(-dfunc)))

        # Risk Classification
        if probability >= HIGH_RISK_THRESHOLD:
            risk_level = "High Placement Probability"
        elif probability >= MODERATE_RISK_THRESHOLD:
            risk_level = "Moderate Placement Probability"
        else:
            risk_level = "Low Placement Probability"

        # Extract top contributing factors
        importances = self.features_info.get("feature_importances", [])
        top_factors = []
        for item in importances[:6]:
            feat_name = item["feature"]
            val = input_dict.get(feat_name, "N/A")
            
            # Simple benchmark check
            benchmark = "Optimal"
            if feat_name == "backlogs" and isinstance(val, (int, float)) and val > 0:
                benchmark = "Needs Attention"
            elif feat_name == "coding_skill_score" and isinstance(val, (int, float)) and val < 65:
                benchmark = "Below Average"
            elif feat_name == "cgpa" and isinstance(val, (int, float)) and val < 7.5:
                benchmark = "Moderate"
            elif feat_name == "internships_count" and isinstance(val, (int, float)) and val == 0:
                benchmark = "No Experience"
            elif isinstance(val, (int, float)) and val >= 70:
                benchmark = "Strong"

            top_factors.append(ContributingFactor(
                feature=feat_name,
                student_value=val,
                importance_percentage=item["importance"],
                benchmark_status=benchmark
            ))

        # Recommendations
        recommendations = generate_student_recommendations(
            student_profile=input_dict,
            top_factors=top_factors,
            prediction=prediction_label,
            probability=probability
        )

        return PredictionResponse(
            prediction=prediction_label,
            placement_code=pred_code,
            probability=round(probability, 4),
            placement_probability_percentage=f"{probability * 100:.1f}%",
            risk_level=risk_level,
            model_name=self.metadata.get("best_model", "Trained Classifier"),
            model_version=self.metadata.get("model_version", "1.0.0"),
            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            top_factors=top_factors,
            recommendations=recommendations,
            responsible_ai_notice="Model predictions and probabilities are statistical estimates based on historical placement training data and are not guaranteed real-world outcomes."
        )

prediction_service = PredictionService()
