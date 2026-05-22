import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import AssistantPage from "./pages/AssistantPage.jsx";
import AIInsights from "./pages/AIInsights.jsx";
import Inventory from "./pages/Inventory.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
