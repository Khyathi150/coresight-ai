import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, CheckCircle2, ArrowRight } from "lucide-react";
import { api } from "../lib/api";

export default function Onboarding() {
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [inventoryFile, setInventoryFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [log, setLog] = useState<string[]>([]);
  const navigate = useNavigate();

  async function runImport() {
    setStatus("uploading");
    setLog([]);
    try {
      if (salesFile) {
        setLog((l) => [...l, "Reading sales.csv…"]);
        const res = await api.uploadDataset(salesFile, "sales");
        setLog((l) => [...l, `Inserted ${res.rows_inserted} sales rows (${res.rows_rejected} rejected)`]);
      }
      if (inventoryFile) {
        setLog((l) => [...l, "Reading inventory.csv…"]);
        const res = await api.uploadDataset(inventoryFile, "inventory");
        setLog((l) => [...l, `Inserted ${res.rows_inserted} inventory rows (${res.rows_rejected} rejected)`]);
      }
      setLog((l) => [...l, "Building KPIs, forecasts, and alerts…"]);
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setLog((l) => [...l, "Something went wrong reaching the backend."]);
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 bg-grid-fade flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <span className="eyebrow">Import your business</span>
        <h1 className="font-display text-3xl font-semibold mt-2 mb-8">
          Bring your data. CoreSight does the rest.
        </h1>

        <div className="panel p-6 flex flex-col gap-4">
          <UploadRow label="sales.csv" file={salesFile} onSelect={setSalesFile} />
          <UploadRow label="inventory.csv" file={inventoryFile} onSelect={setInventoryFile} />

          <button
            onClick={runImport}
            disabled={(!salesFile && !inventoryFile) || status === "uploading"}
            className="btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-40"
          >
            {status === "uploading" ? "Importing…" : "Import"} <ArrowRight size={16} />
          </button>

          {log.length > 0 && (
            <div className="mt-2 font-mono text-xs text-mist-500 flex flex-col gap-1">
              {log.map((line, i) => <div key={i}>› {line}</div>)}
            </div>
          )}

          {status === "done" && (
            <button onClick={() => navigate("/dashboard")} className="btn-ghost flex items-center justify-center gap-2 text-signal-teal">
              <CheckCircle2 size={16} /> Go to dashboard
            </button>
          )}
        </div>

        <p className="text-mist-700 text-xs mt-4">
          No sample data handy? Use the files in <code className="font-mono">backend/data/sample_datasets/</code> to try it instantly.
        </p>
      </div>
    </div>
  );
}

function UploadRow({ label, file, onSelect }: { label: string; file: File | null; onSelect: (f: File) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 border border-white/10 rounded-lg px-4 py-3 cursor-pointer hover:border-signal-amber/40 transition-colors">
      <div className="flex items-center gap-3">
        <UploadCloud size={18} className="text-mist-500" />
        <div>
          <div className="text-sm text-mist-100">{label}</div>
          <div className="text-xs text-mist-700">{file ? file.name : "Click to select a CSV"}</div>
        </div>
      </div>
      {file && <CheckCircle2 size={16} className="text-signal-teal" />}
      <input
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
      />
    </label>
  );
}
