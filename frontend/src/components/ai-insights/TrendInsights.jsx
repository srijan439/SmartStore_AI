import { TrendingUp } from "lucide-react";

const TrendInsights = ({ categories = [], ai = {} }) => {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/75 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-200">
          <TrendingUp size={19} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Trend Analysis</h3>
          <p className="text-sm text-slate-500">Category and growth signals</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {categories.slice(0, 4).map((category) => (
          <div key={category.category} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm font-medium text-white">{category.category}</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-100">${category.revenue.toLocaleString("en-US")}</p>
            <p className="mt-1 text-xs text-slate-500">{category.products} products, {category.inventoryUnits} units</p>
          </div>
        ))}
      </div>

      {(ai.opportunities || []).length > 0 && (
        <div className="mt-5 space-y-2">
          {ai.opportunities.slice(0, 3).map((item) => (
            <p key={item} className="rounded-lg bg-slate-950/60 px-4 py-3 text-sm leading-6 text-slate-300">{item}</p>
          ))}
        </div>
      )}
    </section>
  );
};

export default TrendInsights;
