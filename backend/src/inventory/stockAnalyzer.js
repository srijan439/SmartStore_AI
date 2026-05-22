export const LOW_STOCK_LIMIT = 20;
export const RESTOCK_TARGET = 40;

export const getInventoryStatus = (stock) => {
  const quantity = Number(stock || 0);

  if (quantity === 0) {
    return "Out of Stock";
  }

  if (quantity <= LOW_STOCK_LIMIT) {
    return "Low Stock";
  }

  return "In Stock";
};

export const getAvailability = (stock) => {
  const status = getInventoryStatus(stock);

  return {
    status,
    isAvailable: status !== "Out of Stock",
    isCritical: status === "Out of Stock",
    isLowStock: status === "Low Stock"
  };
};

export const enrichInventoryProduct = (product) => {
  const stock = Number(product.stock || 0);
  const inventoryStatus = getInventoryStatus(stock);
  const reorderPoint = LOW_STOCK_LIMIT;
  const targetStock = Math.max(RESTOCK_TARGET, reorderPoint * 2);
  const suggestedRestockUnits = inventoryStatus === "In Stock" ? 0 : Math.max(targetStock - stock, 0);

  return {
    ...product,
    stock,
    inventoryStatus,
    availability: getAvailability(stock),
    reorderPoint,
    targetStock,
    suggestedRestockUnits,
    inventoryValue: Math.round(Number(product.price || 0) * stock)
  };
};

export const summarizeStockStatus = (products) => {
  return products.reduce(
    (summary, product) => {
      const status = getInventoryStatus(product.stock);
      summary.totalProducts += 1;
      summary.totalInventoryCount += Number(product.stock || 0);

      if (status === "In Stock") {
        summary.inStockCount += 1;
      }

      if (status === "Low Stock") {
        summary.lowStockCount += 1;
      }

      if (status === "Out of Stock") {
        summary.outOfStockCount += 1;
      }

      return summary;
    },
    {
      totalProducts: 0,
      totalInventoryCount: 0,
      inStockCount: 0,
      lowStockCount: 0,
      outOfStockCount: 0
    }
  );
};
