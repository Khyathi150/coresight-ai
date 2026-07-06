import { useEffect, useMemo, useState } from "react";
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

import { api, DashboardData } from "../lib/api";
import PulseHeader from "../components/PulseHeader";
import KpiCard from "../components/KpiCard";
import AlertItem from "../components/AlertItem";

export default function Dashboard() {
  const [days, setDays] = useState(30);

  const [data, setData] = useState<DashboardData | null>(null);

  const [alerts, setAlerts] = useState<
    {
      severity: string;
      message: string;
      created_at: string;
    }[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getDashboard(),
      api.getAlerts(),
    ])
      .then(([dashboard, alertData]) => {
        setData(dashboard);
        setAlerts(alertData.alerts);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

    const chartData = data ? data.revenue_series.slice(-days) : [];

  if (loading) {
    return (
      <div className="text-mist-500 font-mono text-sm">
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="panel p-8 rounded-2xl">
        <h2 className="text-red-400 font-semibold">
          Couldn't reach the CoreSight API
        </h2>

        <p className="text-mist-500 mt-2">
          Make sure your backend is running.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div>

          <p className="eyebrow">
            {data.industry.toUpperCase()} ANALYTICS
          </p>

          <h1 className="font-display text-4xl font-bold mt-2">
            Business Performance Dashboard
          </h1>

          <p className="text-mist-500 mt-2">
            Real-time operational analytics
          </p>

        </div>

        <div className="flex gap-3">

          {[7,30,90,365].map((d)=>(
            <button
              key={d}
              onClick={()=>setDays(d)}
              className={`px-5 py-2 rounded-xl transition font-medium ${
                days===d
                  ? "bg-amber-500 text-black"
                  : "bg-[#171F3B] text-gray-300 hover:bg-[#20294A]"
              }`}
            >
              {d===365 ? "1Y" : `${d}D`}
            </button>
          ))}

        </div>

      </div>

      <PulseHeader
        alertCount={data.alerts_count}
        label={
          data.latest.date
            ? `Updated ${data.latest.date}`
            : "No Data"
        }
      />

      {/* KPI Cards */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">

        <KpiCard
          label="Revenue"
          value={`₹${Math.round(data.latest.revenue).toLocaleString()}`}
          delta="Today"
          deltaTone="up"
        />

        <KpiCard
          label="Profit"
          value={`₹${Math.round(data.latest.profit).toLocaleString()}`}
          delta="Today"
          deltaTone="up"
        />

        <KpiCard
          label="Orders"
          value={`${data.latest.orders}`}
          delta="Today"
          deltaTone="neutral"
        />

        <KpiCard
          label="Average Order Value"
          value={`₹${Math.round(data.latest.average_order_value)}`}
          delta="Current"
          deltaTone="neutral"
        />

      </div>

            {/* Charts */}

      <div className="grid xl:grid-cols-2 gap-6">

        {/* Revenue */}

        <div className="panel rounded-2xl p-6">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl">Revenue Trend</h2>
              <p className="text-mist-500 text-sm">
                Last {days} days
              </p>
            </div>
          </div>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={chartData}>

                <CartesianGrid stroke="#1A2242" vertical={false}/>

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip/>

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

        {/* Profit */}

        <div className="panel rounded-2xl p-6">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl">Profit Trend</h2>
              <p className="text-mist-500 text-sm">
                Last {days} days
              </p>
            </div>
          </div>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={chartData}>

                <CartesianGrid stroke="#1A2242" vertical={false}/>

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip/>

                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#3FB8AF"
                  strokeWidth={3}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Orders */}

        <div className="panel rounded-2xl p-6">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl">Orders Trend</h2>
              <p className="text-mist-500 text-sm">
                Last {days} days
              </p>
            </div>
          </div>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={chartData}>

                <CartesianGrid stroke="#1A2242" vertical={false}/>

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip/>

                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#60A5FA"
                  strokeWidth={3}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Average Order */}

        <div className="panel rounded-2xl p-6">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl">
                Average Order Value
              </h2>

              <p className="text-mist-500 text-sm">
                Last {days} days
              </p>

            </div>
          </div>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={chartData}>

                <CartesianGrid stroke="#1A2242" vertical={false}/>

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip/>

                <Line
                  type="monotone"
                  dataKey="average_order_value"
                  stroke="#A855F7"
                  strokeWidth={3}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>
      {/* Bottom Section */}

      <div className="grid xl:grid-cols-2 gap-6">

        {/* Top Products */}

        <div className="panel rounded-2xl p-6">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="font-display text-xl">
                Top Products
              </h2>

              <p className="text-mist-500 text-sm">
                Highest revenue generators
              </p>

            </div>

          </div>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={data.top_products}>

                <CartesianGrid stroke="#1A2242" />

                <XAxis
                  dataKey="product"
                  tick={{ fontSize: 11 }}
                />

                <YAxis/>

                <Tooltip/>

                <Bar
                  dataKey="revenue"
                  radius={[6,6,0,0]}
                  fill="#10B981"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Worst Products */}

        <div className="panel rounded-2xl p-6">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="font-display text-xl">
                Needs Attention
              </h2>

              <p className="text-mist-500 text-sm">
                Lowest performing products
              </p>

            </div>

          </div>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={data.worst_products}>

                <CartesianGrid stroke="#1A2242" />

                <XAxis
                  dataKey="product"
                  tick={{ fontSize: 11 }}
                />

                <YAxis/>

                <Tooltip/>

                <Bar
                  dataKey="revenue"
                  radius={[6,6,0,0]}
                  fill="#EF4444"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* Alerts */}

      <div className="panel rounded-2xl p-6">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="font-display text-xl">
              Active Alerts
            </h2>

            <p className="text-mist-500 text-sm">
              Latest business signals
            </p>

          </div>

          <div className="text-3xl font-bold text-orange-400">
            {alerts.length}
          </div>

        </div>

        <div className="grid gap-3">

          {alerts.length === 0 ? (

            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5">

              <p className="text-emerald-400 font-medium">
                No active alerts 🎉
              </p>

            </div>

          ) : (

            alerts.slice(0,4).map((a,i)=>(
              <AlertItem
                key={i}
                severity={a.severity}
                message={a.message}
                createdAt={a.created_at}
              />
            ))

          )}

        </div>

      </div>

    </div>

  );

}