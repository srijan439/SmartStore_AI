import { useEffect, useState } from "react";
import { Activity, BadgeDollarSign, Boxes, PackagePlus, Sparkles } from "lucide-react";

import { getBackendHealth } from "../api/healthApi.js";
import StatusBadge from "../components/ui/StatusBadge.jsx";

const metrics = [
  { label: "Revenue", value: "$48.2K", icon: BadgeDollarSign, tone: "bg-emerald-100 text-emerald-700" },
  { label: "Active Products", value: "1,284", icon: PackagePlus, tone: "bg-cyan-100 text-cyan-700" },
  { label: "Inventory Alerts", value: "18", icon: Boxes, tone: "bg-rose-100 text-rose-700" },
  { label: "AI Suggestions", value: "36", icon: Sparkles, tone: "bg-violet-100 text-violet-700" }
];

const DashboardPage = () => {
  const [health, setHealth] = useState({ loading: true, connected: false, message: "Checking API connection" });

  useEffect(() => {
    let isMounted = true;

    getBackendHealth()
      .then((data) => {
        if (isMounted) {
          setHealth({ loading: false, connected: true, message: data.message });
        }
      })
      .catch(() => {
        if (isMounted) {
          setHealth({ loading: false, connected: false, message: "Backend is not reachable" });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-lg bg-ink p-6 text-white shadow-soft sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-cyan-200">Phase 1 foundation</p>
          <h2 className="mt-2 text-2xl font-bold">AI commerce operations, ready to scale.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Manage products, analytics, inventory, and AI recommendations from a single admin workspace.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-3">
          <Activity size={18} />
          <span className="text-sm">{health.message}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${metric.tone}`}>
                  <Icon size={21} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Backend Connection</h3>
            <StatusBadge tone={health.connected ? "success" : "warning"}>
              {health.loading ? "Checking" : health.connected ? "Connected" : "Offline"}
            </StatusBadge>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            The frontend calls the Express health endpoint through Axios. This verifies routing, environment configuration, CORS, and API availability.
          </p>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold">Next Build Area</h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Phase 2 will add signup, login, JWT authentication, password hashing, and protected dashboard routes.
          </p>
        </article>
      </div>
    </section>
  );
};

export default DashboardPage;
