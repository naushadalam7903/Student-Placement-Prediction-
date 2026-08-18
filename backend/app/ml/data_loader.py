import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any
from backend.app.config import DATA_PATH, DROP_COLUMNS, TARGET_COLUMN, CATEGORICAL_FEATURES, NUMERICAL_FEATURES

def load_raw_dataset(filepath: str = None) -> pd.DataFrame:
    """Loads the raw CSV dataset."""
    path = filepath or str(DATA_PATH)
    df = pd.read_csv(path)
    return df

def get_data_quality_report(df: pd.DataFrame) -> Dict[str, Any]:
    """Generates a complete data quality and statistical summary report."""
    num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    cat_cols = df.select_dtypes(include=['object', 'string']).columns.tolist()
    
    summary_stats = {}
    for col in num_cols:
        summary_stats[col] = {
            "min": float(df[col].min()),
            "mean": float(df[col].mean()),
            "median": float(df[col].median()),
            "max": float(df[col].max()),
            "std": float(df[col].std())
        }

    cat_distributions = {}
    for col in cat_cols:
        cat_distributions[col] = df[col].value_counts().to_dict()

    target_distribution = {}
    if TARGET_COLUMN in df.columns:
        target_distribution = df[TARGET_COLUMN].value_counts().to_dict()

    return {
        "num_rows": int(len(df)),
        "num_columns": int(len(df.columns)),
        "column_names": list(df.columns),
        "data_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
        "missing_values": {col: int(count) for col, count in df.isnull().sum().items()},
        "total_missing": int(df.isnull().sum().sum()),
        "duplicate_rows": int(df.duplicated().sum()),
        "unique_values": {col: int(df[col].nunique()) for col in df.columns},
        "numerical_summary": summary_stats,
        "categorical_distributions": cat_distributions,
        "target_distribution": target_distribution,
        "class_balance_percentage": {
            k: round(v / len(df) * 100, 2) for k, v in target_distribution.items()
        } if target_distribution else {}
    }

def prepare_features_and_target(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Separates features and target while strictly removing data leakage columns
    (student_id and salary_package_lpa).
    """
    columns_to_drop = [c for c in DROP_COLUMNS if c in df.columns]
    if TARGET_COLUMN in df.columns:
        columns_to_drop.append(TARGET_COLUMN)
        
    X = df.drop(columns=columns_to_drop).copy()
    
    # Verify exact required features exist
    for f in CATEGORICAL_FEATURES + NUMERICAL_FEATURES:
        if f not in X.columns:
            raise ValueError(f"Missing required feature in dataset: {f}")
            
    # Target encoding: Placed=1, Not Placed=0
    if TARGET_COLUMN in df.columns:
        y = (df[TARGET_COLUMN] == "Placed").astype(int)
    else:
        y = None
        
    return X, y
