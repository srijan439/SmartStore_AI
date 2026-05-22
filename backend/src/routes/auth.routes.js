import { Router } from "express";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

import { requireAuth, signAuthToken } from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = Router();

const sendAuthResponse = (res, user, status = 200) => {
  return res.status(status).json({
    success: true,
    data: {
      user: user.toPublicJSON(),
      token: signAuthToken(user)
    }
  });
};

const isDatabaseReady = () => mongoose.connection.readyState === 1;

router.post(
  "/signup",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      if (!isDatabaseReady()) {
        return res.status(503).json({ success: false, message: "Database connection is required for signup" });
      }

      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ success: false, message: "An account already exists for this email" });
      }

      const user = await User.create({ name, email, password });
      return sendAuthResponse(res, user, 201);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ success: false, message: "An account already exists for this email" });
      }

      return next(error);
    }
  }
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required")
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      if (!isDatabaseReady()) {
        return res.status(503).json({ success: false, message: "Database connection is required for login" });
      }

      const user = await User.findOne({ email: req.body.email }).select("+password");
      const isValidPassword = user ? await user.comparePassword(req.body.password) : false;

      if (!user || !isValidPassword) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }

      return sendAuthResponse(res, user);
    } catch (error) {
      return next(error);
    }
  }
);

router.get("/me", requireAuth, (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

export default router;
