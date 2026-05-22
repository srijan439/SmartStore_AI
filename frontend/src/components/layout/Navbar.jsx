import { Bell, Menu, Search, UserRound } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden" aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div>
            <p className="text-sm text-slate-500">Workspace</p>
            <h1 className="text-lg font-semibold text-ink">Admin Dashboard</h1>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <label className="flex w-full max-w-md items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search size={17} />
            <input className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search products, orders, insights" />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white" aria-label="Account">
            <UserRound size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
