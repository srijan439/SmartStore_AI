export const jsonLimit = process.env.JSON_BODY_LIMIT || "1mb";

export const helmetConfig = {
  crossOriginResourcePolicy: {
    policy: "cross-origin"
  },
  contentSecurityPolicy: process.env.NODE_ENV === "production"
    ? undefined
    : false
};

export const rateLimitConfig = {
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  limit: Number(process.env.RATE_LIMIT_MAX || 300),
  standardHeaders: "draft-7",
  legacyHeaders: false
};
