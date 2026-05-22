import { Check, Clipboard } from "lucide-react";
import { useState } from "react";

const AIResultCard = ({ title, result }) => {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <article className="rounded-lg border border-dashed border-slate-800 bg-slate-900/40 p-5">
        <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-500">Generated content will appear here.</p>
      </article>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">{result.model} · {new Date(result.generatedAt).toLocaleTimeString()}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-700 px-3 text-xs font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
        >
          {copied ? <Check size={15} /> : <Clipboard size={15} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-6 text-slate-300">{result.content}</pre>
    </article>
  );
};

export default AIResultCard;
