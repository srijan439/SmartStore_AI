import { motion } from "framer-motion";
import { BarChart3, Boxes, BrainCircuit, LayoutDashboard, Package, Settings, Sparkles, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/products", icon: Package },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Inventory", path: "/inventory", icon: Boxes },
  { label: "AI Insights", path: "/ai-insights", icon: BrainCircuit },
  { label: "AI Assistant", path: "/assistant", icon: Sparkles },
  { label: "Settings", path: "/settings", icon: Settings }
];

const SidebarContent = ({ onNavigate }) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 shadow-sm">
          <Sparkles size={22} />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-950 dark:text-white">SmartStore AI</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin assistant</p>
        </div>
      </div>

      <nav className="mt-9 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-cyan-400 text-slate-950 shadow-soft"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                ].join(" ")
              }
            >
              <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.025 }}>
                <Icon size={18} />
              </motion.span>
              <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.025 + 0.02 }}>
                {item.label}
              </motion.span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};

const Sidebar = ({ isOpen = false, onClose }) => {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white/90 px-5 py-6 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/90 lg:block">
        <SidebarContent />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" aria-label="Close menu" onClick={onClose} />
          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative h-full w-72 border-r border-slate-200 bg-white px-5 py-6 shadow-soft dark:border-slate-800 dark:bg-slate-950"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={onClose} />
          </motion.aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
