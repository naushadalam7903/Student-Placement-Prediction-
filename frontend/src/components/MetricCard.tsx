import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  accentColor?: string;
  trend?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  accentColor = "var(--green-700)",
  trend
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
      <div className="metric-subtext">
        {trend && <span className="green-badge-pill">{trend}</span>}
        <span>{subtext}</span>
      </div>
    </div>
  );
};
