import { Router } from "express";

import { getAnalytics } from "../data/store.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ success: true, data: getAnalytics() });
});

export default router;
