import { FileText, CalendarDays, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const reportTypes = [
  {
    key: "daily",
    label: "Daily Report",
    desc: "Sales, profit, orders, alerts and AI insights for today.",
    icon: CalendarDays,
    color: "text-blue-400",
  },
  {
    key: "weekly",
    label: "Weekly Report",
    desc: "Weekly trends, forecast, top products and recommendations.",
    icon: BarChart3,
    color: "text-amber-400",
  },
  {
    key: "monthly",
    label: "Monthly Report",
    desc: "Executive business report with KPI analysis.",
    icon: FileText,
    color: "text-purple-400",
  },
];

export default function Reports() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">

      <div>
        <span className="eyebrow">AI Reports</span>

        <h1 className="font-display text-3xl font-bold mt-2">
          Business Intelligence Reports
        </h1>

        <p className="text-mist-500 mt-2">
          Generate AI-powered business reports with charts, KPIs and recommendations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {reportTypes.map((r) => {

          const Icon = r.icon;

          return (

            <div
              key={r.key}
              className="panel rounded-2xl p-6 flex flex-col justify-between gap-6 hover:scale-[1.02] transition"
            >

              <div>

                <Icon
                  size={34}
                  className={r.color}
                />

                <h2 className="font-display text-xl mt-4">
                  {r.label}
                </h2>

                <p className="text-mist-500 text-sm mt-3">
                  {r.desc}
                </p>

                <div className="mt-6 space-y-2 text-sm">

                  <div>✓ Revenue Summary</div>

                  <div>✓ KPI Analysis</div>

                  <div>✓ Business Charts</div>

                  <div>✓ AI Insights</div>

                  <div>✓ Recommendations</div>

                </div>

              </div>

              <button
                onClick={() => navigate(`/reports/${r.key}`)}
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 transition"
              >
                Generate Report
              </button>

            </div>

          );

        })}

      </div>

    </div>
  );
}