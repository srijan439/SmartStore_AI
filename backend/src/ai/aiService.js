import { getOpenAIClient, getOpenAIModel } from "./openaiClient.js";
import { buildAIPrompt, getContentTypeConfig } from "./promptTemplates.js";
import { formatAIResponse } from "./responseFormatter.js";

const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const isRetryableError = (error) => {
  const status = error.status || error.statusCode;
  return !status || status === 408 || status === 409 || status === 429 || status >= 500;
};

const callOpenAIWithRetry = async ({ type, product, attempts = 2 }) => {
  const client = getOpenAIClient();
  const model = getOpenAIModel();
  const config = getContentTypeConfig(type);
  const prompt = buildAIPrompt({ type, product });
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await client.responses.create({
        model,
        instructions: prompt.instructions,
        input: prompt.input,
        max_output_tokens: config.maxOutputTokens
      });

      return {
        model,
        rawText: response.output_text,
        requestId: response._request_id
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
  const message = status === 401 || status === 403
    ? "OpenAI API key is invalid or unauthorized"
    : status === 429
      ? "OpenAI rate limit reached. Try again shortly"
      : "AI content generation failed";
  const serviceError = new Error(message);
  serviceError.statusCode = status === 429 ? 429 : 502;
  throw serviceError;
};

export const generateAIContent = async ({ type, product }) => {
  const result = await callOpenAIWithRetry({ type, product });
  const formatted = formatAIResponse({ type, rawText: result.rawText });

  return {
    type,
    ...formatted,
    model: result.model,
    requestId: result.requestId || null,
    generatedAt: new Date().toISOString()
  };
};
