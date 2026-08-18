import React, { useEffect, useState } from "react";
import { BarChart3, Trophy, Settings, Cpu } from "lucide-react";
import { fetchMetrics } from "../api/client";
import type { MetricsData } from "../types";

export const ModelAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        const data = await fetchMetrics();
        setMetrics(data);
        setSelectedModel(data.best_model_name);
      } catch (err: any) {
        setError(err.message || "Failed to load model analytics");
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <div className="status-dot" style={{ width: "20px", height: "20px", margin: "0 auto 1rem" }}></div>
        <p style={{ color: "var(--text-secondary)" }}>Loading machine learning model analytics & benchmarks...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="card" style={{ textAlign: "center", borderColor: "var(--accent-rose)", padding: "2rem" }}>
        <h3 style={{ color: "var(--accent-rose)" }}>Error Loading Model Metrics</h3>
        <p style={{ color: "var(--text-secondary)" }}>{error}</p>
      </div>
    );
  }

  const currentModelData = metrics.model_comparison[selectedModel] || metrics.model_comparison[metrics.best_model_name];
  const cm = currentModelData?.confusion_matrix;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <BarChart3 size={28} color="var(--accent-primary)" />
          Machine Learning Model Benchmark & Analytics
        </h1>
        <p className="page-subtitle">
          Rigorous comparison of 4 required baseline models + gradient boosting with cross-validated hyperparameter tuning.
        </p>
      </div>

      {/* Model Benchmark Comparison Table */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 className="card-title">
          <Trophy size={20} color="var(--accent-primary)" />
          Classifier Performance Comparison (Unseen Test Set: 20,000 records)
        </h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall (Placed)</th>
                <th>F1 Score</th>
                <th>Recall (Not Placed)</th>
                <th>Training Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.comparison_table.map((m) => {
                const isSelected = m.model === selectedModel;
                const isBest = m.model === metrics.best_model_name;
                return (
                  <tr
                    key={m.model}
                    className={isSelected ? "highlight" : ""}
                    onClick={() => setSelectedModel(m.model)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <strong>{m.model}</strong>
                        {isBest && <Trophy size={14} color="var(--accent-primary)" />}
                      </div>
                    </td>
                    <td>{(m.accuracy * 100).toFixed(2)}%</td>
                    <td>{(m.precision * 100).toFixed(2)}%</td>
                    <td>{(m.recall * 100).toFixed(2)}%</td>
                    <td>
                      <strong style={{ color: "var(--accent-primary)" }}>{(m.f1 * 100).toFixed(2)}%</strong>
                    </td>
                    <td>{(m.recall_not_placed * 100).toFixed(2)}%</td>
                    <td>{m.train_time_sec}s</td>
                    <td>
                      {isBest ? (
                        <span className="badge best">Winning Model</span>
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

      {/* Grid 2: Confusion Matrix & Model Details */}
      <div className="grid-2">
        {/* Confusion Matrix Card */}
        <div className="card">
          <h2 className="card-title">
            <Cpu size={20} color="var(--accent-cyan)" />
            Confusion Matrix: {selectedModel}
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
            Classification breakdown across 20,000 unseen test students:
          </p>

          {cm ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", textAlign: "center" }}>
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.25rem"
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  True Negative (TN)
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent-emerald)", margin: "0.25rem 0" }}>
                  {cm.tn.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Correctly Predicted Not Placed</div>
              </div>

              <div
                style={{
                  background: "rgba(244, 63, 94, 0.1)",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.25rem"
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  False Positive (FP)
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent-rose)", margin: "0.25rem 0" }}>
                  {cm.fp.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Incorrectly Predicted Placed</div>
              </div>

              <div
                style={{
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.25rem"
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  False Negative (FN)
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent-amber)", margin: "0.25rem 0" }}>
                  {cm.fn.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Incorrectly Predicted Not Placed</div>
              </div>

              <div
                style={{
                  background: "rgba(99, 102, 241, 0.1)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.25rem"
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  True Positive (TP)
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent-primary)", margin: "0.25rem 0" }}>
                  {cm.tp.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Correctly Predicted Placed</div>
              </div>
            </div>
          ) : (
            <p>No confusion matrix data available.</p>
          )}
        </div>

        {/* Hyperparameter Tuning Log */}
        <div className="card">
          <h2 className="card-title">
            <Settings size={20} color="var(--accent-primary)" />
            Hyperparameter Tuning & Optimization Report
          </h2>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Candidate Model:</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {metrics.tuning_report?.candidate_model || metrics.best_model_name}
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Best Parameters Found via GridSearchCV:</div>
            <div style={{ background: "#090D16", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", fontFamily: "monospace", fontSize: "0.8rem", color: "#A5B4FC" }}>
              {JSON.stringify(metrics.tuning_report?.best_parameters, null, 2)}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Before Tuning F1</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                {metrics.before_tuning_metrics?.f1 ? (metrics.before_tuning_metrics.f1 * 100).toFixed(2) + "%" : "N/A"}
              </div>
            </div>
            <div style={{ background: "rgba(99, 102, 241, 0.1)", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-active)" }}>
              <div style={{ fontSize: "0.75rem", color: "#A5B4FC" }}>After Tuning F1 (Test Set)</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#818CF8" }}>
                {metrics.tuned_metrics?.f1 ? (metrics.tuned_metrics.f1 * 100).toFixed(2) + "%" : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
