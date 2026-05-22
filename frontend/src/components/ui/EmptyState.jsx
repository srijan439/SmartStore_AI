import { Inbox } from "lucide-react";

const EmptyState = ({ title, description, action }) => {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/70 p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-700 dark:text-cyan-200">
        <Inbox size={22} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
