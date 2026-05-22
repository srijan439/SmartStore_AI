const InventoryCard = ({ icon: Icon, label, value, detail, tone = "cyan" }) => {
  const tones = {
    cyan: "bg-cyan-400/15 text-cyan-200",
    amber: "bg-amber-400/15 text-amber-200",
    rose: "bg-rose-400/15 text-rose-200",
    emerald: "bg-emerald-400/15 text-emerald-200"
  };

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-cyan-400/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
          {detail && <p className="mt-2 text-sm text-slate-500">{detail}</p>}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tones[tone] || tones.cyan}`}>
          <Icon size={19} />
        </div>
      </div>
    </article>
  );
};

export default InventoryCard;
