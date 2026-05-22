import { generateAIContent } from "../ai/aiService.js";

const sanitizeProductInput = (body) => {
  return {
    name: String(body.name).trim(),
    category: String(body.category).trim(),
    features: body.features.map((feature) => String(feature).trim()).filter(Boolean),
    price: body.price ? String(body.price).trim() : "",
    targetAudience: String(body.targetAudience).trim(),
    tone: body.tone || "Professional"
  };
};

export const generateContent = async (req, res, next) => {
  try {
    const data = await generateAIContent({
      type: req.params.type,
      product: sanitizeProductInput(req.body)
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
