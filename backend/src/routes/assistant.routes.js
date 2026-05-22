import { Router } from "express";
import { body } from "express-validator";

import { getAssistantInsights } from "../data/store.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import ApiResponse from "../utils/ApiResponse.js";

const router = Router();

router.get("/insights", (req, res) => {
  ApiResponse.success(res, {
    message: "Assistant insights loaded successfully",
    data: getAssistantInsights()
  });
});

router.post("/ask", body("prompt").trim().isLength({ min: 1, max: 1000 }).withMessage("Prompt is required"), validateRequest, asyncHandler((req, res) => {
  const prompt = String(req.body?.prompt || "").trim();

  return ApiResponse.success(res, {
    message: "Assistant response generated successfully",
    data: {
      answer:
        "I reviewed current sales and stock signals. Prioritize low-stock bestsellers first, keep promotions away from out-of-stock items, and watch average order value during the next campaign."
    }
  });
}));

export default router;
