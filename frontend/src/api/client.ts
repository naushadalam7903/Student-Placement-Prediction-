import type {
  StudentInput,
  PredictionResponse,
  MetricsData,
  FeaturesData,
  AnalyticsData,
  DataExplorerData
} from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export async function fetchHealth(): Promise<{ status: string; model_loaded: boolean }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Failed to fetch backend health status");
  return res.json();
}

export async function fetchModelInfo(): Promise<any> {
  const res = await fetch(`${API_BASE}/model-info`);
  if (!res.ok) throw new Error("Failed to fetch model info");
  return res.json();
}

export async function fetchMetrics(): Promise<MetricsData> {
  const res = await fetch(`${API_BASE}/metrics`);
  if (!res.ok) throw new Error("Failed to fetch model metrics");
  return res.json();
}

export async function fetchFeatures(): Promise<FeaturesData> {
  const res = await fetch(`${API_BASE}/features`);
  if (!res.ok) throw new Error("Failed to fetch features intelligence");
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error("Failed to fetch analytics dashboard data");
  return res.json();
}

export async function fetchDataExplorer(): Promise<DataExplorerData> {
  const res = await fetch(`${API_BASE}/data-explorer`);
  if (!res.ok) throw new Error("Failed to fetch dataset explorer data");
  return res.json();
}

export async function predictStudentPlacement(data: StudentInput): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const msg = errorBody?.detail || "Prediction request failed";
    throw new Error(msg);
  }
  return res.json();
}
