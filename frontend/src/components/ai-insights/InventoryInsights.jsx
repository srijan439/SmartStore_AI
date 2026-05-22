import { Boxes } from "lucide-react";

const InventoryInsights = ({ inventory = {} }) => {
  const constrained = [...(inventory.outOfStockProducts || []), ...(inventory.lowStockProducts || [])].slice(0, 6);

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/75 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/15 text-amber-200">
          <Boxes size={19} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Inventory Intelligence</h3>
          <p className="text-sm text-slate-500">Restock and overstock signals</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {(inventory.stockHealth || []).map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xl font-semibold text-white">{item.value}</p>
            <p className="mt-1 text-xs text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {constrained.length === 0 ? (
          <p className="rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">No restock alerts from current thresholds.</p>
        ) : (
          constrained.map((product) => (
            <div key={product.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{product.name}</p>
                <p className="text-xs text-slate-500">{product.category}</p>
              </div>
              <span className={product.stock === 0 ? "text-sm font-semibold text-rose-200" : "text-sm font-semibold text-amber-200"}>
                {product.stock} left
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default InventoryInsights;
