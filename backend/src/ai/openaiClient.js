import "../config/env.js";

import OpenAI from "openai";

const parseTimeout = () => {
  const timeout = Number(String(process.env.OPENAI_TIMEOUT_MS || "").trim() || 20000);
  return Number.isFinite(timeout) && timeout > 0 ? timeout : 20000;
};

const readOpenAIKey = () => {
  const apiKey = String(process.env.OPENAI_API_KEY || "").trim();

  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is required for AI content generation");
    error.statusCode = 503;
    throw error;
  }

  return apiKey;
};

export const getOpenAIClient = () => {
  return new OpenAI({
    apiKey: readOpenAIKey(),
    timeout: parseTimeout(),
    maxRetries: 0
  });
};

export const getOpenAIModel = () => String(process.env.OPENAI_MODEL || "").trim() || "gpt-4.1-mini";
