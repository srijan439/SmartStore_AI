import { Router } from "express";

import { getAssistantInsights } from "../data/store.js";

const router = Router();

router.get("/insights", (req, res) => {
  res.json({ success: true, data: getAssistantInsights() });
});

router.post("/ask", (req, res) => {
  const prompt = String(req.body?.prompt || "").trim();

  if (!prompt) {
    return res.status(400).json({ success: false, message: "Prompt is required" });
  }

  return res.json({
    success: true,
    data: {
      answer:
        "I reviewed current sales and stock signals. Prioritize low-stock bestsellers first, keep promotions away from out-of-stock items, and watch average order value during the next campaign."
    }
  });
});

export default router;
