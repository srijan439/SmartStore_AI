import { Router } from "express";

import { getInventory } from "../data/store.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ success: true, data: getInventory() });
});

export default router;
