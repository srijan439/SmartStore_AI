import rateLimit from "express-rate-limit";

import { rateLimitConfig } from "../config/securityConfig.js";
import ApiResponse from "../utils/ApiResponse.js";

export const apiRateLimiter = rateLimit({
  ...rateLimitConfig,
  message: "Too many requests. Please try again later.",
  handler: (req, res, next, options) => {
    return ApiResponse.error(res, {
      statusCode: options.statusCode,
      message: options.message,
      errors: []
    });
  }
});

export const authRateLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  limit: Number(process.env.AUTH_RATE_LIMIT_MAX || 30),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many authentication attempts. Please try again later.",
  handler: (req, res, next, options) => {
    return ApiResponse.error(res, {
      statusCode: options.statusCode,
      message: options.message,
      errors: []
    });
  }
});
