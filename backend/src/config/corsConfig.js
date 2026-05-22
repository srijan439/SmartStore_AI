import ApiError from "../utils/ApiError.js";

const parseOrigins = (value) => {
  return String(value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const allowedOrigins = parseOrigins(process.env.CLIENT_URL || "http://localhost:5173");

export const corsConfig = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new ApiError(403, "CORS origin is not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
