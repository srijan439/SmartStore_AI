import { Bell, LogOut, Menu, Search, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = ({ onMenuClick }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-300 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <p className="text-sm text-slate-400">Workspace</p>
            <h1 className="text-lg font-semibold text-white">Admin Dashboard</h1>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <label className="flex w-full max-w-md items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-400">
            <Search size={17} />
            <input className="w-full bg-transparent text-white outline-none placeholder:text-slate-500" placeholder="Search products, orders, insights" />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-300 transition hover:bg-slate-900" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">{auth.user?.name || "Admin"}</p>
            <p className="text-xs text-slate-400">{auth.user?.role || "User"}</p>
          </div>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400 text-slate-950" aria-label="Account">
            <UserRound size={18} />
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-300 transition hover:bg-slate-900"
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
