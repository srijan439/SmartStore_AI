import { LOW_STOCK_LIMIT, RESTOCK_TARGET, enrichInventoryProduct } from "./stockAnalyzer.js";

const getPriority = (stock) => {
  if (stock === 0) {
    return "Critical";
  }

  if (stock <= 5) {
    return "High";
  }

  return "Medium";
};

export const buildRestockRecommendations = (products) => {
  return products
    .map(enrichInventoryProduct)
    .filter((product) => product.stock <= LOW_STOCK_LIMIT)
    .sort((a, b) => a.stock - b.stock || b.inventoryValue - a.inventoryValue)
    .map((product) => ({
      productId: product.id,
      name: product.name,
      category: product.category,
      currentStock: product.stock,
      priority: getPriority(product.stock),
      reorderPoint: LOW_STOCK_LIMIT,
      targetStock: RESTOCK_TARGET,
      suggestedUnits: Math.max(RESTOCK_TARGET - product.stock, 0),
      reason:
        product.stock === 0
          ? "Product is unavailable and should be replenished before promotion."
          : "Product is below the low-stock threshold and needs replenishment planning."
    }));
};
