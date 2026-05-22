import { BarChart3, Boxes, LayoutDashboard, Package, Settings, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/products", icon: Package },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Inventory", path: "/inventory", icon: Boxes },
  { label: "AI Assistant", path: "/assistant", icon: Sparkles },
  { label: "Settings", path: "/settings", icon: Settings }
];

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:block">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
          <Sparkles size={22} />
        </div>
        <div>
          <p className="text-lg font-bold">SmartStore AI</p>
          <p className="text-sm text-slate-500">Admin assistant</p>
        </div>
      </div>

      <nav className="mt-9 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-ink text-white shadow-soft"
                    : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                ].join(" ")
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
