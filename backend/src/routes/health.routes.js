import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1;

  res.status(200).json({
    success: true,
    message: isDbConnected
      ? "SmartStore AI backend is connected"
      : "SmartStore AI backend is connected (Database Offline)",
    database: isDbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

export default router;
