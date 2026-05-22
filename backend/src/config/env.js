import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

import logger from "../utils/logger.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const envPath = path.resolve(currentDirectory, "../../.env");

dotenv.config({ path: envPath, override: true });

const requiredInProduction = ["NODE_ENV", "PORT", "CLIENT_URL", "MONGO_URI", "JWT_SECRET", "GEMINI_API_KEY"];

if (process.env.NODE_ENV === "production") {
  const missing = requiredInProduction.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

if (!process.env.JWT_SECRET) {
  logger.warn("JWT_SECRET is not configured. Authentication routes will fail until it is set.");
}
