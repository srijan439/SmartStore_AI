import "../config/env.js";

import OpenAI from "openai";

const timeout = Number(process.env.OPENAI_TIMEOUT_MS || 20000);

export const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("OPENAI_API_KEY is required for AI content generation");
    error.statusCode = 503;
    throw error;
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout,
    maxRetries: 0
  });
};

export const getOpenAIModel = () => process.env.OPENAI_MODEL || "gpt-4.1-mini";
