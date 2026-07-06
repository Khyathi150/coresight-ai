import { useEffect, useState } from "react";
import { api, DashboardData } from "../lib/api";

export default function Inventory() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.getDashboard().then(setData).catch(() => setData(null));
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div>
        <span className="eyebrow">Inventory intelligence</span>
        <h1 className="font-display text-2xl font-semibold mt-1">Stock, freshness, and what to reorder.</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="panel p-5">
          <span className="eyebrow">Fast movers (reorder candidates)</span>
          <div className="mt-3 flex flex-col gap-2">
            {data?.top_products.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                <span>{p.product || p.dish}</span>
                <span className="font-mono text-signal-teal">{p.units_sold} sold</span>
              </div>
            )) ?? <p className="text-mist-500 text-sm">Upload sales data to see this.</p>}
          </div>
        </div>
        <div className="panel p-5">
          <span className="eyebrow">Slow movers (review pricing/placement)</span>
          <div className="mt-3 flex flex-col gap-2">
            {data?.worst_products.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                <span>{p.product || p.dish}</span>
                <span className="font-mono text-signal-amber">{p.units_sold} sold</span>
              </div>
            )) ?? <p className="text-mist-500 text-sm">Upload sales data to see this.</p>}
          </div>
        </div>
      </div>

      <div className="panel p-5">
        <p className="text-mist-500 text-sm leading-relaxed">
          Full stock levels, expiry tracking, and reorder recommendations come from the <span className="font-mono text-signal-amber">/dashboard</span> and
          <span className="font-mono text-signal-amber"> /alerts</span> endpoints — ask the Copilot "which products should I reorder?" for a narrated version of this same data.
        </p>
      </div>
    </div>
  );
}
