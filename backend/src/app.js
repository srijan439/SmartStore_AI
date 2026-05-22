import "./config/env.js";

import express from "express";

import aiRoutes from "./routes/ai.routes.js";
import aiInsightsRoutes from "./routes/aiInsightsRoutes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import assistantRoutes from "./routes/assistant.routes.js";
import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import productsRoutes from "./routes/products.routes.js";
import { requireAuth } from "./middleware/auth.middleware.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";
import { applySecurityMiddleware } from "./middleware/securityMiddleware.js";
import ApiResponse from "./utils/ApiResponse.js";

const app = express();

applySecurityMiddleware(app);

app.get("/api", (req, res) => {
  ApiResponse.success(res, {
    message: "SmartStore AI API is running",
    data: {
      endpoints: {
        health: "/api/health",
        auth: "/api/auth",
        products: "/api/products",
        inventory: "/api/inventory",
        analytics: "/api/analytics",
        aiInsights: "/api/ai-insights",
        assistant: "/api/assistant",
        ai: "/api/ai"
      }
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/products", requireAuth, productsRoutes);
app.use("/api/inventory", requireAuth, inventoryRoutes);
app.use("/api/analytics", requireAuth, analyticsRoutes);
app.use("/api/ai-insights", requireAuth, aiInsightsRoutes);
app.use("/api/assistant", requireAuth, assistantRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
