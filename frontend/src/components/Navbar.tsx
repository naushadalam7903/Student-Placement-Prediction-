import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  Award,
  BarChart3,
  BrainCircuit,
  Database,
  Search,
  Bell
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
        {/* Brand Logo matching sample image */}
        <a href="#dashboard" onClick={() => setActiveTab("dashboard")} className="brand">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
            <span>PlacementIQ</span>
            <span className="brand-badge">PRO</span>
          </div>
        </a>

        {/* Center Pill Navigation */}
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={15} />
            Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === "predict" ? "active" : ""}`}
            onClick={() => setActiveTab("predict")}
          >
            <Sparkles size={15} />
            Predict Student
          </button>
          {hasResult && (
            <button
              className={`nav-tab ${activeTab === "result" ? "active" : ""}`}
              onClick={() => setActiveTab("result")}
            >
              <Award size={15} />
              Prediction Result
            </button>
          )}
          <button
            className={`nav-tab ${activeTab === "models" ? "active" : ""}`}
            onClick={() => setActiveTab("models")}
          >
            <BarChart3 size={15} />
            Model Analytics
          </button>
          <button
            className={`nav-tab ${activeTab === "features" ? "active" : ""}`}
            onClick={() => setActiveTab("features")}
          >
            <BrainCircuit size={15} />
            Feature Intelligence
          </button>
          <button
            className={`nav-tab ${activeTab === "explorer" ? "active" : ""}`}
            onClick={() => setActiveTab("explorer")}
          >
            <Database size={15} />
            Data Explorer
          </button>
        </nav>

        {/* Right side controls matching sample image */}
        <div className="nav-right-actions">
          <button className="icon-btn-round" title="Search Analytics">
            <Search size={16} />
          </button>
          <button className="icon-btn-round" style={{ position: "relative" }} title="Notifications">
            <Bell size={16} />
            <span style={{ position: "absolute", top: "7px", right: "7px", width: "7px", height: "7px", background: "var(--green-500)", borderRadius: "50%" }}></span>
          </button>
          
          <div className="system-status-pill">
            <span className="status-dot"></span>
            <span>API Online</span>
          </div>

          <div className="user-avatar-pill">
            <div className="avatar-img">AI</div>
            <span>Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
