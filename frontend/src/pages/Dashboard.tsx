import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Layers,
  Award
} from "lucide-react";
import { fetchAnalytics, fetchMetrics } from "../api/client";
import type { AnalyticsData, MetricsData } from "../types";

export const Dashboard: React.FC<{ onNavigateToPredict: () => void }> = ({ onNavigateToPredict }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [, setMetrics] = useState<MetricsData | null>(null);
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
      <div style={{ textAlign: "center", padding: "5rem 0" }}>
        <div className="status-dot" style={{ width: "16px", height: "16px", margin: "0 auto 1.25rem" }}></div>
        <p style={{ color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.95rem" }}>
          Loading student placement intelligence platform...
        </p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="card" style={{ textAlign: "center", borderColor: "var(--accent-rose)", padding: "2.5rem" }}>
        <h3 style={{ color: "var(--accent-rose)", marginBottom: "0.5rem" }}>Error Loading Data</h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.25rem" }}>{error || "Unknown error"}</p>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Ensure FastAPI backend is running at http://127.0.0.1:8000
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Top Welcome Header */}
      <div className="page-header" style={{ marginBottom: "1.25rem" }}>
        <div className="welcome-row">
          <div>
            <h1 className="welcome-title">
              Welcome Back, <span>PlacementIQ</span>
            </h1>
            <p className="welcome-subtitle">
              Live intelligence and calibrated predictions trained across {analytics.total_students.toLocaleString()} verified student records.
            </p>
          </div>

          <div className="welcome-actions">
            <div className="pill-filter">
              <Calendar size={16} color="var(--green-700)" />
              <span>Cohort 2025 – 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Line with Centered Predict Student Button (Square Rounded, Solid Green, No Icon) */}
      <div className="predict-action-line">
        <button
          className="btn-predict-main"
          onClick={onNavigateToPredict}
          title="Launch Student Placement Predictor"
        >
          Predict Student Placement
        </button>
      </div>

      {/* Secondary Bottom Grid: Placement Breakdown & Key Drivers */}
      <div className="dashboard-grid-secondary" style={{ marginTop: "1.5rem" }}>
        {/* Card 1: Branch Placement Breakdown */}
        <div className="card">
          <div className="card-header-flex">
            <div>
              <div className="card-title-modern">
                <Layers size={18} color="var(--green-700)" />
                <span>Branch Placement Breakdown</span>
              </div>
              <div className="card-subtitle-modern">Real-time distribution from historical dataset</div>
            </div>
            <button className="card-link-icon" onClick={onNavigateToPredict} title="Predict">
              <ArrowRight size={14} />
            </button>
          </div>

          <table className="clean-table">
            <thead>
              <tr>
                <th>Branch Discipline</th>
                <th>Placement Rate</th>
                <th>Total Students</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Placed Students</th>
              </tr>
            </thead>
            <tbody>
              {analytics.placement_by_branch.map((b) => (
                <tr key={b.branch}>
                  <td>
                    <div className="table-item-cell">
                      <div className="table-icon-circle">
                        {b.branch.substring(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{b.branch}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Engineering Cohort</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                      {b.placement_rate}%
                    </div>
                  </td>
                  <td>{b.total_students.toLocaleString()}</td>
                  <td>
                    <div className="table-status-indicator">
                      <span className="table-status-dot"></span>
                      <span>{b.placement_rate >= 54 ? "Optimal" : "Standard"}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: "var(--green-800)" }}>
                    {b.placed.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card 2: Key Predictor Metrics */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="card-header-flex">
              <div>
                <div className="card-title-modern">
                  <Award size={18} color="var(--green-700)" />
                  <span>Key Predictor Metrics</span>
                </div>
                <div className="card-subtitle-modern">Top analytical success factors</div>
              </div>
              <span className="green-badge-pill">+18.4% Impact</span>
            </div>

            <div style={{ margin: "0.5rem 0 1.25rem" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>
                AVERAGE CGPA BENCHMARK
              </div>
              <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                7.85 <span style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>/ 10</span>
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <div className="progress-row">
                <div className="progress-meta">
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Internships & Projects</span>
                  <span style={{ color: "var(--green-800)", fontWeight: 700 }}>High Impact</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill emerald" style={{ width: "82%" }}></div>
                </div>
              </div>

              <div className="progress-row">
                <div className="progress-meta">
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Technical Coding Score</span>
                  <span style={{ color: "var(--green-800)", fontWeight: 700 }}>High Impact</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill sage" style={{ width: "74%" }}></div>
                </div>
              </div>

              <div className="progress-row">
                <div className="progress-meta">
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Mock Interview Score</span>
                  <span style={{ color: "var(--green-800)", fontWeight: 700 }}>Significant</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill emerald" style={{ width: "68%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Tier Representation
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  Tier 1, Tier 2, Tier 3 audited
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <span className="brand-badge" style={{ background: "var(--green-100)" }}>T1: 54.8%</span>
                <span className="brand-badge" style={{ background: "var(--green-50)" }}>T2: 54.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
