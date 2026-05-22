import { Router } from "express";

import {
  getDashboardMetrics,
  getInventoryMetrics,
  getProductMetrics,
  getRevenueMetrics
} from "../controllers/analyticsController.js";

const router = Router();

router.get("/", getDashboardMetrics);
router.get("/dashboard", getDashboardMetrics);
router.get("/revenue", getRevenueMetrics);
router.get("/products", getProductMetrics);
router.get("/inventory", getInventoryMetrics);

export default router;
