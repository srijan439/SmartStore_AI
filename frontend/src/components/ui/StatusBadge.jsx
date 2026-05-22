const statusStyles = {
  success: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
  warning: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
  muted: "bg-slate-700/50 text-slate-300 ring-slate-600"
};

const StatusBadge = ({ tone = "muted", children }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[tone]}`}>
      {children}
    </span>
  );
};

export default StatusBadge;
