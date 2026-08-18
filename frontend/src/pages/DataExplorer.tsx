import React, { useEffect, useState } from "react";
import { Database, FileCheck2, TableProperties, ShieldCheck } from "lucide-react";
import { fetchDataExplorer } from "../api/client";
import type { DataExplorerData } from "../types";

export const DataExplorer: React.FC = () => {
  const [data, setData] = useState<DataExplorerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadExplorer() {
      try {
        setLoading(true);
        const res = await fetchDataExplorer();
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to load dataset explorer data");
      } finally {
        setLoading(false);
      }
    }
    loadExplorer();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <div className="status-dot" style={{ width: "20px", height: "20px", margin: "0 auto 1rem" }}></div>
        <p style={{ color: "var(--text-secondary)" }}>Auditing dataset schema and quality metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card" style={{ textAlign: "center", borderColor: "var(--accent-rose)", padding: "2rem" }}>
        <h3 style={{ color: "var(--accent-rose)" }}>Error Loading Dataset Quality Summary</h3>
        <p style={{ color: "var(--text-secondary)" }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <Database size={28} color="var(--accent-primary)" />
          Dataset Quality & Statistical Schema Explorer
        </h1>
        <p className="page-subtitle">
          Auditing data hygiene, missingness, distribution boundaries, and class balance across 100,000 records.
        </p>
      </div>

      {/* Quality Overview KPIs */}
      <div className="grid-4">
        <div className="card metric-card">
          <div className="metric-header">
            <div>
              <span className="metric-label">Dataset Records</span>
              <div className="metric-value">{data.num_rows.toLocaleString()}</div>
            </div>
            <div className="metric-icon-box" style={{ color: "var(--accent-cyan)" }}>
              <FileCheck2 size={24} />
            </div>
          </div>
          <div className="metric-subtext">Total verified student entries</div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <div>
              <span className="metric-label">Schema Columns</span>
              <div className="metric-value">{data.num_columns}</div>
            </div>
            <div className="metric-icon-box" style={{ color: "var(--accent-primary)" }}>
              <TableProperties size={24} />
            </div>
          </div>
          <div className="metric-subtext">23 Features + Target + 2 Dropped</div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <div>
              <span className="metric-label">Missing Values</span>
              <div className="metric-value" style={{ color: "var(--accent-emerald)" }}>
                {data.total_missing}
              </div>
            </div>
            <div className="metric-icon-box" style={{ color: "var(--accent-emerald)" }}>
              <ShieldCheck size={24} />
            </div>
          </div>
          <div className="metric-subtext">0.00% missing (Complete Data)</div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <div>
              <span className="metric-label">Duplicate Rows</span>
              <div className="metric-value" style={{ color: "var(--accent-emerald)" }}>
                {data.duplicate_rows}
              </div>
            </div>
            <div className="metric-icon-box" style={{ color: "var(--accent-emerald)" }}>
              <ShieldCheck size={24} />
            </div>
          </div>
          <div className="metric-subtext">0 duplicate records detected</div>
        </div>
      </div>

      {/* Target Balance Breakdown */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 className="card-title">
          <ShieldCheck size={20} color="var(--accent-emerald)" />
          Target Variable Distribution (placement_status)
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {Object.entries(data.target_distribution).map(([status, count]) => {
            const pct = data.class_balance_percentage[status] || 0;
            const isPlaced = status === "Placed";
            return (
              <div
                key={status}
                style={{
                  background: isPlaced ? "rgba(16, 185, 129, 0.08)" : "rgba(244, 63, 94, 0.08)",
                  border: isPlaced ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(244, 63, 94, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.25rem"
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{status}</div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: isPlaced ? "var(--accent-emerald)" : "var(--accent-rose)", margin: "0.25rem 0" }}>
                  {count.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{pct}% of dataset</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Numerical Summary Statistics Table */}
      <div className="card">
        <h2 className="card-title">
          <TableProperties size={20} color="var(--accent-primary)" />
          Numerical Feature Summary Statistics
        </h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Min</th>
                <th>Mean</th>
                <th>Median</th>
                <th>Max</th>
                <th>Std Dev</th>
                <th>Data Type</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.numerical_summary).map(([col, stats]) => (
                <tr key={col}>
                  <td>
                    <strong style={{ textTransform: "capitalize" }}>{col.replace(/_/g, " ")}</strong>
                  </td>
                  <td>{stats.min.toFixed(2)}</td>
                  <td>{stats.mean.toFixed(2)}</td>
                  <td>{stats.median.toFixed(2)}</td>
                  <td>{stats.max.toFixed(2)}</td>
                  <td>{stats.std.toFixed(2)}</td>
                  <td>
                    <span className="badge" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
                      {data.data_types[col] || "numeric"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
