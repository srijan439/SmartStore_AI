import { Check, Clipboard, Zap } from "lucide-react";
import { useState } from "react";

const priorityStyles = {
  High: "border-rose-500/30 bg-rose-500/10 text-rose-200",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  Low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
};

const InsightCard = ({ insight }) => {
  const [copied, setCopied] = useState(false);
  const copyText = [insight.title, insight.action, insight.reasoning].filter(Boolean).join("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-cyan-400/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-200">
            <Zap size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyles[insight.priority] || priorityStyles.Medium}`}>
                {insight.priority}
              </span>
              <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300">{insight.type}</span>
            </div>
            <h3 className="mt-3 text-base font-semibold leading-6 text-white">{insight.title}</h3>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-cyan-300 hover:text-cyan-200"
          aria-label="Copy insight"
          title="Copy insight"
        >
          {copied ? <Check size={17} /> : <Clipboard size={17} />}
        </button>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{insight.action}</p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{insight.reasoning}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {insight.metric && <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">{insight.metric}</span>}
        {(insight.products || []).slice(0, 3).map((product) => (
          <span key={product} className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
            {product}
          </span>
        ))}
      </div>
    </article>
  );
};

export default InsightCard;
