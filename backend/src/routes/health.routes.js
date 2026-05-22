import { Router } from "express";
import mongoose from "mongoose";

import ApiResponse from "../utils/ApiResponse.js";

const router = Router();

router.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1;

  ApiResponse.success(res, {
    message: isDbConnected
      ? "SmartStore AI backend is connected"
      : "SmartStore AI backend is connected (Database Offline)",
    data: {
      database: isDbConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
