const statusStyles = {
  success: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30 dark:text-emerald-300",
  warning: "bg-amber-500/10 text-amber-700 ring-amber-500/30 dark:text-amber-300",
  muted: "bg-slate-500/10 text-slate-600 ring-slate-500/30 dark:text-slate-300"
};

const StatusBadge = ({ tone = "muted", children }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[tone]}`}>
      {children}
    </span>
  );
};

export default StatusBadge;
