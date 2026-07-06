import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api, DashboardData, ForecastPoint } from "../lib/api";

export default function ReportView() {
  const { type } = useParams();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    async function load() {
      const dash = await api.getDashboard();
      const fore = await api.getForecast();

      const ai = await api.askCopilot(
        `Generate a professional ${type} business report with executive summary and recommendations.`
      );

      setDashboard(dash);
      setForecast(fore.series);
      setSummary(ai.answer);
    }

    load();
  }, [type]);

  if (!dashboard) {
    return (
      <div className="text-white">
        Generating AI report...
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

          Generated using live business data and AI.

        </p>

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="panel p-6 rounded-2xl">

          <p className="eyebrow">Revenue</p>

          <h2 className="text-3xl font-bold mt-2">

            ₹{Math.round(dashboard.latest.revenue).toLocaleString()}

          </h2>

        </div>

        <div className="panel p-6 rounded-2xl">

          <p className="eyebrow">Profit</p>

          <h2 className="text-3xl font-bold mt-2">

            ₹{Math.round(dashboard.latest.profit).toLocaleString()}

          </h2>

        </div>

        <div className="panel p-6 rounded-2xl">

          <p className="eyebrow">Orders</p>

          <h2 className="text-3xl font-bold mt-2">

            {dashboard.latest.orders}

          </h2>

        </div>

        <div className="panel p-6 rounded-2xl">

          <p className="eyebrow">Average Order</p>

          <h2 className="text-3xl font-bold mt-2">

            ₹{Math.round(dashboard.latest.average_order_value)}

          </h2>

        </div>

      </div>
            {/* Revenue Trend */}

      <div className="grid xl:grid-cols-2 gap-6">

        <div className="panel rounded-2xl p-6">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="font-display text-xl">
                Revenue Trend
              </h2>

              <p className="text-mist-500 text-sm">
                Historical Revenue
              </p>

            </div>

          </div>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={dashboard.revenue_series.slice(-30)}>

                <CartesianGrid stroke="#1A2242" vertical={false} />

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
                Next 30 Days Prediction
              </p>

            </div>

          </div>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={forecast}>

                <CartesianGrid stroke="#1A2242" vertical={false} />

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

      {/* Top Products */}

      <div className="panel rounded-2xl p-6">

        <h2 className="font-display text-xl mb-6">
          Top Products
        </h2>

        <div className="h-80">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={dashboard.top_products}>

              <CartesianGrid stroke="#1A2242" />

              <XAxis dataKey="product" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="revenue"
                fill="#10B981"
                radius={[6,6,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* AI Summary */}

      <div className="panel rounded-2xl p-6">

        <h2 className="font-display text-xl mb-5">

          Executive Summary

        </h2>

        <div className="text-mist-200 leading-8 whitespace-pre-wrap">

          {summary}

        </div>

      </div>
          </div>
  );
}