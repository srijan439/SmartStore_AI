import { getBusinessRecommendations } from "../services/recommendationService.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAIInsights = async (req, res, next) => {
  try {
    const forceAI = req.query.forceAI === "true";
    const data = await getBusinessRecommendations({ forceAI });

    ApiResponse.success(res, {
      message: "AI business insights loaded successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
