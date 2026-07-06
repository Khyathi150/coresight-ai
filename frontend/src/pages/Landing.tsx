import { Link } from "react-router-dom";
import { useMemo } from "react";
import { ArrowRight, Github } from "lucide-react";

function HeroPulse() {
  const bars = useMemo(
    () => Array.from({ length: 72 }, (_, i) => 24 + Math.abs(Math.sin(i / 4) * 30 + Math.sin(i / 1.7) * 12)),
    []
  );
  return (
    <div className="flex items-end gap-[3px] h-24 w-full">
      {bars.map((h, i) => (
        <span
          key={i}
          className="flex-1 rounded-full animate-pulseLine"
          style={{
            height: `${h}px`,
            background: i % 5 === 0 ? "#E08D2C" : "#3FB8AF",
            opacity: 0.3 + (i / bars.length) * 0.6,
            animationDelay: `${i * 0.025}s`,
          }}
        />
      ))}
    </div>
  );
}

const pipeline = [
  { step: "01", title: "Data arrives", body: "Sales, inventory, and customer CSVs land straight into your own Supabase project. No format is sacred — the ingestion layer cleans and validates against your industry's schema." },
  { step: "02", title: "CoreSight computes", body: "Deterministic engines — not the LLM — calculate revenue, profit, demand forecasts, and anomalies. Every number is traceable back to a row of your data." },
  { step: "03", title: "CoreSight explains", body: "Only the computed facts are handed to the AI copilot, which narrates root causes and recommends next actions in plain language — never inventing a figure." },
];

const industries = ["Retail", "Restaurants", "Healthcare", "Manufacturing", "Education", "Finance"];

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink-950 bg-grid-fade text-mist-100">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-signal-amber flex items-center justify-center font-display font-bold text-ink-950 text-sm">C</div>
          <span className="font-display font-semibold tracking-tight">CoreSight AI</span>
        </div>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-mist-500 hover:text-mist-100 transition-colors">
          <Github size={16} /> View source
        </a>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <span className="eyebrow">AI Business Operating System · Config-driven across industries</span>
        <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.05] mt-4 max-w-3xl">
          Your business, <span className="text-signal-amber">read in real time.</span>
        </h1>
        <p className="text-mist-300 text-lg mt-5 max-w-xl leading-relaxed">
          Upload what you already track. CoreSight computes the KPIs, forecasts what's next,
          catches what's going wrong, and tells you — in plain language — what to do about it.
        </p>
        <div className="flex items-center gap-4 mt-8">
          <Link to="/dashboard" className="btn-primary flex items-center gap-2">
            See a live business <ArrowRight size={16} />
          </Link>
          <Link to="/onboarding" className="btn-ghost">Upload your data</Link>
        </div>

        <div className="mt-16 panel hud-corner p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="eyebrow">Live signal — demo retail business</span>
            <span className="font-mono text-xs text-signal-teal">● monitoring</span>
          </div>
          <HeroPulse />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <span className="eyebrow">How it thinks</span>
        <h2 className="font-display text-3xl font-semibold mt-3 mb-10 max-w-lg">
          Three honest steps — nothing hidden behind the "AI."
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {pipeline.map((p) => (
            <div key={p.step} className="panel p-6">
              <span className="font-mono text-signal-amber text-sm">{p.step}</span>
              <h3 className="font-display text-lg font-semibold mt-3 mb-2">{p.title}</h3>
              <p className="text-mist-500 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <span className="eyebrow">One core, many businesses</span>
        <h2 className="font-display text-3xl font-semibold mt-3 mb-8 max-w-lg">
          Retail is live. Every other vertical is a config file away.
        </h2>
        <div className="flex flex-wrap gap-3">
          {industries.map((ind, i) => (
            <span
              key={ind}
              className={`px-4 py-2 rounded-full border text-sm font-mono
                ${i === 0 ? "border-signal-amber/50 bg-signal-amber/10 text-signal-amber" : "border-white/10 text-mist-500"}`}
            >
              {ind} {i === 0 && "· live"}
            </span>
          ))}
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5 flex items-center justify-between text-sm text-mist-500">
        <span>CoreSight AI — built for the hackathon, free-tier end to end.</span>
        <Link to="/dashboard" className="text-signal-amber hover:underline">Open the dashboard →</Link>
      </footer>
    </div>
  );
}
