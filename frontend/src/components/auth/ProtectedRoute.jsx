import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

const ProtectedRoute = () => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-600">Checking session...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
