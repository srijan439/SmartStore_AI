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
import { validateRequest } from "../middleware/validation.middleware.js";

const router = Router();
const stockStatuses = ["all", "In Stock", "Low Stock", "Out of Stock"];

const listValidation = [
  query("search").optional({ values: "falsy" }).trim().isLength({ max: 120 }).withMessage("Search must be 120 characters or fewer"),
  query("status").optional({ values: "falsy" }).isIn(stockStatuses).withMessage("Invalid inventory status")
];

router.get("/", listValidation, validateRequest, getInventory);
router.get("/summary", listValidation, validateRequest, getSummary);
router.get("/statistics", getStatistics);
router.get("/low-stock", getLowStock);
router.get("/out-of-stock", getOutOfStock);
router.get("/alerts", getAlerts);
router.get("/restock-recommendations", getRecommendations);
router.patch(
  "/:id/quantity",
  param("id").isMongoId().withMessage("Invalid product id"),
  body("stock").isInt({ min: 0, max: 1000000 }).withMessage("Stock must be a non-negative integer"),
  validateRequest,
  updateQuantity
);

export default router;
