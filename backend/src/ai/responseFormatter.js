const normalizeLines = (value) => {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

export const formatAIResponse = ({ type, rawText }) => {
  const content = String(rawText || "").trim();

  if (!content) {
    const error = new Error("AI returned an empty response");
    error.statusCode = 502;
    throw error;
  }

  if (type === "seoTags") {
    const tags = content
      .replace(/^seo tags:\s*/i, "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 12);

    return {
      content: tags.join(", "),
      tags
    };
  }

  if (type === "highlights") {
    const highlights = normalizeLines(content)
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 6);

    return {
      content: highlights.map((highlight) => `- ${highlight}`).join("\n"),
      highlights
    };
  }

  return { content };
};
