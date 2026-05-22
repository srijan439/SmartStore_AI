import { Router } from "express";
import { query } from "express-validator";

import { getAIInsights } from "../controllers/aiInsightsController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router = Router();

router.get(
  "/",
  query("forceAI").optional().isBoolean().withMessage("forceAI must be true or false"),
  validateRequest,
  asyncHandler(getAIInsights)
);

export default router;
