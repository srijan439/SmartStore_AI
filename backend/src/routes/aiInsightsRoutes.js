import { Router } from "express";
import { query } from "express-validator";

import { getAIInsights } from "../controllers/aiInsightsController.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router = Router();

router.get(
  "/",
  query("forceAI").optional().isBoolean().withMessage("forceAI must be true or false"),
  validateRequest,
  getAIInsights
);

export default router;
