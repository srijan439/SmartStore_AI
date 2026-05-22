import { motion } from "framer-motion";
import { AlertTriangle, Boxes, CheckCircle2, PackageSearch, RefreshCw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getInventorySummary } from "../api/commerceApi.js";
import InventoryAlerts from "../components/inventory/InventoryAlerts.jsx";
import InventoryCard from "../components/inventory/InventoryCard.jsx";
import InventorySummary from "../components/inventory/InventorySummary.jsx";
import LowStockTable from "../components/inventory/LowStockTable.jsx";
import RestockRecommendations from "../components/inventory/RestockRecommendations.jsx";
import PageHeader from "../components/common/PageHeader.jsx";

const statusOptions = ["all", "In Stock", "Low Stock", "Out of Stock"];

const Inventory = () => {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInventory = async () => {
    setLoading(true);
    setError("");

    try {
      const summary = await getInventorySummary({ search, status });
      setData(summary);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.errors?.[0]?.msg || "Inventory could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const statistics = data?.statistics || {};
  const filteredProducts = data?.products || [];
  const lowAndOutProducts = useMemo(
    () => filteredProducts.filter((product) => product.inventoryStatus !== "In Stock"),
    [filteredProducts]
  );

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Phase 8"
        title="Inventory Monitoring"
        description="Monitor availability, detect stock risks, and act on smart restock alerts from live product inventory."
        action={
          <button
            type="button"
            onClick={loadInventory}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh inventory
          </button>
        }
      />

      <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                loadInventory();
              }
            }}
            placeholder="Search product or category"
            className="h-11 w-full rounded-lg border border-slate-800 bg-slate-900 px-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
          />
        </label>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-11 rounded-lg border border-slate-800 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-cyan-400"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>{option === "all" ? "All statuses" : option}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={loadInventory}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-800 px-4 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-100"
        >
          Apply filters
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-rose-900 bg-rose-950/60 px-4 py-3 text-sm text-rose-100">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading && !data ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-lg border border-slate-800 bg-slate-900/80" />
          ))}
        </div>
      ) : (
        data && (
          <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <InventoryCard icon={PackageSearch} label="Total Products" value={statistics.totalProducts || 0} detail="Tracked SKUs" />
              <InventoryCard icon={Boxes} label="Inventory Count" value={(statistics.totalInventoryCount || 0).toLocaleString("en-US")} detail="Units on hand" tone="emerald" />
              <InventoryCard icon={AlertTriangle} label="Low Stock" value={statistics.lowStockCount || 0} detail="1 to 20 units" tone="amber" />
              <InventoryCard icon={CheckCircle2} label="Out of Stock" value={statistics.outOfStockCount || 0} detail="0 units available" tone="rose" />
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <LowStockTable products={lowAndOutProducts} />
              <InventoryAlerts alerts={data.alerts || []} />
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <RestockRecommendations recommendations={data.recommendations || []} />
              <InventorySummary statistics={statistics} />
            </div>
          </motion.div>
        )
      )}
    </section>
  );
};

export default Inventory;
