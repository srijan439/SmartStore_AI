import { LineChart } from "lucide-react";

const RevenueInsights = ({ summary = {}, ai = {} }) => {
  const stats = [
    ["Inventory Value", `$${(summary.inventoryValue || 0).toLocaleString("en-US")}`],
    ["Average Price", `$${(summary.averagePrice || 0).toLocaleString("en-US")}`],
    ["Active Products", summary.activeProducts || 0],
    ["Total Stock", (summary.totalStock || 0).toLocaleString("en-US")]
  ];

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/75 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-400/15 text-violet-200">
          <LineChart size={19} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Revenue Optimization</h3>
          <p className="text-sm text-slate-500">Inventory-value based signals</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      {(ai.nextActions || []).length > 0 && (
        <div className="mt-5 space-y-2">
          {ai.nextActions.slice(0, 4).map((action) => (
            <p key={action} className="rounded-lg bg-slate-950/60 px-4 py-3 text-sm leading-6 text-slate-300">{action}</p>
          ))}
        </div>
      )}
    </section>
  );
};

export default RevenueInsights;
