import { motion } from "framer-motion";

const DashboardCard = ({ label, value, icon: Icon, tone = "text-cyan-300", children }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-soft"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 ${tone}`}>
            <Icon size={21} />
          </div>
        )}
      </div>
      {children}
    </motion.article>
  );
};

export default DashboardCard;
