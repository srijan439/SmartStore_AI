import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-ink">
      <Sidebar />
      <div className="min-h-screen lg:pl-72">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
