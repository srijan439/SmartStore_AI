import ApiError from "../utils/ApiError.js";

const parseOrigins = (value) => {
  return String(value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const defaultOrigins = [
  "http://localhost:5173",
  "https://smart-store-ai-alpha.vercel.app"
];

export const allowedOrigins = [
  ...new Set([
    ...defaultOrigins,
    ...parseOrigins(process.env.CLIENT_URL),
    ...parseOrigins(process.env.CORS_ORIGINS)
  ])
];

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
