from typing import Dict, Any, Tuple
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
import numpy as np

def tune_candidate_model(best_model_name: str, X_train, y_train) -> Tuple[Any, Dict[str, Any]]:
    """
    Performs cross-validation hyperparameter tuning on the best model candidate.
    """
    if "Random Forest" in best_model_name:
        base_clf = RandomForestClassifier(random_state=42, n_jobs=-1)
        param_grid = {
            "n_estimators": [100, 150],
            "max_depth": [12, 16],
            "min_samples_split": [5, 10]
        }
    elif "Logistic" in best_model_name:
        base_clf = LogisticRegression(max_iter=1000, random_state=42)
        param_grid = {
            "C": [0.1, 1.0, 10.0],
            "class_weight": ["balanced", None]
        }
    elif "SVM" in best_model_name:
        base_clf = LinearSVC(dual=False, max_iter=2000, random_state=42)
        param_grid = {
            "C": [0.1, 1.0, 5.0],
            "class_weight": ["balanced", None]
        }
    else:
        base_clf = LogisticRegression(max_iter=1000, random_state=42)
        param_grid = {
            "C": [0.1, 1.0, 10.0]
        }

    # For efficient tuning on large dataset (80k rows), tune on a 30,000 stratified sample
    tune_size = min(30000, len(X_train))
    sample_idx = np.random.RandomState(42).choice(len(X_train), size=tune_size, replace=False)
    X_tune = X_train[sample_idx]
    y_tune = y_train.iloc[sample_idx] if hasattr(y_train, "iloc") else y_train[sample_idx]

    grid_search = GridSearchCV(
        estimator=base_clf,
        param_grid=param_grid,
        scoring="f1",
        cv=3,
        n_jobs=-1,
        verbose=0
    )
    
    # Fit grid search
    grid_search.fit(X_tune, y_tune)
    
    best_params = grid_search.best_params_
    print(f"Best Tuning Parameters found: {best_params} (CV F1: {grid_search.best_score_:.4f})", flush=True)

    # Refit best estimator on the full training set
    if "Random Forest" in best_model_name:
        final_best_estimator = RandomForestClassifier(**best_params, random_state=42, n_jobs=-1)
    elif "Logistic" in best_model_name:
        final_best_estimator = LogisticRegression(**best_params, max_iter=1000, random_state=42)
    elif "SVM" in best_model_name:
        svc = LinearSVC(**best_params, dual=False, max_iter=2000, random_state=42)
        final_best_estimator = CalibratedClassifierCV(svc, cv=3)
    else:
        final_best_estimator = LogisticRegression(max_iter=1000, random_state=42)

    final_best_estimator.fit(X_train, y_train)

    tuning_report = {
        "candidate_model": best_model_name,
        "best_parameters": best_params,
        "best_cv_f1_score": round(float(grid_search.best_score_), 4),
        "param_grid_tested": param_grid,
        "tuning_sample_size": tune_size
    }
    
    return final_best_estimator, tuning_report
