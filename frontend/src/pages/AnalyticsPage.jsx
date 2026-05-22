import { useEffect, useState } from "react";

import { getAnalytics } from "../api/commerceApi.js";

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getAnalytics().then(setAnalytics).catch(() => setAnalytics(null));
  }, []);

  if (!analytics) {
    return <section className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-300 shadow-soft">Loading analytics...</section>;
  }

  const maxRevenue = Math.max(...analytics.salesTrend.map((point) => point.revenue));

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Analytics</h2>
        <p className="mt-1 text-sm text-slate-400">Revenue, order volume, and catalog performance in one view.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Revenue", `$${analytics.summary.revenue.toLocaleString()}`],
          ["Orders", analytics.summary.orders],
          ["Average Order", `$${analytics.summary.averageOrderValue}`],
          ["Low Stock", analytics.summary.lowStockCount]
        ].map(([label, value]) => (
          <article key={label} className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft lg:col-span-2">
          <h3 className="text-base font-semibold text-white">Monthly Revenue</h3>
          <div className="mt-4 flex h-72 items-end gap-3">
            {analytics.salesTrend.map((point) => (
              <div key={point.month} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
                <div className="flex min-h-0 flex-1 items-end rounded-lg bg-slate-950 px-2">
                  <div
                    className="w-full rounded-t-lg bg-cyan-400"
                    style={{ height: `${Math.max((point.revenue / maxRevenue) * 100, 8)}%` }}
                    title={`$${point.revenue.toLocaleString()}`}
                  />
                </div>
                <span className="text-center text-xs font-medium text-slate-400">{point.month}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft">
          <h3 className="text-base font-semibold text-white">Top Products</h3>
          <div className="mt-4 space-y-4">
            {analytics.topProducts.map((product) => (
              <div key={product.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-white">{product.name}</span>
                  <span className="text-slate-400">{product.sales}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-950">
                  <div className="h-full rounded-full bg-coral" style={{ width: `${Math.min(product.sales / 6, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default AnalyticsPage;
