import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/User.js";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  return process.env.JWT_SECRET;
};

export const signAuthToken = (user) => {
  return jwt.sign({ userId: user._id.toString() }, getJwtSecret(), { expiresIn: "7d" });
};

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication token is required" });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: "Database connection is required for authentication" });
    }

    const payload = jwt.verify(token, getJwtSecret());
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: "User session is no longer valid" });
    }

    req.user = user.toPublicJSON();
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Invalid or expired authentication token" });
    }

    return next(error);
  }
};
