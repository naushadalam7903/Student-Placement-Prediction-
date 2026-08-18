import React from "react";
import {
  Award,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import type { PredictionResponse } from "../types";

interface PredictionResultProps {
  result: PredictionResponse;
  onReset: () => void;
  onViewModels: () => void;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
  result,
  onReset,
  onViewModels
}) => {
  const isPlaced = result.prediction === "Placed";
  
  const getRiskBadgeClass = () => {
    if (result.risk_level === "High Placement Probability") return "badge high-risk";
    if (result.risk_level === "Moderate Placement Probability") return "badge mod-risk";
    return "badge low-risk";
  };

  const getRiskGlow = () => {
    if (result.risk_level === "High Placement Probability") return "var(--shadow-glow-emerald)";
    if (result.risk_level === "Moderate Placement Probability") return "0 0 20px rgba(245, 158, 11, 0.25)";
    return "var(--shadow-glow-rose)";
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">
            <Award size={28} color="var(--accent-primary)" />
            Student Placement Assessment Result
          </h1>
          <p className="page-subtitle">
            Model inference completed at {new Date(result.timestamp).toLocaleTimeString()} using {result.model_name} (v{result.model_version}).
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="preset-btn" onClick={onReset} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <RotateCcw size={14} />
            New Prediction
          </button>
          <button className="preset-btn" onClick={onViewModels} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(99, 102, 241, 0.15)", color: "#A5B4FC" }}>
            <TrendingUp size={14} />
            Model Analytics
          </button>
        </div>
      </div>

      {/* Hero Outcome Card */}
      <div className="result-hero-card" style={{ boxShadow: getRiskGlow() }}>
        <div className="result-status-title">Predicted Placement Status</div>
        <div className={`result-status-val ${isPlaced ? "placed" : "not-placed"}`}>
          {result.prediction.toUpperCase()}
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <div className="result-prob-badge" style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 500 }}>Estimated Probability:</span>
            <span style={{ color: isPlaced ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
              {result.placement_probability_percentage}
            </span>
          </div>

          <div className={getRiskBadgeClass()} style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}>
            {result.risk_level}
          </div>
        </div>

        {/* Progress Bar representation */}
        <div style={{ maxWidth: "450px", margin: "0 auto 0.5rem" }}>
          <div className="bar-track" style={{ height: "12px" }}>
            <div
              className={`bar-fill ${result.probability >= 0.75 ? "emerald" : result.probability >= 0.45 ? "amber" : "rose"}`}
              style={{ width: `${result.probability * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Grid 2: Key Factors & Profile Strengths */}
      <div className="grid-2">
        {/* Top Contributing Model Factors */}
        <div className="card">
          <h2 className="card-title">
            <Sparkles size={20} color="var(--accent-primary)" />
            Top Model-Supported Contributing Factors
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            These profile parameters carry the highest predictive importance in the trained classification model:
          </p>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Your Value</th>
                  <th>Model Weight</th>
                  <th>Benchmark</th>
                </tr>
              </thead>
              <tbody>
                {result.top_factors.map((f) => (
                  <tr key={f.feature}>
                    <td>
                      <strong style={{ textTransform: "capitalize" }}>
                        {f.feature.replace(/_/g, " ")}
                      </strong>
                    </td>
                    <td>{String(f.student_value)}</td>
                    <td>
                      <span className="badge" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#A5B4FC" }}>
                        {f.importance_percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: f.benchmark_status === "Needs Attention" ? "rgba(244, 63, 94, 0.15)" : "rgba(16, 185, 129, 0.15)",
                          color: f.benchmark_status === "Needs Attention" ? "var(--accent-rose)" : "var(--accent-emerald)"
                        }}
                      >
                        {f.benchmark_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actionable Summary & Priority Focus */}
        <div className="card">
          <h2 className="card-title">
            <Lightbulb size={20} color="var(--accent-amber)" />
            Profile Strengths & Priority Focus
          </h2>

          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-emerald)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <CheckCircle2 size={16} />
              Validated Profile Strengths
            </div>
            {result.recommendations.key_strengths.length > 0 ? (
              <ul style={{ paddingLeft: "1.25rem", fontSize: "0.875rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {result.recommendations.key_strengths.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Focus on foundational skills to build strengths.</p>
            )}
          </div>

          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-amber)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <AlertTriangle size={16} />
              Priority Improvement Areas
            </div>
            {result.recommendations.priority_focus_areas.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {result.recommendations.priority_focus_areas.map((p, idx) => (
                  <span key={idx} className="badge" style={{ background: "rgba(245, 158, 11, 0.15)", color: "var(--accent-amber)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                    {p}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--accent-emerald)" }}>Profile meets all core benchmark thresholds!</p>
            )}
          </div>
        </div>
      </div>

      {/* Categorized Recommendations */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h2 className="card-title">
          <TrendingUp size={20} color="var(--accent-primary)" />
          Targeted Analytical Recommendations for Improvement
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
          Specific steps to increase placement competitiveness based on profile analysis:
        </p>

        <div className="grid-2" style={{ marginBottom: 0 }}>
          {/* Technical Development */}
          <div className="rec-category-card">
            <div className="rec-category-header">
              <span style={{ color: "var(--accent-cyan)" }}>•</span> Technical Development
            </div>
            {result.recommendations.category_recommendations.technical_development.length > 0 ? (
              result.recommendations.category_recommendations.technical_development.map((item, i) => (
                <div key={i} className="rec-item">
                  <div className="rec-text">
                    <strong style={{ color: "var(--text-primary)" }}>{item.area}: </strong>
                    {item.suggestion}
                  </div>
                  <span className={`impact-badge ${item.impact}`}>{item.impact}</span>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Technical metrics are in top tier.</p>
            )}
          </div>

          {/* Academic Preparation */}
          <div className="rec-category-card">
            <div className="rec-category-header">
              <span style={{ color: "var(--accent-primary)" }}>•</span> Academic Preparation
            </div>
            {result.recommendations.category_recommendations.academic_preparation.length > 0 ? (
              result.recommendations.category_recommendations.academic_preparation.map((item, i) => (
                <div key={i} className="rec-item">
                  <div className="rec-text">
                    <strong style={{ color: "var(--text-primary)" }}>{item.area}: </strong>
                    {item.suggestion}
                  </div>
                  <span className={`impact-badge ${item.impact}`}>{item.impact}</span>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Academic standing meets standard eligibility criteria.</p>
            )}
          </div>

          {/* Career Preparation */}
          <div className="rec-category-card">
            <div className="rec-category-header">
              <span style={{ color: "var(--accent-amber)" }}>•</span> Career & Interview Preparation
            </div>
            {result.recommendations.category_recommendations.career_preparation.length > 0 ? (
              result.recommendations.category_recommendations.career_preparation.map((item, i) => (
                <div key={i} className="rec-item">
                  <div className="rec-text">
                    <strong style={{ color: "var(--text-primary)" }}>{item.area}: </strong>
                    {item.suggestion}
                  </div>
                  <span className={`impact-badge ${item.impact}`}>{item.impact}</span>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Interview & internship parameters are well developed.</p>
            )}
          </div>

          {/* Personal Development */}
          <div className="rec-category-card">
            <div className="rec-category-header">
              <span style={{ color: "var(--accent-violet)" }}>•</span> Personal Development & Routine
            </div>
            {result.recommendations.category_recommendations.personal_development.length > 0 ? (
              result.recommendations.category_recommendations.personal_development.map((item, i) => (
                <div key={i} className="rec-item">
                  <div className="rec-text">
                    <strong style={{ color: "var(--text-primary)" }}>{item.area}: </strong>
                    {item.suggestion}
                  </div>
                  <span className={`impact-badge ${item.impact}`}>{item.impact}</span>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Balanced routine maintained.</p>
            )}
          </div>
        </div>
      </div>

      {/* Responsible AI Disclaimer */}
      <div className="disclaimer-banner">
        <ShieldCheck size={24} style={{ flexShrink: 0, color: "#818CF8" }} />
        <div>
          <strong>Responsible AI Notice: </strong>
          {result.responsible_ai_notice} Recommendations are analytical suggestions derived from historical pattern correlations and do not constitute an employment guarantee.
        </div>
      </div>
    </div>
  );
};
