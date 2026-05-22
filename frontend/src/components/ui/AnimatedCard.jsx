import { motion } from "framer-motion";

const AnimatedCard = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className={`rounded-lg border border-slate-200 bg-white/85 shadow-soft backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/80 ${className}`}
    >
      {children}
    </motion.article>
  );
};

export default AnimatedCard;
