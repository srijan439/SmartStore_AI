const contentTypes = {
  description: {
    label: "Product Description",
    maxOutputTokens: 220,
    instruction:
      "Write one concise ecommerce product description in 2 to 4 sentences. Focus only on the supplied details. Do not invent specifications, awards, guarantees, reviews, certifications, or performance claims."
  },
  seoTags: {
    label: "SEO Tags",
    maxOutputTokens: 120,
    instruction:
      "Generate 8 to 12 SEO keyword tags as a single comma-separated line. Use lowercase where natural. Do not add explanations, numbering, hashtags, or unsupported claims."
  },
  caption: {
    label: "Marketing Caption",
    maxOutputTokens: 120,
    instruction:
      "Write one short conversion-oriented marketing caption. Keep it under 24 words. Do not use exaggerated claims, fake urgency, emojis, or unverifiable superlatives."
  },
  highlights: {
    label: "Product Highlights",
    maxOutputTokens: 180,
    instruction:
      "Generate 4 to 6 concise product highlights. Return each highlight on its own line starting with '- '. Keep every point feature-focused and based only on supplied details."
  },
  summary: {
    label: "Product Summary",
    maxOutputTokens: 140,
    instruction:
      "Write a short ecommerce overview in 1 to 2 sentences. Make it suitable for an admin preview or catalog summary. Avoid claims not present in the input."
  }
};

export const getContentTypeConfig = (type) => contentTypes[type];

export const getSupportedContentTypes = () => Object.keys(contentTypes);

export const buildAIPrompt = ({ type, product }) => {
  const config = getContentTypeConfig(type);

  return {
    instructions: [
      "You are SmartStore AI, a careful ecommerce content assistant.",
      "Write professional, concise, SEO-aware, business-friendly product copy.",
      "Use only the product information supplied by the user.",
      "If a field is missing, work around it without inventing missing details.",
      "Avoid medical, legal, safety, environmental, celebrity, certification, warranty, or performance claims unless explicitly provided.",
      "Return only the requested content. Do not include labels or meta commentary."
    ].join("\n"),
    input: [
      `Task: ${config.label}`,
      config.instruction,
      "",
      "Product input:",
      `Name: ${product.name}`,
      `Category: ${product.category}`,
      `Features: ${product.features.join(", ")}`,
      `Price: ${product.price ? product.price : "Not provided"}`,
      `Target audience: ${product.targetAudience}`,
      `Tone: ${product.tone}`
    ].join("\n")
  };
};
