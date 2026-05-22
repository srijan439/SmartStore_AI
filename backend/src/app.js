import "./config/env.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";

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

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "SmartStore AI API is running",
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
