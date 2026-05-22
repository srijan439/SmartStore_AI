import { generateBusinessInsights } from "../ai/businessInsightsService.js";

export const getBusinessRecommendations = async ({ forceAI = false } = {}) => {
  return generateBusinessInsights({ forceAI });
};
