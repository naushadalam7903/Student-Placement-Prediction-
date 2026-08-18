import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  Award,
  BarChart3,
  BrainCircuit,
  Database
} from "lucide-react";

export type PageTab = "dashboard" | "predict" | "result" | "models" | "features" | "explorer";

interface NavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  hasResult: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, hasResult }) => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#dashboard" onClick={() => setActiveTab("dashboard")} className="brand">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ lineHeight: 1.1 }}>PlacementIQ</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>
              AI Intelligence System
            </div>
          </div>
        </a>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === "predict" ? "active" : ""}`}
            onClick={() => setActiveTab("predict")}
          >
            <Sparkles size={16} />
            Student Prediction
          </button>
          {hasResult && (
            <button
              className={`nav-tab ${activeTab === "result" ? "active" : ""}`}
              onClick={() => setActiveTab("result")}
            >
              <Award size={16} />
              Prediction Result
            </button>
          )}
          <button
            className={`nav-tab ${activeTab === "models" ? "active" : ""}`}
            onClick={() => setActiveTab("models")}
          >
            <BarChart3 size={16} />
            Model Analytics
          </button>
          <button
            className={`nav-tab ${activeTab === "features" ? "active" : ""}`}
            onClick={() => setActiveTab("features")}
          >
            <BrainCircuit size={16} />
            Feature Intelligence
          </button>
          <button
            className={`nav-tab ${activeTab === "explorer" ? "active" : ""}`}
            onClick={() => setActiveTab("explorer")}
          >
            <Database size={16} />
            Data Explorer
          </button>
        </nav>

        <div className="system-status-pill">
          <span className="status-dot"></span>
          <span>FastAPI / ML Live</span>
        </div>
      </div>
    </header>
  );
};
