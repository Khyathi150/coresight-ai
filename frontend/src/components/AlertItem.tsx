interface AlertItemProps {
  severity: string;
  message: string;
  createdAt: string;
}

const severityStyles: Record<string, string> = {
  high: "border-signal-red/40 bg-signal-red/10 text-signal-red",
  medium: "border-signal-amber/40 bg-signal-amber/10 text-signal-amber",
  low: "border-signal-teal/40 bg-signal-teal/10 text-signal-teal",
};

export default function AlertItem({ severity, message, createdAt }: AlertItemProps) {
  const style = severityStyles[severity] || severityStyles.low;
  return (
    <div className={`flex items-start justify-between gap-3 px-4 py-3 rounded-lg border ${style}`}>
      <div className="flex items-start gap-2.5">
        <span className="w-1.5 h-1.5 rounded-full mt-1.5 bg-current shrink-0" />
        <span className="text-sm text-mist-100">{message}</span>
      </div>
      <span className="font-mono text-[11px] text-mist-500 shrink-0">{createdAt}</span>
    </div>
  );
}
