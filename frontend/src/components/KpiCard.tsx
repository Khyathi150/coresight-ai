interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  unit?: string;
}

export default function KpiCard({ label, value, delta, deltaTone = "neutral", unit }: KpiCardProps) {
  const deltaColor =
    deltaTone === "up" ? "text-signal-teal" : deltaTone === "down" ? "text-signal-red" : "text-mist-500";

  return (
    <div className="panel hud-corner px-5 py-4 flex flex-col gap-2 animate-rise">
      <span className="eyebrow">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-[26px] leading-none text-mist-100">{value}</span>
        {unit && <span className="text-sm text-mist-500">{unit}</span>}
      </div>
      {delta && <span className={`text-xs font-mono ${deltaColor}`}>{delta}</span>}
    </div>
  );
}
