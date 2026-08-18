import React, { useEffect, useState } from "react";
import { BrainCircuit, TrendingUp, Sparkles, ShieldAlert } from "lucide-react";
import { fetchFeatures } from "../api/client";
import type { FeaturesData } from "../types";

export const FeatureIntelligence: React.FC = () => {
  const [featuresData, setFeaturesData] = useState<FeaturesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeatures() {
      try {
        setLoading(true);
        const data = await fetchFeatures();
        setFeaturesData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load feature intelligence data");
      } finally {
        setLoading(false);
      }
    }
    loadFeatures();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <div className="status-dot" style={{ width: "20px", height: "20px", margin: "0 auto 1rem" }}></div>
        <p style={{ color: "var(--text-secondary)" }}>Analyzing model feature importances & statistical correlations...</p>
      </div>
    );
  }

  if (error || !featuresData) {
    return (
      <div className="card" style={{ textAlign: "center", borderColor: "var(--accent-rose)", padding: "2rem" }}>
        <h3 style={{ color: "var(--accent-rose)" }}>Error Loading Feature Intelligence</h3>
        <p style={{ color: "var(--text-secondary)" }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <BrainCircuit size={28} color="var(--accent-primary)" />
          Feature Intelligence & Statistical Correlation Engine
        </h1>
        <p className="page-subtitle">
          Interpreting the mathematical drivers behind placement predictions using {featuresData.model_name}.
        </p>
      </div>

      {/* Correlation vs. Causation Disclaimer Banner */}
      <div
        style={{
          background: "rgba(245, 158, 11, 0.08)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          borderRadius: "var(--radius-md)",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
          marginBottom: "1.5rem"
        }}
      >
        <ShieldAlert size={22} style={{ flexShrink: 0, color: "var(--accent-amber)" }} />
        <div style={{ fontSize: "0.85rem", color: "#FDE68A" }}>
          <strong>Critical Methodological Note (Correlation $\neq$ Causation): </strong>
          Statistical correlation and model feature weights indicate predictive associations within historical placement data. They do not demonstrate direct causality. Changes in external factors, individual interview dynamics, company hiring quotas, and macroeconomic conditions also heavily influence hiring outcomes.
        </div>
      </div>

      {/* Grid 2: Feature Importance vs Statistical Correlation */}
      <div className="grid-2">
        {/* Model Feature Importance */}
        <div className="card">
          <h2 className="card-title">
            <Sparkles size={20} color="var(--accent-primary)" />
            Model Feature Importance ({featuresData.model_name})
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
            Relative predictive weight assigned to each feature in the ensemble tree architecture:
          </p>

          <div className="bar-chart-container">
            {featuresData.feature_importances.slice(0, 12).map((item) => (
              <div key={item.raw_feature_name} className="bar-row">
                <div className="bar-meta">
                  <span style={{ textTransform: "capitalize", color: "var(--text-primary)" }}>
                    {item.feature.replace(/_/g, " ")}
                  </span>
                  <span style={{ color: "var(--accent-primary)", fontWeight: 700 }}>
                    {item.importance.toFixed(2)}%
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill indigo"
                    style={{ width: `${Math.min(100, item.importance * 6)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Pearson Correlation with Target */}
        <div className="card">
          <h2 className="card-title">
            <TrendingUp size={20} color="var(--accent-cyan)" />
            Pearson Correlation with Placement Target
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
            Linear association strength with binary placement outcome ($+1$ = Placed, $0$ = Not Placed):
          </p>

          <div className="bar-chart-container">
            {featuresData.correlations.map((item) => {
              const isPos = item.direction === "Positive";
              return (
                <div key={item.feature} className="bar-row">
                  <div className="bar-meta">
                    <span style={{ textTransform: "capitalize", color: "var(--text-primary)" }}>
                      {item.feature.replace(/_/g, " ")}
                    </span>
                    <span style={{ color: isPos ? "var(--accent-emerald)" : "var(--accent-rose)", fontWeight: 700 }}>
                      {isPos ? "+" : ""}{item.correlation.toFixed(4)}
                    </span>
                  </div>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${isPos ? "emerald" : "rose"}`}
                      style={{ width: `${item.abs_correlation * 800}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
