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
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-400 text-slate-950">
          <Sparkles size={22} />
        </div>
        <div>
          <p className="text-lg font-bold text-white">SmartStore AI</p>
          <p className="text-sm text-slate-400">Admin assistant</p>
        </div>
      </div>

      <nav className="mt-9 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-cyan-400 text-slate-950 shadow-soft"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                ].join(" ")
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
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
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-800 bg-slate-950 px-5 py-6 lg:block">
        <SidebarContent />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-slate-950/75" aria-label="Close menu" onClick={onClose} />
          <aside className="relative h-full w-72 border-r border-slate-800 bg-slate-950 px-5 py-6 shadow-soft">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-300"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
