import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  LineChart,
  Package,
  MessageSquareText,
  FileText,
  Settings,
  Menu,
  X,
} from "lucide-react";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/forecasts", icon: LineChart, label: "Forecasts" },
  { to: "/inventory", icon: Package, label: "Inventory" },
  { to: "/copilot", icon: MessageSquareText, label: "Copilot" },
  { to: "/reports", icon: FileText, label: "Reports" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-ink-900 text-white"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          h-screen w-[76px]
          bg-ink-900 border-r border-white/5
          flex flex-col items-center py-5 gap-8
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Close Button (mobile) */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden absolute top-4 right-4 text-white"
        >
          <X size={22} />
        </button>

        <div className="w-9 h-9 rounded-lg bg-signal-amber flex items-center justify-center font-display font-bold text-ink-950">
          C
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          {items.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `w-11 h-11 rounded-lg flex items-center justify-center transition-colors
                ${
                  isActive
                    ? "bg-white/10 text-signal-amber"
                    : "text-mist-500 hover:text-mist-100 hover:bg-white/5"
                }`
              }
            >
              <Icon size={19} strokeWidth={1.75} />
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/settings"
          onClick={() => setOpen(false)}
          className="w-11 h-11 rounded-lg flex items-center justify-center text-mist-500 hover:text-mist-100 hover:bg-white/5"
        >
          <Settings size={19} strokeWidth={1.75} />
        </NavLink>
      </aside>
    </>
  );
}