import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { api, DashboardData, ForecastPoint } from "../lib/api";

const COLORS = [
  "#E08D2C",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EF4444",
  "#14B8A6",
  "#F59E0B",
];

const REPORT_TITLES = {
  daily: "Daily Report",
  weekly: "Weekly Report",
  monthly: "Monthly Report",
} as const;

export default function ReportView() {
  const { type = "weekly" } = useParams();

  const reportType =
    (type as "daily" | "weekly" | "monthly") || "weekly";

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [forecast, setForecast] =
    useState<ForecastPoint[]>([]);

  const [reportData, setReportData] =
    useState<any>(null);

  const [summary, setSummary] =
    useState("");

  const forecastPoint =
    forecast[forecast.length - 1];

  const confidence =
    Math.round(
      (forecastPoint?.confidence ?? 0) * 100
    );

  const forecastValue =
    Math.round(
      forecastPoint?.value ?? 0
    );

const latest = dashboard?.latest;

const health =
  latest && latest.profit > 0
    ? "Stable"
    : "Critical";

const priority =
  (latest?.average_order_value ?? 0) > 500
    ? "Expansion"
    : "Growth";

  const pieData = useMemo(() => {
    if (!dashboard) return [];

    switch (reportType) {
      case "daily":
        return dashboard.top_products.slice(0, 3);

      case "weekly":
        return dashboard.top_products.slice(0, 5);

      default:
        return dashboard.top_products;
    }
  }, [dashboard, reportType]);

  useEffect(() => {
  async function load() {

    const report = await api.getReport(
      reportType
    );

    const dash = await api.getDashboard();

    const ai = await api.askCopilot(`
You are the Chief Business Intelligence Officer of a retail company.

Business Metrics

Revenue: ₹${Math.round(dash.latest.revenue)}

Profit: ₹${Math.round(dash.latest.profit)}

Orders: ${dash.latest.orders}

Average Order Value: ₹${Math.round(dash.latest.average_order_value)}

Top Products:

${dash.top_products
  .map(
    (p) =>
      `${p.product || p.dish}: ₹${Math.round(
        p.revenue
      )} (${p.units_sold} units)`
  )
  .join("\n")}

Generate a professional ${reportType} Executive Business Report.

The report should include:

# Executive Summary
(4-5 lines)

# Revenue Performance
Analyze revenue trends and business growth.

# Profitability Analysis
Explain operational efficiency and profitability.

# Customer & Order Behaviour
Discuss customer purchasing trends.

# Product Performance
Analyze top-performing products and identify weak performers.

# Revenue Forecast
Interpret the forecast and expected business outlook.

# Risks
Mention operational or financial concerns.

# Strategic Recommendations
Provide 5 actionable recommendations.

Write approximately 20-25 concise lines.

Use markdown headings.

Base every insight ONLY on the provided business metrics.

Do not invent unrealistic numbers.

Write like a McKinsey or Deloitte business consultant.
`);

    setDashboard(dash);
    setReportData(report);
    setForecast(report.forecast);
    setSummary(ai.answer);

  }

  load();
}, [type]);

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-xl text-white">
        Generating AI Executive Report...
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">

      <div>

        <span className="eyebrow">
          AI Generated Report
        </span>

        <h1 className="font-display text-4xl font-bold mt-2">
          {type?.toUpperCase()} REPORT
        </h1>

        <p className="text-mist-500 mt-2">
          Generated using live business intelligence and AI analysis.
        </p>

      </div>
            {/* Charts */}

{reportType === "daily" ? (
  <div className="grid lg:grid-cols-3 gap-6">

    <div className="panel rounded-3xl border border-[#202A4B] bg-[#0F172A] p-6 shadow-lg">

      <div className="h-1 w-12 rounded-full bg-emerald-400 mb-5" />

      <p className="text-xs uppercase tracking-[0.2em] text-mist-500">
        Today's Revenue
      </p>

      <h2 className="text-4xl font-bold mt-4">
        ₹{Math.round(dashboard.latest.revenue).toLocaleString()}
      </h2>

      <p className="text-sm text-emerald-400 mt-3">
        Latest recorded revenue
      </p>

    </div>

    <div className="panel rounded-3xl border border-[#202A4B] bg-[#0F172A] p-6 shadow-lg">

      <div className="h-1 w-12 rounded-full bg-cyan-400 mb-5" />

      <p className="text-xs uppercase tracking-[0.2em] text-mist-500">
        Tomorrow Forecast
      </p>

      <h2 className="text-4xl font-bold mt-4">
        ₹{forecastValue.toLocaleString()}
      </h2>

      <p className="text-sm text-cyan-400 mt-3">
        AI predicted revenue
      </p>

    </div>

    <div className="panel rounded-3xl border border-[#202A4B] bg-[#0F172A] p-6 shadow-lg">

      <div className="h-1 w-12 rounded-full bg-amber-400 mb-5" />

      <p className="text-xs uppercase tracking-[0.2em] text-mist-500">
        Forecast Confidence
      </p>

      <h2 className="text-4xl font-bold mt-4">
        {confidence}%
      </h2>

      <div className="mt-5 h-2 rounded-full bg-[#1A2242] overflow-hidden">

        <div
          className="h-full rounded-full bg-amber-400"
          style={{
            width: `${confidence}%`,
          }}
        />

      </div>

      <p className="text-sm text-mist-500 mt-3">
        AI confidence score
      </p>

    </div>

  </div>
) : (
  <div className="grid xl:grid-cols-2 gap-6">

    {/* Revenue Trend */}

    <div className="panel rounded-3xl border border-[#202A4B] p-6">

      <div className="mb-6">

        <h2 className="font-display text-xl">
          {reportType === "weekly"
            ? "Revenue Trend"
            : "Monthly Revenue Trend"}
        </h2>

        <p className="text-mist-500 text-sm">
          {reportType === "weekly"
            ? "Last 7 Days"
            : "Last 30 Days"}
        </p>

      </div>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={reportData?.chart || []}>

            <CartesianGrid
              stroke="#1A2242"
              vertical={false}
            />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#E08D2C"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

    {/* Forecast */}

    <div className="panel rounded-3xl border border-[#202A4B] p-6">

      <div className="mb-6">

        <h2 className="font-display text-xl">
          {reportType === "weekly"
            ? "Revenue Forecast"
            : "30-Day Forecast"}
        </h2>

        <p className="text-mist-500 text-sm">
          AI Revenue Projection
        </p>

      </div>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={forecast}>

            <CartesianGrid
              stroke="#1A2242"
              vertical={false}
            />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#3FB8AF"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>
)}

      {/* Revenue Contribution */}

{/* Revenue Breakdown */}

<div className="panel rounded-3xl border border-[#202A4B] bg-[#0F172A] p-8 shadow-lg">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

    <div>

      <p className="text-xs uppercase tracking-[0.2em] text-mist-500">
        Revenue Analytics
      </p>

      <h2 className="font-display text-2xl mt-2">
        Revenue Breakdown by Product
      </h2>

      <p className="text-sm text-mist-500 mt-2">
        Revenue contribution across your highest-performing products.
      </p>

    </div>

  </div>

  <div className="h-[440px]">

    <ResponsiveContainer width="100%" height="100%">

      <PieChart>

        <Pie
          data={pieData}
          dataKey="revenue"
          nameKey="product"
          cx="50%"
          cy="50%"
          innerRadius={95}
          outerRadius={150}
          paddingAngle={4}
          label={({ name, percent }) =>
            `${String(name).length > 12
                ? String(name).slice(0, 12) + "…"
                : name
            } ${(percent! * 100).toFixed(0)}%`
          }
          labelLine={false}
        >

          {pieData.map((_, index) => (

            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />

          ))}

        </Pie>

        <Tooltip
          formatter={(value: number) => [
            `₹${Math.round(value).toLocaleString()}`,
            "Revenue",
          ]}
        />

        <Legend
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{
            paddingTop: 20,
          }}
        />

      </PieChart>

    </ResponsiveContainer>

  </div>

