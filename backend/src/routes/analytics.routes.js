import { Router } from "express";
import { query } from "express-validator";

import {
  getDashboardMetrics,
  getInventoryMetrics,
  getProductMetrics,
  getRevenueMetrics
} from "../controllers/analyticsController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router = Router();
const analyticsValidation = [
  query("refresh").optional().isBoolean().withMessage("refresh must be true or false")
];

router.get("/", analyticsValidation, validateRequest, asyncHandler(getDashboardMetrics));
router.get("/dashboard", analyticsValidation, validateRequest, asyncHandler(getDashboardMetrics));
router.get("/revenue", analyticsValidation, validateRequest, asyncHandler(getRevenueMetrics));
router.get("/products", analyticsValidation, validateRequest, asyncHandler(getProductMetrics));
router.get("/inventory", analyticsValidation, validateRequest, asyncHandler(getInventoryMetrics));

export default router;
