export interface StudentInput {
  gender: string;
  branch: string;
  college_tier: string;
  volunteer_experience: string;
  age: number;
  cgpa: number;
  internships_count: number;
  projects_count: number;
  certifications_count: number;
  coding_skill_score: number;
  aptitude_score: number;
  communication_skill_score: number;
  logical_reasoning_score: number;
  hackathons_participated: number;
  github_repos: number;
  linkedin_connections: number;
  mock_interview_score: number;
  attendance_percentage: number;
  backlogs: number;
  extracurricular_score: number;
  leadership_score: number;
  sleep_hours: number;
  study_hours_per_day: number;
}

export interface ContributingFactor {
  feature: string;
  student_value: string | number;
  importance_percentage: number;
  benchmark_status: string;
}

export interface RecommendationCategoryItem {
  area: string;
  suggestion: string;
  impact: "Critical" | "High" | "Medium" | "Low";
}

export interface Recommendations {
  disclaimer: string;
  key_strengths: string[];
  priority_focus_areas: string[];
  category_recommendations: {
    technical_development: RecommendationCategoryItem[];
    academic_preparation: RecommendationCategoryItem[];
    career_preparation: RecommendationCategoryItem[];
    personal_development: RecommendationCategoryItem[];
  };
}

export interface PredictionResponse {
  prediction: "Placed" | "Not Placed";
  placement_code: number;
  probability: number;
  placement_probability_percentage: string;
  risk_level: "High Placement Probability" | "Moderate Placement Probability" | "Low Placement Probability";
  model_name: string;
  model_version: string;
  timestamp: string;
  top_factors: ContributingFactor[];
  recommendations: Recommendations;
  responsible_ai_notice: string;
}

export interface ModelMetricItem {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  recall_not_placed: number;
  train_time_sec: number;
}

export interface MetricsData {
  best_model_name: string;
  comparison_table: ModelMetricItem[];
  model_comparison: Record<string, any>;
  before_tuning_metrics: any;
  tuned_metrics: any;
  tuning_report: any;
}

export interface FeatureImportanceItem {
  feature: string;
  raw_feature_name: string;
  importance: number;
}

export interface CorrelationItem {
  feature: string;
  correlation: number;
  abs_correlation: number;
  direction: "Positive" | "Negative";
}

export interface FeaturesData {
  model_name: string;
  feature_importances: FeatureImportanceItem[];
  correlations: CorrelationItem[];
}

export interface AnalyticsData {
  total_students: number;
  placement_rate: number;
  placed_count: number;
  not_placed_count: number;
  best_model: string;
  best_model_accuracy: number;
  best_model_f1: number;
  branch_distribution: Record<string, number>;
  tier_distribution: Record<string, number>;
  placement_by_branch: Array<{
    branch: string;
    placement_rate: number;
    total_students: number;
    placed: number;
    not_placed: number;
  }>;
  placement_by_tier: Array<{
    college_tier: string;
    placement_rate: number;
    total_students: number;
    placed: number;
    not_placed: number;
  }>;
  cgpa_vs_placement: Array<{
    cgpa_range: string;
    placement_rate: number;
    count: number;
  }>;
  internships_vs_placement: Array<{
    internships: string;
    placement_rate: number;
    count: number;
  }>;
  coding_vs_placement: Array<{
    score_range: string;
    placement_rate: number;
    count: number;
  }>;
}

export interface DataExplorerData {
  num_rows: number;
  num_columns: number;
  column_names: string[];
  data_types: Record<string, string>;
  missing_values: Record<string, number>;
  total_missing: number;
  duplicate_rows: number;
  unique_values: Record<string, number>;
  numerical_summary: Record<string, {
    min: number;
    mean: number;
    median: number;
    max: number;
    std: number;
  }>;
  categorical_distributions: Record<string, Record<string, number>>;
  target_distribution: Record<string, number>;
  class_balance_percentage: Record<string, number>;
}
