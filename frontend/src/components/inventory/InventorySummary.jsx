import { BarChart3 } from "lucide-react";

const InventorySummary = ({ statistics = {} }) => {
  const mostStocked = statistics.mostStockedProducts || [];
  const leastStocked = statistics.leastStockedProducts || [];

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/75 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-200">
          <BarChart3 size={19} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Inventory Summary</h3>
          <p className="text-sm text-slate-500">Most and least stocked products</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-slate-300">Most stocked</p>
          <div className="mt-3 space-y-2">
            {mostStocked.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-lg bg-slate-950/60 px-4 py-3 text-sm">
                <span className="text-slate-300">{product.name}</span>
                <span className="font-semibold text-white">{product.stock}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-300">Least stocked</p>
          <div className="mt-3 space-y-2">
            {leastStocked.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-lg bg-slate-950/60 px-4 py-3 text-sm">
                <span className="text-slate-300">{product.name}</span>
                <span className="font-semibold text-white">{product.stock}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventorySummary;
