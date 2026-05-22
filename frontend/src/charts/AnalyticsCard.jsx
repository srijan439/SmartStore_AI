import { motion } from "framer-motion";

const AnalyticsCard = ({ title, value, detail, icon: Icon, accent = "from-cyan-400/20 to-cyan-400/0" }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft"
    >
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${accent}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
          {detail && <p className="mt-2 text-xs text-slate-500">{detail}</p>}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-cyan-300">
            <Icon size={19} />
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default AnalyticsCard;
