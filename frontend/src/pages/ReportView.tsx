import { useEffect, useState } from "react";
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

export default function ReportView() {
  const { type } = useParams();

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [forecast, setForecast] =
    useState<ForecastPoint[]>([]);

  const [summary, setSummary] =
    useState("");

  useEffect(() => {
  async function load() {

    const dash = await api.getDashboard();

    const fore = await api.getForecast();

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

Generate a professional ${type} Executive Business Report.

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
    setForecast(fore.series);
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="panel rounded-2xl p-6">
          <p className="eyebrow">Revenue</p>
          <h2 className="text-3xl font-bold mt-2">
            ₹{Math.round(dashboard.latest.revenue).toLocaleString()}
          </h2>
        </div>

        <div className="panel rounded-2xl p-6">
          <p className="eyebrow">Profit</p>
          <h2 className="text-3xl font-bold mt-2">
            ₹{Math.round(dashboard.latest.profit).toLocaleString()}
          </h2>
        </div>

        <div className="panel rounded-2xl p-6">
          <p className="eyebrow">Orders</p>
          <h2 className="text-3xl font-bold mt-2">
            {dashboard.latest.orders}
          </h2>
        </div>

        <div className="panel rounded-2xl p-6">
          <p className="eyebrow">Average Order</p>
          <h2 className="text-3xl font-bold mt-2">
            ₹{Math.round(dashboard.latest.average_order_value)}
          </h2>
        </div>

      </div>
            {/* Charts */}

      <div className="grid xl:grid-cols-2 gap-6">

        {/* Revenue Trend */}

        <div className="panel rounded-2xl p-6">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="font-display text-xl">
                Revenue Trend
              </h2>

              <p className="text-mist-500 text-sm">
                Revenue over the last 30 business days
              </p>

            </div>

          </div>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart
                data={dashboard.revenue_series.slice(-30)}
              >

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

        <div className="panel rounded-2xl p-6">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="font-display text-xl">
                Revenue Forecast
              </h2>

              <p className="text-mist-500 text-sm">
                AI prediction for the next 30 days
              </p>

            </div>

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

      {/* Revenue Contribution */}

      <div className="panel rounded-2xl p-6">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="font-display text-xl">
              Revenue Contribution
            </h2>

            <p className="text-mist-500 text-sm">
              Percentage contribution of top-performing products
            </p>

          </div>

        </div>

        <div className="h-[420px]">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={dashboard.top_products}
                dataKey="revenue"
                nameKey="product"
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={145}
                paddingAngle={3}
                label={({ name, percent }) =>
                  `${name} ${(percent! * 100).toFixed(0)}%`
                }
                labelLine={false}
              >

                {dashboard.top_products.map((_, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

              <Legend
                verticalAlign="bottom"
                height={40}
              />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>
            {/* Executive Business Report */}

      <div className="panel rounded-2xl p-8">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="font-display text-2xl">
              Executive Business Analysis
            </h2>

            <p className="text-mist-500 mt-2">
              AI-generated strategic assessment based on live operational data,
              forecasting models and KPI analysis.
            </p>

          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          <div className="rounded-xl bg-[#10182E] p-5">

            <p className="text-sm text-mist-500">
              Business Health
            </p>

            <h3 className="text-3xl font-bold mt-2 text-green-400">
              Stable
            </h3>

            <p className="mt-3 text-sm text-mist-400 leading-7">
              Revenue and operational KPIs indicate consistent business
              performance with opportunities for additional growth.
            </p>

          </div>

          <div className="rounded-xl bg-[#10182E] p-5">

            <p className="text-sm text-mist-500">
              Forecast Confidence
            </p>

            <h3 className="text-3xl font-bold mt-2 text-cyan-400">
              High
            </h3>

            <p className="mt-3 text-sm text-mist-400 leading-7">
              Forecast models indicate stable trends with predictable
              revenue behaviour over the coming weeks.
            </p>

          </div>

          <div className="rounded-xl bg-[#10182E] p-5">

            <p className="text-sm text-mist-500">
              Decision Priority
            </p>

            <h3 className="text-3xl font-bold mt-2 text-amber-400">
              Medium
            </h3>

            <p className="mt-3 text-sm text-mist-400 leading-7">
              Focus on improving product mix, increasing average order value,
              and reducing operational inefficiencies.
            </p>

          </div>

        </div>

        <div className="border border-[#222B4C] rounded-2xl p-8 bg-[#0D1324]">

          <h3 className="font-display text-xl mb-5">
            AI Executive Report
          </h3>

          <div
            className="text-[15px]
                       leading-9
                       whitespace-pre-wrap
                       text-mist-200"
          >
            {summary}
          </div>

        </div>

      </div>

    </div>
  );
}