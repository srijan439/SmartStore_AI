import { motion } from "framer-motion";

const SlideUp = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.26, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
};

export default SlideUp;
