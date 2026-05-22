import { Router } from "express";
import { body, param, query } from "express-validator";

import {
  getAlerts,
  getInventory,
  getLowStock,
  getOutOfStock,
  getRecommendations,
  getStatistics,
  getSummary,
  updateQuantity
} from "../controllers/inventoryController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router = Router();
const stockStatuses = ["all", "In Stock", "Low Stock", "Out of Stock"];

const listValidation = [
  query("search").optional({ values: "falsy" }).trim().isLength({ max: 120 }).withMessage("Search must be 120 characters or fewer"),
  query("status").optional({ values: "falsy" }).isIn(stockStatuses).withMessage("Invalid inventory status")
];

router.get("/", listValidation, validateRequest, asyncHandler(getInventory));
router.get("/summary", listValidation, validateRequest, asyncHandler(getSummary));
router.get("/statistics", asyncHandler(getStatistics));
router.get("/low-stock", asyncHandler(getLowStock));
router.get("/out-of-stock", asyncHandler(getOutOfStock));
router.get("/alerts", asyncHandler(getAlerts));
router.get("/restock-recommendations", asyncHandler(getRecommendations));
router.patch(
  "/:id/quantity",
  param("id").isMongoId().withMessage("Invalid product id"),
  body("stock").isInt({ min: 0, max: 1000000 }).withMessage("Stock must be a non-negative integer"),
  validateRequest,
  asyncHandler(updateQuantity)
);

export default router;
