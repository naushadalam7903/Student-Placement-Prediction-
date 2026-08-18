import json
import pandas as pd
import numpy as np
from typing import Dict, Any, List

from backend.app.config import (
    DATA_PATH,
    DATASET_SUMMARY_FILE,
    METRICS_FILE,
    METADATA_FILE,
    FEATURES_FILE,
    NUMERICAL_FEATURES,
    CATEGORICAL_FEATURES
)

class AnalyticsService:
    def __init__(self):
        self._df = None

    def get_dataset(self) -> pd.DataFrame:
        if self._df is None:
            self._df = pd.read_csv(DATA_PATH)
        return self._df

    def get_model_info(self) -> Dict[str, Any]:
        if METADATA_FILE.exists():
            with open(METADATA_FILE, "r") as f:
                return json.load(f)
        return {"status": "Model metadata not yet generated"}

    def get_metrics(self) -> Dict[str, Any]:
        if METRICS_FILE.exists():
            with open(METRICS_FILE, "r") as f:
                return json.load(f)
        return {"status": "Metrics not yet generated"}

    def get_features(self) -> Dict[str, Any]:
        if FEATURES_FILE.exists():
            with open(FEATURES_FILE, "r") as f:
                return json.load(f)
        return {"status": "Features info not yet generated"}

    def get_data_explorer_data(self) -> Dict[str, Any]:
        if DATASET_SUMMARY_FILE.exists():
            with open(DATASET_SUMMARY_FILE, "r") as f:
                return json.load(f)
        return {"status": "Data summary not yet generated"}

    def get_analytics_dashboard_data(self) -> Dict[str, Any]:
        df = self.get_dataset()
        total_students = len(df)
        placed_count = int((df["placement_status"] == "Placed").sum())
        not_placed_count = int((df["placement_status"] == "Not Placed").sum())
        placement_rate = round((placed_count / total_students) * 100, 2)

        # Placement by Branch
        branch_stats = df.groupby("branch")["placement_status"].value_counts(normalize=True).unstack().fillna(0)
        placement_by_branch = []
        for branch, row in branch_stats.iterrows():
            total = int((df["branch"] == branch).sum())
            placed_p = round(float(row.get("Placed", 0)) * 100, 2)
            placement_by_branch.append({
                "branch": branch,
                "placement_rate": placed_p,
                "total_students": total,
                "placed": int((df[df["branch"] == branch]["placement_status"] == "Placed").sum()),
                "not_placed": int((df[df["branch"] == branch]["placement_status"] == "Not Placed").sum())
            })

        # Placement by College Tier
        tier_stats = df.groupby("college_tier")["placement_status"].value_counts(normalize=True).unstack().fillna(0)
        placement_by_tier = []
        for tier, row in tier_stats.iterrows():
            total = int((df["college_tier"] == tier).sum())
            placed_p = round(float(row.get("Placed", 0)) * 100, 2)
            placement_by_tier.append({
                "college_tier": tier,
                "placement_rate": placed_p,
                "total_students": total,
                "placed": int((df[df["college_tier"] == tier]["placement_status"] == "Placed").sum()),
                "not_placed": int((df[df["college_tier"] == tier]["placement_status"] == "Not Placed").sum())
            })

        # CGPA vs Placement bins
        df["cgpa_bin"] = pd.cut(df["cgpa"], bins=[4.0, 6.0, 7.0, 8.0, 9.0, 10.0], labels=["<6.0", "6.0-7.0", "7.0-8.0", "8.0-9.0", "9.0-10.0"])
        cgpa_stats = df.groupby("cgpa_bin", observed=False)["placement_status"].value_counts(normalize=True).unstack().fillna(0)
        cgpa_vs_placement = []
        for bin_name, row in cgpa_stats.iterrows():
            cgpa_vs_placement.append({
                "cgpa_range": str(bin_name),
                "placement_rate": round(float(row.get("Placed", 0)) * 100, 2),
                "count": int((df["cgpa_bin"] == bin_name).sum())
            })

        # Internships vs Placement
        df["internships_bin"] = df["internships_count"].apply(lambda x: f"{x}" if x < 4 else "4+")
        internship_stats = df.groupby("internships_bin")["placement_status"].value_counts(normalize=True).unstack().fillna(0)
        internships_vs_placement = []
        for bin_name in ["0", "1", "2", "3", "4+"]:
            if bin_name in internship_stats.index:
                row = internship_stats.loc[bin_name]
                internships_vs_placement.append({
                    "internships": bin_name,
                    "placement_rate": round(float(row.get("Placed", 0)) * 100, 2),
                    "count": int((df["internships_bin"] == bin_name).sum())
                })

        # Coding Score vs Placement bins
        df["coding_bin"] = pd.cut(df["coding_skill_score"], bins=[0, 40, 60, 80, 100], labels=["<40", "40-60", "60-80", "80-100"])
        coding_stats = df.groupby("coding_bin", observed=False)["placement_status"].value_counts(normalize=True).unstack().fillna(0)
        coding_vs_placement = []
        for bin_name, row in coding_stats.iterrows():
            coding_vs_placement.append({
                "score_range": str(bin_name),
                "placement_rate": round(float(row.get("Placed", 0)) * 100, 2),
                "count": int((df["coding_bin"] == bin_name).sum())
            })

        metrics_data = self.get_metrics()
        best_model = metrics_data.get("best_model_name", "Random Forest")
        best_acc = 0.0
        best_f1 = 0.0
        if "tuned_metrics" in metrics_data:
            best_acc = metrics_data["tuned_metrics"].get("accuracy", 0.0)
            best_f1 = metrics_data["tuned_metrics"].get("f1", 0.0)

        return {
            "total_students": total_students,
            "placement_rate": placement_rate,
            "placed_count": placed_count,
            "not_placed_count": not_placed_count,
            "best_model": best_model,
            "best_model_accuracy": best_acc,
            "best_model_f1": best_f1,
            "branch_distribution": df["branch"].value_counts().to_dict(),
            "tier_distribution": df["college_tier"].value_counts().to_dict(),
            "placement_by_branch": placement_by_branch,
            "placement_by_tier": placement_by_tier,
            "cgpa_vs_placement": cgpa_vs_placement,
            "internships_vs_placement": internships_vs_placement,
            "coding_vs_placement": coding_vs_placement
        }

analytics_service = AnalyticsService()
