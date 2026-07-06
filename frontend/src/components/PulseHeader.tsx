/**
 * Signature element: "The Pulse" — a live waveform that represents overall
 * business health at a glance. Color shifts from teal (calm) toward amber/red
 * as alert volume rises, so before reading a single number, the manager
 * already feels whether today is a calm day or a busy one.
 */
import { useMemo } from "react";

interface PulseHeaderProps {
  alertCount: number;
  label: string;
}

export default function PulseHeader({ alertCount, label }: PulseHeaderProps) {
  const bars = useMemo(() => {
    const seed = alertCount > 0 ? alertCount : 1;
    return Array.from({ length: 48 }, (_, i) => {
      const base = Math.sin(i / 3) * 10 + Math.sin(i / 1.3 + seed) * 6;
      return 18 + Math.abs(base) + (i % 7 === 0 ? seed * 1.5 : 0);
    });
  }, [alertCount]);

  const tone =
    alertCount === 0 ? "signal-teal" : alertCount < 4 ? "signal-amber" : "signal-red";

  const colorVar =
    tone === "signal-teal" ? "#3FB8AF" : tone === "signal-amber" ? "#E08D2C" : "#C1483C";

  return (
    <div className="panel hud-corner flex items-center gap-6 px-6 py-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-fade opacity-60 pointer-events-none" />
      <div className="relative z-10 flex flex-col shrink-0">
        <span className="eyebrow">Business Pulse</span>
        <span className="font-display text-lg text-mist-100">{label}</span>
      </div>
      <div className="relative z-10 flex items-end gap-[3px] h-12 flex-1 overflow-hidden">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full animate-pulseLine"
            style={{
              height: `${h}px`,
              backgroundColor: colorVar,
              opacity: 0.35 + (i / bars.length) * 0.55,
              animationDelay: `${i * 0.03}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 text-right shrink-0">
        <span className="eyebrow block">Signals</span>
        <span className="font-mono text-2xl" style={{ color: colorVar }}>
          {alertCount}
        </span>
      </div>
    </div>
  );
}
