import { Router } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

import { requireAuth, signAuthToken } from "../middleware/auth.middleware.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { validateRequest } from "../middleware/validateRequest.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const router = Router();

const sendAuthResponse = (res, user, status = 200) => {
  return ApiResponse.success(res, {
    statusCode: status,
    message: "Authentication successful",
    data: {
      user: user.toPublicJSON(),
      token: signAuthToken(user)
    }
  });
};

const isDatabaseReady = () => mongoose.connection.readyState === 1;

router.post(
  "/signup",
  authRateLimiter,
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    if (!isDatabaseReady()) {
      throw new ApiError(503, "Database connection is required for signup");
    }

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "An account already exists for this email");
    }

    const user = await User.create({ name, email, password });
    return sendAuthResponse(res, user, 201);
  })
);

router.post(
  "/login",
  authRateLimiter,
  [
    body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    if (!isDatabaseReady()) {
      throw new ApiError(503, "Database connection is required for login");
    }

    const user = await User.findOne({ email: req.body.email }).select("+password");
    const isValidPassword = user ? await user.comparePassword(req.body.password) : false;

    if (!user || !isValidPassword) {
      throw new ApiError(401, "Invalid email or password");
    }

    return sendAuthResponse(res, user);
  })
);

router.get("/me", requireAuth, (req, res) => {
  ApiResponse.success(res, {
    message: "Current user loaded successfully",
    data: { user: req.user }
  });
});

export default router;
