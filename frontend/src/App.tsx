import { useState } from "react";
import { Navbar, type PageTab } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { StudentPrediction } from "./pages/StudentPrediction";
import { PredictionResult } from "./pages/PredictionResult";
import { ModelAnalytics } from "./pages/ModelAnalytics";
import { FeatureIntelligence } from "./pages/FeatureIntelligence";
import { DataExplorer } from "./pages/DataExplorer";
import type { PredictionResponse } from "./types";

export function App() {
  const [activeTab, setActiveTab] = useState<PageTab>("dashboard");
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  const handlePredictionComplete = (result: PredictionResponse) => {
    setPredictionResult(result);
    setActiveTab("result");
  };

  const handleResetPrediction = () => {
    setActiveTab("predict");
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasResult={predictionResult !== null}
      />

      <main className="main-content">
        {activeTab === "dashboard" && (
          <Dashboard onNavigateToPredict={() => setActiveTab("predict")} />
        )}

        {activeTab === "predict" && (
          <StudentPrediction onPredictionComplete={handlePredictionComplete} />
        )}

        {activeTab === "result" && predictionResult && (
          <PredictionResult
            result={predictionResult}
            onReset={handleResetPrediction}
            onViewModels={() => setActiveTab("models")}
          />
        )}

        {activeTab === "models" && <ModelAnalytics />}

        {activeTab === "features" && <FeatureIntelligence />}

        {activeTab === "explorer" && <DataExplorer />}
      </main>

      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "1.5rem", textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "auto" }}>
        <div>Student Placement Prediction & Intelligence Platform © 2026</div>
        <div style={{ marginTop: "0.25rem" }}>
          Production Machine Learning System built with FastAPI, Scikit-learn, and React.
        </div>
      </footer>
    </div>
  );
}

export default App;
