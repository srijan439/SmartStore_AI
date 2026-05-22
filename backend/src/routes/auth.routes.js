import { Router } from "express";
import { body, validationResult } from "express-validator";

import { createUser, findUserByEmail, toPublicUser, verifyPassword } from "../data/users.js";
import { requireAuth, signAuthToken } from "../middleware/auth.middleware.js";

const router = Router();

const sendAuthResponse = (res, user, status = 200) => {
  return res.status(status).json({
    success: true,
    data: {
      user: toPublicUser(user),
      token: signAuthToken(user)
    }
  });
};

router.post(
  "/signup",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").trim().isEmail().withMessage("A valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const existingUser = findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account already exists for this email" });
    }

    const user = await createUser({ name, email, password });
    return sendAuthResponse(res, user, 201);
  }
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("A valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const user = findUserByEmail(req.body.email);
    const isValidPassword = user ? await verifyPassword(req.body.password, user.passwordHash) : false;

    if (!user || !isValidPassword) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    return sendAuthResponse(res, user);
  }
);

router.get("/me", requireAuth, (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

export default router;
