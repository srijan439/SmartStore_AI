const statusStyles = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  muted: "bg-slate-100 text-slate-600 ring-slate-200"
};

const StatusBadge = ({ tone = "muted", children }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[tone]}`}>
      {children}
    </span>
  );
};

export default StatusBadge;
