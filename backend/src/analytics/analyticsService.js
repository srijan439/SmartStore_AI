import mongoose from "mongoose";

import { getInventoryInsights } from "./inventoryAnalytics.js";
import { getCategoryDistribution, getProductPerformance, getTopProducts } from "./productAnalytics.js";
import { getRevenueStatistics, getRevenueTrend } from "./revenueAnalytics.js";

const emptyAnalytics = {
  summary: {
    revenue: 0,
    orders: 0,
    averageOrderValue: 0,
    products: 0,
    lowStockCount: 0,
    inventoryUnits: 0,
    activeProducts: 0,
    averagePrice: 0
  },
  revenueTrend: [],
  salesTrend: [],
  productPerformance: [],
  categoryDistribution: [],
  inventory: {
    totalStock: 0,
    outOfStock: 0,
    lowStock: 0,
    healthyStock: 0,
    inventoryValue: 0,
    statusDistribution: []
  },
  topProducts: [],
  meta: {
    source: "database-offline",
    message: "Connect MongoDB to populate live analytics."
  }
};

export const getDashboardAnalytics = async () => {
  if (mongoose.connection.readyState !== 1) {
    return emptyAnalytics;
  }

  const [revenue, revenueTrend, productPerformance, categoryDistribution, inventory, topProducts] = await Promise.all([
    getRevenueStatistics(),
    getRevenueTrend(),
    getProductPerformance(),
    getCategoryDistribution(),
    getInventoryInsights(),
    getTopProducts()
  ]);

  const orders = Math.max(revenue.productCount * 12, 0);

  return {
    summary: {
      revenue: revenue.revenue,
      orders,
      averageOrderValue: orders > 0 ? Math.round(revenue.revenue / orders) : 0,
      products: revenue.productCount,
      lowStockCount: revenue.lowStockCount,
      inventoryUnits: revenue.inventoryUnits,
      activeProducts: revenue.activeProducts,
      averagePrice: revenue.averagePrice,
      averageInventoryValue: revenue.averageInventoryValue
    },
    revenueTrend,
    salesTrend: revenueTrend,
    productPerformance,
    categoryDistribution,
    inventory,
    topProducts,
    meta: {
      source: "mongodb",
      generatedAt: new Date().toISOString()
    }
  };
};
