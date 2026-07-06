import { useEffect, useState } from "react";
import { api, AlertItemData } from "../lib/api";
import AlertItem from "../components/AlertItem";

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAlerts().then((r) => setAlerts(r.alerts)).finally(() => setLoading(false));
  }, []);

  const bySeverity = (sev: string) => alerts.filter((a) => a.severity === sev);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <span className="eyebrow">Alerts</span>
        <h1 className="font-display text-2xl font-semibold mt-1">Everything that needs your attention.</h1>
      </div>

      {loading && <p className="text-mist-500 font-mono text-sm">Scanning for anomalies…</p>}

      {!loading && alerts.length === 0 && (
        <div className="panel p-6 text-center text-mist-500 text-sm">No active alerts. Business is calm.</div>
      )}

      {["high", "medium", "low"].map((sev) => {
        const items = bySeverity(sev);
        if (items.length === 0) return null;
        return (
          <div key={sev} className="flex flex-col gap-2">
            <span className="eyebrow capitalize">{sev} priority</span>
            {items.map((a, i) => (
              <AlertItem key={i} severity={a.severity} message={a.message} createdAt={a.created_at} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
