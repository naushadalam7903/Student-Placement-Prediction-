from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    model_loaded: bool
    preprocessor_loaded: bool

class ModelInfoResponse(BaseModel):
    model_version: str
    created_at: str
    best_model: str
    selection_rationale: str
    input_features: List[str]
    categorical_features: List[str]
    numerical_features: List[str]
    training_records: int
    test_records: int
    random_state: int

class ModelMetricItem(BaseModel):
    model: str
    accuracy: float
    precision: float
    recall: float
    f1: float
    recall_not_placed: float
    train_time_sec: float

class MetricsResponse(BaseModel):
    best_model_name: str
    comparison_table: List[ModelMetricItem]
    model_comparison: Dict[str, Any]
    before_tuning_metrics: Dict[str, Any]
    tuned_metrics: Dict[str, Any]
    tuning_report: Dict[str, Any]

class FeatureImportanceItem(BaseModel):
    feature: str
    raw_feature_name: str
    importance: float

class CorrelationItem(BaseModel):
    feature: str
    correlation: float
    abs_correlation: float
    direction: str

class FeaturesResponse(BaseModel):
    model_name: str
    feature_importances: List[FeatureImportanceItem]
    correlations: List[CorrelationItem]

class AnalyticsResponse(BaseModel):
    total_students: int
    placement_rate: float
    placed_count: int
    not_placed_count: int
    best_model: str
    best_model_accuracy: float
    best_model_f1: float
    branch_distribution: Dict[str, Any]
    tier_distribution: Dict[str, Any]
    placement_by_branch: List[Dict[str, Any]]
    placement_by_tier: List[Dict[str, Any]]
    cgpa_vs_placement: List[Dict[str, Any]]
    internships_vs_placement: List[Dict[str, Any]]
    coding_vs_placement: List[Dict[str, Any]]
