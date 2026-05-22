import { Bell, LogOut, Menu, Search, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import { useToast } from "../ui/Toast.jsx";

const Navbar = ({ onMenuClick }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    auth.logout();
    toast.showToast({ type: "info", title: "Signed out", message: "Your SmartStore session has ended." });
    navigate("/auth", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-cyan-300 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Workspace</p>
            <h1 className="text-lg font-semibold text-slate-950 dark:text-white">Admin Dashboard</h1>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <label className="flex w-full max-w-md items-center gap-2 rounded-lg border border-slate-200 bg-slate-100/80 px-3 py-2 text-sm text-slate-500 transition focus-within:border-cyan-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <Search size={17} />
            <input className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500" placeholder="Search products, inventory, insights" />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => toast.showToast({ type: "info", title: "Notifications", message: "Smart alerts appear inside inventory and AI insight pages." })}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-950 dark:text-white">{auth.user?.name || "Admin"}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{auth.user?.role || "User"}</p>
          </div>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-300" aria-label="Account">
            <UserRound size={18} />
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Log out"
            type="button"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
