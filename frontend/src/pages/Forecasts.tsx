import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { api, ForecastPoint } from "../lib/api";

export default function Forecasts() {
  const [series, setSeries] = useState<ForecastPoint[]>([]);
  const [horizon, setHorizon] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getForecast(undefined, "revenue", horizon)
      .then((res) => setSeries(res.series))
      .finally(() => setLoading(false));
  }, [horizon]);

  const splitDate = series.find((p) => p.is_forecast)?.date;

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow">Forecasting engine</span>
          <h1 className="font-display text-2xl font-semibold mt-1">What's coming next.</h1>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30].map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 rounded-lg text-sm font-mono border transition-colors
                ${horizon === h ? "border-signal-amber text-signal-amber bg-signal-amber/10" : "border-white/10 text-mist-500 hover:text-mist-100"}`}
            >
              {h}d
            </button>
          ))}
        </div>
      </div>

      <div className="panel p-5">
        <span className="eyebrow">Revenue — historical vs predicted</span>
        <div className="h-80 mt-3">
          {loading ? (
            <div className="h-full flex items-center justify-center text-mist-500 font-mono text-sm">Running the forecast…</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E08D2C" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#E08D2C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1A2242" vertical={false} />
                <XAxis dataKey="date" stroke="#5A6079" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#5A6079" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#111832", border: "1px solid #242E52", borderRadius: 8, fontSize: 12 }} />
                {splitDate && <ReferenceLine x={splitDate} stroke="#3FB8AF" strokeDasharray="4 4" label={{ value: "today", fill: "#3FB8AF", fontSize: 11 }} />}
                <Area type="monotone" dataKey="value" stroke="#E08D2C" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="panel p-5">
        <p className="text-mist-500 text-sm leading-relaxed">
          The dashed line marks where historical data ends and the forecast begins. Confidence decays the further out
          the prediction reaches — ask the <span className="text-signal-amber">Copilot</span> for the exact confidence
          band on any given day.
        </p>
      </div>
    </div>
  );
}
