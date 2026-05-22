import { useEffect, useState } from "react";
import { Activity, BadgeDollarSign, Boxes, PackagePlus, Sparkles } from "lucide-react";

import { getAnalytics } from "../api/commerceApi.js";
import { getBackendHealth } from "../api/healthApi.js";
import DashboardCard from "../components/dashboard/DashboardCard.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";

const DashboardPage = () => {
  const [health, setHealth] = useState({ loading: true, connected: false, message: "Checking API connection" });
  const [analytics, setAnalytics] = useState(null);

  const metrics = [
    {
      label: "Revenue",
      value: analytics ? `$${analytics.summary.revenue.toLocaleString()}` : "--",
      icon: BadgeDollarSign,
      tone: "bg-emerald-100 text-emerald-700"
    },
    {
      label: "Products",
      value: analytics ? analytics.summary.products.toLocaleString() : "--",
      icon: PackagePlus,
      tone: "bg-cyan-100 text-cyan-700"
    },
    {
      label: "Inventory Alerts",
      value: analytics ? analytics.summary.lowStockCount.toLocaleString() : "--",
      icon: Boxes,
      tone: "bg-rose-100 text-rose-700"
    },
    {
      label: "AI Insights",
      value: analytics ? "3" : "--",
      icon: Sparkles,
      tone: "bg-violet-100 text-violet-700"
    }
  ];

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

  useEffect(() => {
    let isMounted = true;

    getAnalytics()
      .then((data) => {
        if (isMounted) {
          setAnalytics(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAnalytics(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-800 bg-slate-900 p-6 text-white shadow-soft sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-cyan-200">Phase 2 secured workspace</p>
          <h2 className="mt-2 text-2xl font-bold">Authenticated commerce operations, ready to scale.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Manage products, analytics, inventory, and AI recommendations behind protected dashboard routes.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3">
          <Activity size={18} />
          <span className="text-sm">{health.message}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          return (
            <DashboardCard key={metric.label} label={metric.label} value={metric.value} icon={metric.icon} tone="text-cyan-300" />
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Backend Connection</h3>
            <StatusBadge tone={health.connected ? "success" : "warning"}>
              {health.loading ? "Checking" : health.connected ? "Connected" : "Offline"}
            </StatusBadge>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            The frontend calls the Express health endpoint through Axios. This verifies routing, environment configuration, CORS, and API availability.
          </p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft">
          <h3 className="text-base font-semibold text-white">Phase 4 Focus</h3>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Product CRUD is backed by MongoDB with validation, filtering, loading states, and protected API access.
          </p>
        </article>
      </div>
    </section>
  );
};

export default DashboardPage;
