import pytest
import pandas as pd
import numpy as np
from backend.app.config import DATA_PATH, DROP_COLUMNS, TARGET_COLUMN, NUMERICAL_FEATURES, CATEGORICAL_FEATURES
from backend.app.ml.data_loader import load_raw_dataset, get_data_quality_report, prepare_features_and_target
from backend.app.ml.preprocessor import create_preprocessor

def test_raw_dataset_loading():
    df = load_raw_dataset()
    assert len(df) == 100000
    assert len(df.columns) == 26
    assert TARGET_COLUMN in df.columns
    assert "student_id" in df.columns
    assert "salary_package_lpa" in df.columns

def test_data_quality_report():
    df = load_raw_dataset()
    report = get_data_quality_report(df)
    assert report["num_rows"] == 100000
    assert report["num_columns"] == 26
    assert report["total_missing"] == 0
    assert report["duplicate_rows"] == 0
    assert "Placed" in report["target_distribution"]
    assert "Not Placed" in report["target_distribution"]

def test_leakage_prevention_and_preparation():
    df = load_raw_dataset()
    X, y = prepare_features_and_target(df)
    
    # Assert leakage columns are stripped
    for col in DROP_COLUMNS:
        assert col not in X.columns
    assert TARGET_COLUMN not in X.columns
    
    # Assert feature count: 4 categorical + 19 numerical = 23
    assert X.shape[1] == 23
    assert len(y) == 100000
    assert set(y.unique()) == {0, 1}

def test_preprocessor_transformation():
    df = load_raw_dataset()
    X, y = prepare_features_and_target(df)
    preprocessor = create_preprocessor()
    X_proc = preprocessor.fit_transform(X.head(100))
    
    assert X_proc.shape[0] == 100
    # Numerical features (19) + One-Hot encoded categories (1+5+2+1 = 9) = 28 columns
    assert X_proc.shape[1] > 23
    assert not np.isnan(X_proc).any()
