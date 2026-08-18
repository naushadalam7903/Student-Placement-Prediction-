import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  accentColor = "var(--accent-primary)"
}) => {
  return (
    <div className="card metric-card">
      <div className="metric-header">
        <div>
          <span className="metric-label">{label}</span>
          <div className="metric-value">{value}</div>
        </div>
        <div className="metric-icon-box" style={{ color: accentColor }}>
          {icon}
        </div>
      </div>
      {subtext && <div className="metric-subtext">{subtext}</div>}
    </div>
  );
};
