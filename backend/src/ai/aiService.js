import { getGeminiClient, getGeminiModel, getGeminiTimeout } from "./geminiClient.js";
import { buildAIPrompt, getContentTypeConfig } from "./promptTemplates.js";
import { formatAIResponse } from "./responseFormatter.js";

const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const withTimeout = async (promise, timeoutMs) => {
  let timeoutId;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      const error = new Error("Gemini request timed out");
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

const getGeminiErrorMessage = ({ status, providerMessage, model }) => {
  const normalizedProviderMessage = providerMessage.toLowerCase();

  if (status === 401 || status === 403) {
    return "Gemini API key is invalid or unauthorized";
  }

  if (status === 404 && normalizedProviderMessage.includes("model")) {
    return `Gemini model "${model}" is unavailable. Update GEMINI_MODEL in backend/.env`;
  }

  if (status === 503 && normalizedProviderMessage.includes("high demand")) {
    return "Gemini is currently experiencing high demand. Try again shortly or use GEMINI_MODEL=gemini-2.5-flash-lite";
  }

  if (status === 429) {
    return "Gemini rate limit reached. Try again shortly";
  }

  if (status === 504) {
    return "Gemini request timed out. Try again";
  }

  return "AI content generation failed";
};

const callGeminiWithRetry = async ({ type, product, attempts = 2 }) => {
  const client = getGeminiClient();
  const model = getGeminiModel();
  const timeoutMs = getGeminiTimeout();
  const config = getContentTypeConfig(type);
  const prompt = buildAIPrompt({ type, product });
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await withTimeout(
        client.models.generateContent({
          model,
          contents: `${prompt.instructions}\n\n${prompt.input}`,
          config: {
            maxOutputTokens: config.maxOutputTokens
          }
        }),
        timeoutMs
      );

      return {
        model,
        rawText: response.text,
        requestId: null
      };
    } catch (error) {
      lastError = error;

      if (attempt === attempts || !isRetryableError(error)) {
        break;
      }

      await delay(400 * attempt);
    }
  }

  const status = lastError?.status || lastError?.statusCode;
  const providerMessage = getProviderErrorMessage(lastError);
  const message = getGeminiErrorMessage({ status, providerMessage, model });
  const serviceError = new Error(message);
  serviceError.statusCode = status === 429 ? 429 : status === 504 ? 504 : 502;
  throw serviceError;
};

export const generateAIContent = async ({ type, product }) => {
  const result = await callGeminiWithRetry({ type, product });
  const formatted = formatAIResponse({ type, rawText: result.rawText });

  return {
    type,
    ...formatted,
    model: result.model,
    requestId: result.requestId,
    generatedAt: new Date().toISOString()
  };
};
