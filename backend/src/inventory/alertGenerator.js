import { buildRestockRecommendations } from "./restockEngine.js";
import { getInventoryStatus } from "./stockAnalyzer.js";

const getSeverity = (stock) => {
  if (stock === 0) {
    return "Critical";
  }

  if (stock <= 5) {
    return "High";
  }

  if (stock <= 20) {
    return "Medium";
  }

  return "Low";
};

export const generateInventoryAlerts = (products) => {
  const alerts = products
    .filter((product) => Number(product.stock || 0) <= 20)
    .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
    .map((product) => {
      const stock = Number(product.stock || 0);
      const status = getInventoryStatus(stock);

      return {
        id: `inventory-${product.id}-${stock}`,
        productId: product.id,
        productName: product.name,
        category: product.category,
        severity: getSeverity(stock),
        status,
        stock,
        title: status === "Out of Stock" ? "Out-of-stock product" : "Low-stock product",
        message:
          status === "Out of Stock"
            ? `${product.name} is unavailable and needs immediate restock review.`
            : `${product.name} has ${stock} units left and is below the stock threshold.`,
        createdAt: new Date().toISOString()
      };
    });

  const recommendations = buildRestockRecommendations(products);

  return alerts.map((alert) => {
    const recommendation = recommendations.find((item) => item.productId === alert.productId);

    return {
      ...alert,
      suggestedUnits: recommendation?.suggestedUnits || 0
    };
  });
};
