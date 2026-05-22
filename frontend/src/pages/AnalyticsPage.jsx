import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

import { getAnalytics } from "../api/commerceApi.js";
import InventoryPieChart from "../charts/InventoryPieChart.jsx";
import ProductBarChart from "../charts/ProductBarChart.jsx";
import RevenueLineChart from "../charts/RevenueLineChart.jsx";
import AnalyticsGrid from "../components/analytics/AnalyticsGrid.jsx";
import RevenueStats from "../components/analytics/RevenueStats.jsx";
import TopProducts from "../components/analytics/TopProducts.jsx";
import PageHeader from "../components/common/PageHeader.jsx";

const ChartCard = ({ title, description, children, className = "" }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft ${className}`}
    >
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      <div className="mt-5 h-80 min-h-0">{children}</div>
    </motion.article>
  );
};

const LoadingSkeleton = () => {
  return (
    <section className="space-y-5">
      <div className="h-20 animate-pulse rounded-lg bg-slate-900" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-lg bg-slate-900" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="h-96 animate-pulse rounded-lg bg-slate-900 xl:col-span-2" />
        <div className="h-96 animate-pulse rounded-lg bg-slate-900" />
      </div>
    </section>
  );
};

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (requestError) {
      setAnalytics(null);
      setError(requestError.response?.data?.message || "Analytics could not be loaded. Check your backend, session, and database connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  const summary = analytics?.summary || {};
  const revenueTrend = analytics?.revenueTrend || analytics?.salesTrend || [];
  const productPerformance = analytics?.productPerformance || [];
  const inventory = analytics?.inventory || {};
  const topProducts = analytics?.topProducts || [];
  const categoryDistribution = analytics?.categoryDistribution || [];

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Phase 6"
        title="Sales Analytics"
        description="Track revenue, product performance, sales trends, category mix, and inventory health from live product data."
        action={
          <button
            type="button"
            onClick={loadAnalytics}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />

      {error && <p className="rounded-lg border border-rose-900 bg-rose-950/60 px-4 py-3 text-sm text-rose-200">{error}</p>}

      {analytics?.meta?.message && (
        <p className="rounded-lg border border-amber-900 bg-amber-950/50 px-4 py-3 text-sm text-amber-200">{analytics.meta.message}</p>
      )}

      <AnalyticsGrid>
        <RevenueStats summary={summary} />
      </AnalyticsGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Revenue Trend" description="Monthly revenue and inventory movement" className="xl:col-span-2">
          <RevenueLineChart data={revenueTrend} />
        </ChartCard>

        <ChartCard title="Inventory Distribution" description="Healthy, low-stock, and out-of-stock products">
          <InventoryPieChart inventory={inventory} />
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Product Performance" description="Revenue value and stock by product" className="xl:col-span-2">
          <ProductBarChart products={productPerformance} />
        </ChartCard>

        <TopProducts products={topProducts} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft">
          <h3 className="text-base font-semibold text-white">Inventory Statistics</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Total stock", inventory.totalStock],
              ["Healthy stock", inventory.healthyStock],
              ["Low stock", inventory.lowStock],
              ["Out of stock", inventory.outOfStock]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
                <p className="mt-2 text-xl font-semibold text-white">{Number(value || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft">
          <h3 className="text-base font-semibold text-white">Category Performance</h3>
          <div className="mt-5 space-y-3">
            {categoryDistribution.length === 0 ? (
              <p className="text-sm text-slate-500">No category data available yet.</p>
            ) : (
              categoryDistribution.map((category) => (
                <div key={category.category} className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3">
                  <div>
                    <p className="font-medium text-white">{category.category}</p>
                    <p className="text-xs text-slate-500">{category.products} products · {category.inventoryUnits} units</p>
                  </div>
                  <p className="font-semibold text-cyan-300">${Number(category.revenue || 0).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
};

export default AnalyticsPage;
