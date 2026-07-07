const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export const DEMO_BUSINESS_ID = import.meta.env.VITE_DEMO_BUSINESS_ID || "00000000-0000-0000-0000-000000000001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export interface DashboardData {
  business_id: string;
  industry: string;
  latest: { date: string | null; revenue: number; profit: number; average_order_value: number; orders: number };
  revenue_series: { date: string; revenue: number; profit: number; average_order_value: number; orders: number }[];
  top_products: { product?: string; dish?: string; revenue: number; units_sold: number }[];
  worst_products: { product?: string; dish?: string; revenue: number; units_sold: number }[];
  alerts_count: number;
}

export interface ForecastPoint {
  date: string;
  value: number;
  is_forecast: boolean;
  confidence: number | null;
}

export interface AlertItemData {
  severity: string;
  message: string;
  created_at: string;
}

export const api = {
  getDashboard: (businessId = DEMO_BUSINESS_ID) =>
    request<DashboardData>(`/dashboard/${businessId}`),

  getForecast: (businessId = DEMO_BUSINESS_ID, metric = "revenue", horizon = 30) =>
    request<{ metric: string; horizon_days: number; series: ForecastPoint[] }>(
      `/forecast/${businessId}?metric=${metric}&horizon=${horizon}`
    ),

  getAlerts: (businessId = DEMO_BUSINESS_ID) =>
    request<{ alerts: AlertItemData[] }>(`/alerts/${businessId}`),

  askCopilot: (question: string, businessId = DEMO_BUSINESS_ID) =>
    request<{ answer: string; computed_facts: Record<string, unknown> }>(`/copilot/ask`, {
      method: "POST",
      body: JSON.stringify({ business_id: businessId, question }),
    }),

  uploadDataset: async (file: File, dataset: "sales" | "inventory", businessId = DEMO_BUSINESS_ID) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/upload/${businessId}?dataset=${dataset}`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getReport: (
  reportType: "daily" | "weekly" | "monthly",
  businessId = DEMO_BUSINESS_ID
) =>
  request<{
    chart: any[];
    forecast: ForecastPoint[];
    top_products: any[];
    worst_products: any[];
  }>(`/report-data/${businessId}/${reportType}`),

  reportUrl: (businessId = DEMO_BUSINESS_ID, type = "weekly") =>
    `${BASE_URL}/reports/${businessId}/generate?report_type=${type}`,
};
