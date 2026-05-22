import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { corsConfig } from "../config/corsConfig.js";
import { helmetConfig, jsonLimit } from "../config/securityConfig.js";
import logger from "../utils/logger.js";
import { apiRateLimiter } from "./rateLimiter.js";

const dangerousKeys = new Set(["$where", "$regex", "$expr", "$function"]);

const cleanString = (value) => {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/\bon\w+\s*=/gi, "");
};

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((cleaned, [key, nestedValue]) => {
      if (key.startsWith("$") || key.includes(".") || dangerousKeys.has(key)) {
        return cleaned;
      }

      cleaned[key] = sanitizeValue(nestedValue);
      return cleaned;
    }, {});
  }

  if (typeof value === "string") {
    return cleanString(value);
  }

  return value;
};

export const sanitizeRequest = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  if (req.query) {
    req.query = sanitizeValue(req.query);
  }

  return next();
};

export const applySecurityMiddleware = (app) => {
  app.disable("x-powered-by");
  app.use(helmet(helmetConfig));
  app.use(cors(corsConfig));
  app.use(compression());
  app.use(express.json({ limit: jsonLimit }));
  app.use(express.urlencoded({ extended: true, limit: jsonLimit }));
  app.use(sanitizeRequest);
  app.use(
    morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
      stream: {
        write: (message) => logger.info(message.trim())
      },
      skip: (req) => req.path === "/api/health"
    })
  );
  app.use("/api", apiRateLimiter);
};
