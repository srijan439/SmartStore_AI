import "../config/env.js";

import { GoogleGenAI } from "@google/genai";

export const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error("GEMINI_API_KEY is required for AI content generation");
    error.statusCode = 503;
    throw error;
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });
};

export const getGeminiModel = () => process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

export const getGeminiTimeout = () => Number(process.env.GEMINI_TIMEOUT_MS || 20000);
