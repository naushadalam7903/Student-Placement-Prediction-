import numpy as np
from typing import Dict, Any
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_auc_score
)

def evaluate_model(model, X_test, y_test) -> Dict[str, Any]:
    """
    Evaluates a trained classifier and returns a detailed metrics dictionary.
    """
    y_pred = model.predict(X_test)
    
    y_prob = None
    roc_auc = None
    if hasattr(model, "predict_proba"):
        try:
            y_prob = model.predict_proba(X_test)[:, 1]
            roc_auc = float(roc_auc_score(y_test, y_prob))
        except Exception:
            pass
    elif hasattr(model, "decision_function"):
        try:
            dfunc = model.decision_function(X_test)
            roc_auc = float(roc_auc_score(y_test, dfunc))
        except Exception:
            pass

    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()

    report = classification_report(y_test, y_pred, output_dict=True, target_names=["Not Placed", "Placed"])

    return {
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred)), 4),
        "recall": round(float(recall_score(y_test, y_pred)), 4),
        "f1": round(float(f1_score(y_test, y_pred)), 4),
        "recall_not_placed": round(float(recall_score(y_test, y_pred, pos_label=0)), 4),
        "precision_not_placed": round(float(precision_score(y_test, y_pred, pos_label=0)), 4),
        "f1_not_placed": round(float(f1_score(y_test, y_pred, pos_label=0)), 4),
        "macro_f1": round(float(f1_score(y_test, y_pred, average="macro")), 4),
        "roc_auc": round(roc_auc, 4) if roc_auc is not None else None,
        "confusion_matrix": {
            "tn": int(tn),
            "fp": int(fp),
            "fn": int(fn),
            "tp": int(tp),
            "matrix": [[int(tn), int(fp)], [int(fn), int(tp)]]
        },
        "classification_report": report
    }
