import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, PackageOpen } from "lucide-react";

import { getInventory } from "../api/commerceApi.js";
import StatusBadge from "../components/ui/StatusBadge.jsx";

const InventoryPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getInventory().then(setItems).catch(() => setItems([]));
  }, []);

  const lowStock = items.filter((item) => item.stock <= item.reorderPoint);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Inventory</h2>
        <p className="mt-1 text-sm text-slate-600">Track stock levels, reorder points, and urgent replenishment work.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <PackageOpen className="text-cyan-600" size={22} />
          <p className="mt-3 text-sm text-slate-500">Tracked SKUs</p>
          <p className="mt-1 text-2xl font-bold">{items.length}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <AlertTriangle className="text-coral" size={22} />
          <p className="mt-3 text-sm text-slate-500">Needs Restock</p>
          <p className="mt-1 text-2xl font-bold">{lowStock.length}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle2 className="text-emerald-600" size={22} />
          <p className="mt-3 text-sm text-slate-500">Healthy Stock</p>
          <p className="mt-1 text-2xl font-bold">{items.length - lowStock.length}</p>
        </article>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const percent = Math.min(Math.round((item.stock / Math.max(item.reorderPoint * 2, 1)) * 100), 100);

          return (
            <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.sku} &middot; Reorder at {item.reorderPoint}</p>
                </div>
                <StatusBadge tone={item.stock <= item.reorderPoint ? "warning" : "success"}>{item.status}</StatusBadge>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-mint" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {item.stock} units on hand. {item.restockUnits > 0 ? `Suggested reorder: ${item.restockUnits} units.` : "No reorder needed."}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default InventoryPage;
