import time
import json
import joblib
import datetime
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.neighbors import KNeighborsClassifier

from backend.app.config import (
    MODEL_FILE,
    PREPROCESSOR_FILE,
    METRICS_FILE,
    METADATA_FILE,
    FEATURES_FILE,
    DATASET_SUMMARY_FILE,
    NUMERICAL_FEATURES,
    CATEGORICAL_FEATURES,
    ALL_FEATURE_NAMES
)
from backend.app.ml.data_loader import load_raw_dataset, get_data_quality_report, prepare_features_and_target
from backend.app.ml.preprocessor import create_preprocessor
from backend.app.ml.evaluator import evaluate_model
from backend.app.ml.explainability import extract_feature_importance, compute_dataset_correlations
from backend.app.ml.tuner import tune_candidate_model

def train_and_evaluate_all():
    """
    Executes end-to-end model training, evaluation, comparison, tuning, and artifact generation.
    """
    print("=== STEP 1: Ingesting dataset & computing data quality report ===", flush=True)
    df = load_raw_dataset()
    data_report = get_data_quality_report(df)
    with open(DATASET_SUMMARY_FILE, "w") as f:
        json.dump(data_report, f, indent=2)
    print(f"Data summary saved. Rows: {data_report['num_rows']}, Columns: {data_report['num_columns']}", flush=True)

    print("\n=== STEP 2: Preparing features and target (Leakage prevention) ===", flush=True)
    X, y = prepare_features_and_target(df)
    print(f"Features shape: {X.shape}, Target shape: {y.shape}", flush=True)

    print("\n=== STEP 3: Stratified 80/20 Train-Test Split (random_state=42) ===", flush=True)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Training set: {X_train.shape[0]} rows | Test set: {X_test.shape[0]} rows", flush=True)

    print("\n=== STEP 4: Fitting Preprocessing Pipeline ===", flush=True)
    preprocessor = create_preprocessor()
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)
    joblib.dump(preprocessor, PREPROCESSOR_FILE)
    print("Preprocessor fitted on train set and saved to preprocessor.pkl", flush=True)

    print("\n=== STEP 5: Training Required Classification Models ===", flush=True)
    
    # Required models
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1),
        "Support Vector Machine": CalibratedClassifierCV(LinearSVC(dual=False, max_iter=2000, random_state=42), cv=3),
        "HistGradientBoosting": HistGradientBoostingClassifier(max_iter=100, random_state=42)
    }

    all_metrics = {}
    model_objects = {}

    for name, clf in models.items():
        print(f"Training {name}...", end=" ", flush=True)
        t0 = time.time()
        clf.fit(X_train_proc, y_train)
        train_time = round(time.time() - t0, 3)
        
        metrics = evaluate_model(clf, X_test_proc, y_test)
        metrics["training_time_seconds"] = train_time
        metrics["model_name"] = name
        
        all_metrics[name] = metrics
        model_objects[name] = clf
        print(f"Done in {train_time}s | Accuracy: {metrics['accuracy']:.4f} | F1: {metrics['f1']:.4f} | Rec(Not Placed): {metrics['recall_not_placed']:.4f}", flush=True)

    # KNN with sample-based computational optimization per PRD section 17
    print("Training K-Nearest Neighbors (stratified optimization for 100k records)...", end=" ", flush=True)
    t0 = time.time()
    # Sample 15,000 representative training rows for KNN to evaluate in reasonable time
    knn_sample_idx = np.random.RandomState(42).choice(len(X_train_proc), size=15000, replace=False)
    knn_test_idx = np.random.RandomState(42).choice(len(X_test_proc), size=3000, replace=False)
    knn_clf = KNeighborsClassifier(n_neighbors=25, n_jobs=-1)
    knn_clf.fit(X_train_proc[knn_sample_idx], y_train.iloc[knn_sample_idx])
    train_time = round(time.time() - t0, 3)
    
    knn_metrics = evaluate_model(knn_clf, X_test_proc[knn_test_idx], y_test.iloc[knn_test_idx])
    knn_metrics["training_time_seconds"] = train_time
    knn_metrics["model_name"] = "K-Nearest Neighbors"
    all_metrics["K-Nearest Neighbors"] = knn_metrics
    model_objects["K-Nearest Neighbors"] = knn_clf
    print(f"Done in {train_time}s | Accuracy: {knn_metrics['accuracy']:.4f} | F1: {knn_metrics['f1']:.4f} | Rec(Not Placed): {knn_metrics['recall_not_placed']:.4f}", flush=True)

    print("\n=== STEP 6: Objective Model Comparison & Selection ===", flush=True)
    sorted_models = sorted(
        all_metrics.items(),
        key=lambda item: (item[1]["f1"], item[1]["accuracy"]),
        reverse=True
    )
    best_name = sorted_models[0][0]
    best_metrics = sorted_models[0][1]
    print(f"Selected Candidate for Tuning: {best_name} with test F1={best_metrics['f1']:.4f}, Acc={best_metrics['accuracy']:.4f}", flush=True)

    print("\n=== STEP 7: Hyperparameter Tuning ===", flush=True)
    tuned_model, tuning_report = tune_candidate_model(best_name, X_train_proc, y_train)
    tuned_metrics = evaluate_model(tuned_model, X_test_proc, y_test)
    print(f"Tuned Model Metrics -> Acc: {tuned_metrics['accuracy']:.4f} | F1: {tuned_metrics['f1']:.4f} | Recall: {tuned_metrics['recall']:.4f}", flush=True)

    print("\n=== STEP 8: Model Explainability & Correlation Analysis ===", flush=True)
    feature_importances = extract_feature_importance(tuned_model, preprocessor)
    correlations = compute_dataset_correlations(df)
    
    features_payload = {
        "model_name": best_name,
        "feature_importances": feature_importances,
        "correlations": correlations
    }
    with open(FEATURES_FILE, "w") as f:
        json.dump(features_payload, f, indent=2)

    print("\n=== STEP 9: Saving Model Artifacts & Metadata ===", flush=True)
    joblib.dump(tuned_model, MODEL_FILE)
    
    final_metrics_payload = {
        "model_comparison": all_metrics,
        "best_model_name": best_name,
        "before_tuning_metrics": best_metrics,
        "tuned_metrics": tuned_metrics,
        "tuning_report": tuning_report,
        "comparison_table": [
            {
                "model": k,
                "accuracy": v["accuracy"],
                "precision": v["precision"],
                "recall": v["recall"],
                "f1": v["f1"],
                "recall_not_placed": v["recall_not_placed"],
                "train_time_sec": v["training_time_seconds"]
            }
            for k, v in all_metrics.items()
        ]
    }
    with open(METRICS_FILE, "w") as f:
        json.dump(final_metrics_payload, f, indent=2)

    metadata_payload = {
        "model_version": "1.0.0",
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "best_model": best_name,
        "selection_rationale": f"Selected {best_name} due to highest test F1 score ({best_metrics['f1']:.4f}), strong balance of precision/recall, and robust generalization.",
        "input_features": ALL_FEATURE_NAMES,
        "categorical_features": CATEGORICAL_FEATURES,
        "numerical_features": NUMERICAL_FEATURES,
        "training_records": len(X_train),
        "test_records": len(X_test),
        "random_state": 42
    }
    with open(METADATA_FILE, "w") as f:
        json.dump(metadata_payload, f, indent=2)

    print("\n=== SUCCESS: All models trained, evaluated, tuned, and artifacts saved! ===", flush=True)
    return final_metrics_payload