</div>
            {/* Executive Business Report */}

{/* Executive Business Analysis */}

<div className="panel rounded-3xl border border-[#202A4B] bg-[#0F172A] p-8 shadow-lg">

  <div className="mb-8">

    <p className="text-xs uppercase tracking-[0.2em] text-mist-500">
      AI Strategic Insights
    </p>

    <h2 className="font-display text-3xl mt-2">
      Executive Business Analysis
    </h2>

    <p className="text-mist-500 mt-3 max-w-3xl">
      AI-generated assessment of operational performance, revenue trends,
      forecast reliability and immediate business priorities.
    </p>

  </div>

  <div className="grid lg:grid-cols-3 gap-6 mb-10">

    <div className="rounded-2xl border border-[#202A4B] bg-[#111827] p-6">

      <div className="h-1 w-10 rounded-full bg-emerald-400 mb-5" />

      <p className="text-xs uppercase tracking-widest text-mist-500">
        Business Health
      </p>

      <h3 className="text-3xl font-bold text-emerald-400 mt-4">
          {health}
      </h3>

      <p className="mt-5 leading-7 text-sm text-mist-400">
        Revenue and profitability remain healthy with consistent customer
        activity and balanced operational performance.
      </p>

    </div>

    <div className="rounded-2xl border border-[#202A4B] bg-[#111827] p-6">

      <div className="h-1 w-10 rounded-full bg-cyan-400 mb-5" />

      <p className="text-xs uppercase tracking-widest text-mist-500">
        Forecast Confidence
      </p>

      <h3 className="text-3xl font-bold text-cyan-400 mt-4">
        {confidence >= 80
          ? "High"
          : confidence >= 60
          ? "Moderate"
          : "Low"}
      </h3>

      <p className="mt-5 leading-7 text-sm text-mist-400">
        Forecast models indicate approximately {confidence}% confidence
        based on historical revenue behaviour.
      </p>

    </div>

    <div className="rounded-2xl border border-[#202A4B] bg-[#111827] p-6">

      <div className="h-1 w-10 rounded-full bg-amber-400 mb-5" />

      <p className="text-xs uppercase tracking-widest text-mist-500">
        Immediate Priority
      </p>

      <h3 className="text-3xl font-bold text-amber-400 mt-4">
        {priority}
      </h3>

      <p className="mt-5 leading-7 text-sm text-mist-400">
        Increase average order value, strengthen top-selling products,
        and improve sales consistency across categories.
      </p>

    </div>

  </div>

  <div className="rounded-3xl border border-[#202A4B] bg-[#0B1220] p-8">

    <div className="flex items-center justify-between mb-6">

      <div>

        <p className="text-xs uppercase tracking-[0.2em] text-mist-500">
          Artificial Intelligence
        </p>

        <h3 className="font-display text-2xl mt-2">
          AI Executive Report
        </h3>

      </div>

    </div>

    <div
      className="
        whitespace-pre-wrap
        text-[15px]
        leading-8
        text-mist-200
      "
    >
      {summary}
    </div>

  </div>

</div>

    </div>
  );
}