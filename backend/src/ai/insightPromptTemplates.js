export const businessInsightSchema = {
  type: "object",
  additionalProperties: false,
  required: ["executiveSummary", "recommendations", "riskAlerts", "opportunities", "nextActions"],
  properties: {
    executiveSummary: {
      type: "string"
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "category", "priority", "impact", "action", "reasoning", "relatedProducts"],
        properties: {
          title: { type: "string" },
          category: {
            type: "string",
            enum: ["Pricing", "Sales", "Trend", "Inventory", "Growth", "Product", "Customer", "Revenue", "Marketing"]
          },
          priority: {
            type: "string",
            enum: ["High", "Medium", "Low"]
          },
          impact: { type: "string" },
          action: { type: "string" },
          reasoning: { type: "string" },
          relatedProducts: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    },
    riskAlerts: {
      type: "array",
      items: { type: "string" }
    },
    opportunities: {
      type: "array",
      items: { type: "string" }
    },
    nextActions: {
      type: "array",
      items: { type: "string" }
    }
  }
};

export const buildBusinessInsightPrompt = ({ metrics, recommendations }) => {
  return {
    instructions: [
      "You are SmartStore AI's business intelligence analyst for an ecommerce admin dashboard.",
      "Use only the metrics and recommendation candidates supplied in the input.",
      "Do not invent sales, customer behavior, seasonality, conversion rates, margins, or order data.",
      "When a signal is derived from inventory value, say so plainly instead of calling it confirmed sales.",
      "Keep recommendations concise, operational, and suitable for a SaaS admin dashboard.",
      "Return JSON matching the provided schema only."
    ].join("\n"),
    input: JSON.stringify(
      {
        availableSignals: [
          "product count",
          "category distribution",
          "price",
          "stock",
          "status",
          "inventory value",
          "revenue proxy calculated as price multiplied by stock",
          "existing analytics trend data"
        ],
        metrics,
        recommendationCandidates: recommendations
      },
      null,
      2
    )
  };
};
