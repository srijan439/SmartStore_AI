import mongoose from "mongoose";

import { getBusinessMetrics, getEmptyBusinessMetrics } from "./analyticsInterpreter.js";
import { buildBusinessInsightPrompt, businessInsightSchema } from "./insightPromptTemplates.js";
import { buildRecommendationCandidates } from "./recommendationEngine.js";
import { getGeminiClient, getGeminiModel, getGeminiTimeout } from "./geminiClient.js";

const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const withTimeout = async (promise, timeoutMs) => {
  let timeoutId;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      const error = new Error("Gemini business insights request timed out");
      error.statusCode = 504;
      reject(error);
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

const isRetryableError = (error) => {
  const status = error.status || error.statusCode;
  return !status || status === 408 || status === 409 || status === 429 || status >= 500;
};

const getProviderErrorMessage = (error) => {
  const message = error?.message || "";

  try {
    return JSON.parse(message)?.error?.message || message;
  } catch {
    return message;
  }
};

const getGeminiErrorMessage = (error, model) => {
  const status = error?.status || error?.statusCode;
  const providerMessage = getProviderErrorMessage(error).toLowerCase();

  if (status === 401 || status === 403) {
    return "Gemini API key is invalid or unauthorized";
  }

  if (status === 404 && providerMessage.includes("model")) {
    return `Gemini model "${model}" is unavailable. Update GEMINI_MODEL in backend/.env`;
  }

  if (status === 429) {
    return "Gemini rate limit reached. Try again shortly";
  }

  if (status === 503 && providerMessage.includes("high demand")) {
    return "Gemini is currently experiencing high demand. Try again shortly";
  }

  if (status === 503 && providerMessage.includes("gemini_api_key")) {
    return "GEMINI_API_KEY is required for AI business insights";
  }

  if (status === 504) {
    return "Gemini business insights request timed out";
  }

  return "Gemini business insights generation failed";
};

const parseAIOutput = (response) => {
  const content = String(response.text || "").trim();

  if (!content) {
    const error = new Error("Gemini returned an empty business insights response");
    error.statusCode = 502;
    throw error;
  }

  try {
    return JSON.parse(content);
  } catch {
    const error = new Error("Gemini returned business insights in an invalid format");
    error.statusCode = 502;
    throw error;
  }
};

const buildFallbackAIOutput = (recommendations) => ({
  executiveSummary:
    "Business intelligence is based on live catalog, pricing, stock, category, and inventory-value signals. Configure Gemini to generate a richer executive interpretation.",
  recommendations: recommendations.slice(0, 8).map((recommendation) => ({
    title: recommendation.title,
    category: recommendation.type,
    priority: recommendation.priority,
    impact: recommendation.impact,
    action: recommendation.action,
    reasoning: recommendation.reasoning,
    relatedProducts: recommendation.products || []
  })),
  riskAlerts: recommendations
    .filter((recommendation) => recommendation.priority === "High")
    .slice(0, 4)
    .map((recommendation) => recommendation.reasoning),
  opportunities: recommendations
    .filter((recommendation) => ["Growth", "Revenue", "Sales", "Marketing"].includes(recommendation.type))
    .slice(0, 4)
    .map((recommendation) => recommendation.action),
  nextActions: recommendations.slice(0, 5).map((recommendation) => recommendation.action)
});

const callGeminiWithRetry = async ({ metrics, recommendations, attempts = 2 }) => {
  const client = getGeminiClient();
  const model = getGeminiModel();
  const timeoutMs = getGeminiTimeout();
  const prompt = buildBusinessInsightPrompt({ metrics, recommendations });
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await withTimeout(
        client.models.generateContent({
          model,
          contents: prompt.input,
          config: {
            systemInstruction: prompt.instructions,
            maxOutputTokens: 1400,
            responseMimeType: "application/json",
            responseJsonSchema: businessInsightSchema
          }
        }),
        timeoutMs
      );

      return {
        model,
        requestId: null,
        data: parseAIOutput(response)
      };
    } catch (error) {
      lastError = error;

      if (attempt === attempts || !isRetryableError(error)) {
        break;
      }

      await delay(500 * attempt);
    }
  }

  const serviceError = new Error(getGeminiErrorMessage(lastError, model));
  serviceError.statusCode = lastError?.status === 429 ? 429 : lastError?.statusCode || 502;
  throw serviceError;
};

export const generateBusinessInsights = async ({ forceAI = false } = {}) => {
  const metrics = mongoose.connection.readyState === 1 ? await getBusinessMetrics() : getEmptyBusinessMetrics();
  const recommendations = buildRecommendationCandidates(metrics);
  let aiStatus = "generated";
  let aiError = null;
  let aiResult;

  try {
    aiResult = await callGeminiWithRetry({ metrics, recommendations });
  } catch (error) {
    if (forceAI) {
      throw error;
    }

    aiStatus = "fallback";
    aiError = error.message;
    aiResult = {
      model: null,
      requestId: null,
      data: buildFallbackAIOutput(recommendations)
    };
  }

  return {
    summary: aiResult.data.executiveSummary,
    aiStatus,
    aiError,
    model: aiResult.model,
    requestId: aiResult.requestId,
    metrics,
    recommendations,
    ai: aiResult.data,
    generatedAt: new Date().toISOString()
  };
};
