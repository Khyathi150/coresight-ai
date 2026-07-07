import { Routes, Route, Navigate } from "react-router-dom";
import ReportView from "./pages/ReportView";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Forecasts from "./pages/Forecasts";
import Inventory from "./pages/Inventory";
import Copilot from "./pages/Copilot";
import Reports from "./pages/Reports";

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-ink-950 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<AppShell><Dashboard /></AppShell>} />
      <Route path="/forecasts" element={<AppShell><Forecasts /></AppShell>} />
      <Route path="/inventory" element={<AppShell><Inventory /></AppShell>} />
      <Route path="/copilot" element={<AppShell><Copilot /></AppShell>} />
      <Route path="/reports" element={<AppShell><Reports /></AppShell>} />
      <Route
        path="/reports/:type"
        element={
          <AppShell>
            <ReportView />
          </AppShell>
        }
      />      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
