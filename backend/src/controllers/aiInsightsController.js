import { getBusinessRecommendations } from "../services/recommendationService.js";

export const getAIInsights = async (req, res, next) => {
  try {
    const forceAI = req.query.forceAI === "true";
    const data = await getBusinessRecommendations({ forceAI });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
