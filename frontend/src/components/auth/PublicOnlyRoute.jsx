import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

const PublicOnlyRoute = () => {
  const auth = useAuth();

  if (auth.loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-600">Checking session...</div>;
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
