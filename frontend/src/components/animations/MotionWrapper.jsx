import { motion } from "framer-motion";

const MotionWrapper = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
