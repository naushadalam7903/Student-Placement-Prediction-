import pandas as pd
import numpy as np
from typing import Dict, List, Any
from backend.app.config import NUMERICAL_FEATURES, CATEGORICAL_FEATURES

def extract_feature_importance(model, preprocessor) -> List[Dict[str, Any]]:
    """
    Extracts feature importances or model weights from the trained estimator.
    """
    feature_names = []
    
    # Get feature names from preprocessor
    try:
        feature_names = preprocessor.get_feature_names_out().tolist()
    except Exception:
        # Fallback names
        num_names = [f"num__{col}" for col in NUMERICAL_FEATURES]
        cat_names = [f"cat__{col}" for col in CATEGORICAL_FEATURES]
        feature_names = num_names + cat_names

    importances = None

    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    elif hasattr(model, "coef_"):
        importances = np.abs(model.coef_[0])
    elif hasattr(model, "calibrated_classifiers_"):
        # CalibratedClassifierCV wrapper
        coefs = []
        for clf in model.calibrated_classifiers_:
            base_estimator = clf.estimator if hasattr(clf, "estimator") else clf.base_estimator
            if hasattr(base_estimator, "coef_"):
                coefs.append(np.abs(base_estimator.coef_[0]))
        if coefs:
            importances = np.mean(coefs, axis=0)

    if importances is None or len(importances) != len(feature_names):
        # Fallback uniform importances if model is non-parametric (e.g. KNN)
        importances = np.ones(len(feature_names)) / len(feature_names)

    # Normalize to percentage sum = 100
    norm_importances = (importances / np.sum(importances)) * 100

    results = []
    for name, imp in zip(feature_names, norm_importances):
        clean_name = name.replace("num__", "").replace("cat__", "")
        results.append({
            "feature": clean_name,
            "raw_feature_name": name,
            "importance": round(float(imp), 2)
        })

    # Sort descending
    results.sort(key=lambda x: x["importance"], reverse=True)
    return results

def compute_dataset_correlations(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Computes Pearson correlations between numerical features and placement target.
    """
    if "placement_status" not in df.columns:
        return []
        
    y = (df["placement_status"] == "Placed").astype(int)
    num_cols = [col for col in NUMERICAL_FEATURES if col in df.columns]
    
    correlations = []
    for col in num_cols:
        corr = float(df[col].corr(y))
        correlations.append({
            "feature": col,
            "correlation": round(corr, 4),
            "abs_correlation": round(abs(corr), 4),
            "direction": "Positive" if corr >= 0 else "Negative"
        })
        
    correlations.sort(key=lambda x: x["abs_correlation"], reverse=True)
    return correlations
