import { BrainCircuit, RefreshCw } from "lucide-react";

const AIInsightSummary = ({ data, loading, onRefresh }) => {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-400 text-slate-950">
            <BrainCircuit size={22} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-white">AI Business Summary</h3>
              <span className={data?.aiStatus === "generated" ? "rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-200" : "rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-200"}>
                {data?.aiStatus === "generated" ? "Gemini generated" : "Metric fallback"}
              </span>
            </div>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">{data?.summary}</p>
            {data?.aiError && <p className="mt-3 text-sm text-amber-200">{data.aiError}</p>}
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh insights
        </button>
      </div>
    </section>
  );
};

export default AIInsightSummary;
