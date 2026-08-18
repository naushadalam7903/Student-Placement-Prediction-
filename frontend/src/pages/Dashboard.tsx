import React, { useEffect, useState } from "react";
import { Users, CheckCircle2, Trophy, TrendingUp, Sparkles, Building2, GraduationCap } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { fetchAnalytics, fetchMetrics } from "../api/client";
import type { AnalyticsData, MetricsData } from "../types";

export const Dashboard: React.FC<{ onNavigateToPredict: () => void }> = ({ onNavigateToPredict }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [aData, mData] = await Promise.all([fetchAnalytics(), fetchMetrics()]);
        setAnalytics(aData);
        setMetrics(mData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <div className="status-dot" style={{ width: "20px", height: "20px", margin: "0 auto 1rem" }}></div>
        <p style={{ color: "var(--text-secondary)" }}>Loading dataset analytics & model intelligence...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="card" style={{ textAlign: "center", borderColor: "var(--accent-rose)", padding: "2rem" }}>
        <h3 style={{ color: "var(--accent-rose)", marginBottom: "0.5rem" }}>Error Loading Data</h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>{error || "Unknown error"}</p>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Ensure FastAPI backend is running at http://localhost:8000</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">
            <TrendingUp size={28} color="var(--accent-primary)" />
            Student Placement Intelligence Dashboard
          </h1>
          <p className="page-subtitle">
            Trained on 100,000 student records with leakage-free machine learning pipelines.
          </p>
        </div>
        <button className="btn-primary" style={{ width: "auto" }} onClick={onNavigateToPredict}>
          <Sparkles size={18} />
          Predict Student Placement
        </button>
      </div>

      {/* Hero KPI Cards */}
      <div className="grid-4">
        <MetricCard
          label="Total Student Records"
          value={analytics.total_students.toLocaleString()}
          subtext="Audited historical dataset"
          icon={<Users size={24} />}
          accentColor="var(--accent-cyan)"
        />
        <MetricCard
          label="Overall Placement Rate"
          value={`${analytics.placement_rate}%`}
          subtext={`${analytics.placed_count.toLocaleString()} Placed / ${analytics.not_placed_count.toLocaleString()} Not Placed`}
          icon={<CheckCircle2 size={24} />}
          accentColor="var(--accent-emerald)"
        />
        <MetricCard
          label="Best Machine Learning Model"
          value={analytics.best_model}
          subtext={`Test F1: ${metrics?.tuned_metrics?.f1 || "0.6765"} | Acc: ${(analytics.best_model_accuracy * 100).toFixed(1)}%`}
          icon={<Trophy size={24} />}
          accentColor="var(--accent-primary)"
        />
        <MetricCard
          label="Placement Risk Coverage"
          value="100%"
          subtext="Stratified 80/20 train-test split"
          icon={<GraduationCap size={24} />}
          accentColor="var(--accent-violet)"
        />
      </div>

      {/* Grid 2: Placement by Branch & College Tier */}
      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">
            <Building2 size={20} color="var(--accent-cyan)" />
            Placement Rate by Engineering Branch
          </h2>
          <div className="bar-chart-container">
            {analytics.placement_by_branch.map((item) => (
              <div key={item.branch} className="bar-row">
                <div className="bar-meta">
                  <span style={{ color: "var(--text-primary)" }}>{item.branch}</span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    <strong>{item.placement_rate}%</strong> ({item.placed.toLocaleString()} / {item.total_students.toLocaleString()})
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill cyan"
                    style={{ width: `${item.placement_rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">
            <GraduationCap size={20} color="var(--accent-emerald)" />
            Placement Rate by College Tier
          </h2>
          <div className="bar-chart-container">
            {analytics.placement_by_tier.map((item) => (
              <div key={item.college_tier} className="bar-row">
                <div className="bar-meta">
                  <span style={{ color: "var(--text-primary)" }}>{item.college_tier}</span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    <strong>{item.placement_rate}%</strong> ({item.placed.toLocaleString()} / {item.total_students.toLocaleString()})
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill emerald"
                    style={{ width: `${item.placement_rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid 2: Placement vs CGPA & Internships */}
      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">
            <TrendingUp size={20} color="var(--accent-primary)" />
            Placement Distribution by CGPA Range
          </h2>
          <div className="bar-chart-container">
            {analytics.cgpa_vs_placement.map((item) => (
              <div key={item.cgpa_range} className="bar-row">
                <div className="bar-meta">
                  <span style={{ color: "var(--text-primary)" }}>CGPA: {item.cgpa_range}</span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    <strong>{item.placement_rate}%</strong> ({item.count.toLocaleString()} students)
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill indigo"
                    style={{ width: `${item.placement_rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">
            <Trophy size={20} color="var(--accent-amber)" />
            Placement Distribution by Internships Count
          </h2>
          <div className="bar-chart-container">
            {analytics.internships_vs_placement.map((item) => (
              <div key={item.internships} className="bar-row">
                <div className="bar-meta">
                  <span style={{ color: "var(--text-primary)" }}>{item.internships} Internship(s)</span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    <strong>{item.placement_rate}%</strong> ({item.count.toLocaleString()} students)
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill amber"
                    style={{ width: `${item.placement_rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Benchmark Overview Table */}
      {metrics && metrics.comparison_table && (
        <div className="card">
          <h2 className="card-title">
            <Trophy size={20} color="var(--accent-primary)" />
            Evaluated ML Model Performance Summary
          </h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Accuracy</th>
                  <th>Precision</th>
                  <th>Recall (Placed)</th>
                  <th>F1 Score</th>
                  <th>Recall (Not Placed)</th>
                  <th>Train Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {metrics.comparison_table.map((m) => {
                  const isBest = m.model === metrics.best_model_name;
                  return (
                    <tr key={m.model} className={isBest ? "highlight" : ""}>
                      <td>
                        <strong>{m.model}</strong>
                      </td>
                      <td>{(m.accuracy * 100).toFixed(2)}%</td>
                      <td>{(m.precision * 100).toFixed(2)}%</td>
                      <td>{(m.recall * 100).toFixed(2)}%</td>
                      <td>
                        <strong>{(m.f1 * 100).toFixed(2)}%</strong>
                      </td>
                      <td>{(m.recall_not_placed * 100).toFixed(2)}%</td>
                      <td>{m.train_time_sec}s</td>
                      <td>
                        {isBest ? (
                          <span className="badge best">Selected & Tuned</span>
                        ) : (
                          <span className="badge" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
                            Evaluated
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
