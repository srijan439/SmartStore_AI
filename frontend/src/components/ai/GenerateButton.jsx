import { Sparkles } from "lucide-react";

const GenerateButton = ({ children, loading, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={[
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
        active ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300" : "border border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
      ].join(" ")}
    >
      <Sparkles size={16} />
      {loading ? "Generating..." : children}
    </button>
  );
};

export default GenerateButton;
