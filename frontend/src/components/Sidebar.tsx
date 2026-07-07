import { NavLink } from "react-router-dom";
import { LayoutDashboard, LineChart, Package, MessageSquareText, FileText, Bell, Settings } from "lucide-react";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/forecasts", icon: LineChart, label: "Forecasts" },
  { to: "/inventory", icon: Package, label: "Inventory" },
  { to: "/copilot", icon: MessageSquareText, label: "Copilot" },
  { to: "/reports", icon: FileText, label: "Reports" },
  ];

export default function Sidebar() {
  return (
    <aside className="w-[76px] shrink-0 h-screen bg-ink-900 border-r border-white/5 flex flex-col items-center py-5 gap-8">
      <div className="w-9 h-9 rounded-lg bg-signal-amber flex items-center justify-center font-display font-bold text-ink-950">
        C
      </div>
      <nav className="flex flex-col gap-3 flex-1">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `group relative w-11 h-11 rounded-lg flex items-center justify-center transition-colors
               ${isActive ? "bg-white/10 text-signal-amber" : "text-mist-500 hover:text-mist-100 hover:bg-white/5"}`
            }
          >
            <Icon size={19} strokeWidth={1.75} />
          </NavLink>
        ))}
      </nav>
      <NavLink to="/settings" className="w-11 h-11 rounded-lg flex items-center justify-center text-mist-500 hover:text-mist-100 hover:bg-white/5">
        <Settings size={19} strokeWidth={1.75} />
      </NavLink>
    </aside>
  );
}
