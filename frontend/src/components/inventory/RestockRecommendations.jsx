import { RotateCcw } from "lucide-react";

const priorityStyle = {
  Critical: "text-rose-200 bg-rose-500/10 border-rose-500/30",
  High: "text-amber-100 bg-amber-500/10 border-amber-500/30",
  Medium: "text-cyan-100 bg-cyan-500/10 border-cyan-500/30"
};

const RestockRecommendations = ({ recommendations = [] }) => {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/75 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-200">
          <RotateCcw size={19} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Restock Recommendations</h3>
          <p className="text-sm text-slate-500">Target stock and suggested quantity</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {recommendations.length === 0 ? (
          <p className="rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">No restock recommendations right now.</p>
        ) : (
          recommendations.slice(0, 6).map((item) => (
            <article key={item.productId} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.category}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyle[item.priority] || priorityStyle.Medium}`}>
                  {item.priority}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.reason}</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">Current</p>
                  <p className="mt-1 font-semibold text-white">{item.currentStock}</p>
                </div>
                <div>
                  <p className="text-slate-500">Target</p>
                  <p className="mt-1 font-semibold text-white">{item.targetStock}</p>
                </div>
                <div>
                  <p className="text-slate-500">Order</p>
                  <p className="mt-1 font-semibold text-cyan-200">{item.suggestedUnits}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default RestockRecommendations;
