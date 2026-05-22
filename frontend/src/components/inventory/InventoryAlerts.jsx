import { AlertTriangle } from "lucide-react";

const severityStyle = {
  Critical: "border-rose-500/30 bg-rose-500/10 text-rose-100",
  High: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  Medium: "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
};

const InventoryAlerts = ({ alerts = [] }) => {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/75 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-400/15 text-rose-200">
          <AlertTriangle size={19} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Smart Alerts</h3>
          <p className="text-sm text-slate-500">Dynamic critical and low-stock notifications</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {alerts.length === 0 ? (
          <p className="rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">No active inventory alerts.</p>
        ) : (
          alerts.slice(0, 7).map((alert) => (
            <article key={alert.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium text-white">{alert.title}</p>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${severityStyle[alert.severity] || severityStyle.Medium}`}>
                  {alert.severity}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">{alert.message}</p>
              <p className="mt-2 text-xs text-slate-500">{alert.category} · Suggested restock {alert.suggestedUnits} units</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default InventoryAlerts;
