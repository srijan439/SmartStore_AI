import jwt from "jsonwebtoken";

import { findUserById, toPublicUser } from "../data/users.js";

const getJwtSecret = () => process.env.JWT_SECRET || "smartstore-dev-secret";

export const signAuthToken = (user) => {
  return jwt.sign({ userId: user.id }, getJwtSecret(), { expiresIn: "7d" });
};

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication token is required" });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    const user = findUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: "User session is no longer valid" });
    }

    req.user = toPublicUser(user);
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired authentication token" });
  }
};
