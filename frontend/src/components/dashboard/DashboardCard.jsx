import { motion } from "framer-motion";

const DashboardCard = ({ label, value, icon: Icon, tone = "text-cyan-300", children }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -3 }}
      className="rounded-lg border border-slate-200 bg-white/85 p-5 shadow-soft backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/80"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-950 ${tone}`}>
            <Icon size={21} />
          </div>
        )}
      </div>
      {children}
    </motion.article>
  );
};

export default DashboardCard;
