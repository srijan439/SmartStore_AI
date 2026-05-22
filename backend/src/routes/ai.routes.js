import { Router } from "express";

import { generateContent } from "../controllers/ai.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { aiContentValidation } from "../validations/ai.validation.js";

const router = Router();

router.post("/generate/:type", aiContentValidation, validateRequest, asyncHandler(generateContent));

export default router;
