import { getDashboardAnalytics } from "../analytics/analyticsService.js";
import { getInventoryInsights } from "../analytics/inventoryAnalytics.js";
import { getProductPerformance, getTopProducts } from "../analytics/productAnalytics.js";
import { getRevenueStatistics, getRevenueTrend } from "../analytics/revenueAnalytics.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const analytics = await getDashboardAnalytics();
    ApiResponse.success(res, { message: "Dashboard analytics loaded successfully", data: analytics });
  } catch (error) {
    next(error);
  }
};

export const getRevenueMetrics = async (req, res, next) => {
  try {
    const [statistics, trend] = await Promise.all([getRevenueStatistics(), getRevenueTrend()]);
    ApiResponse.success(res, { message: "Revenue analytics loaded successfully", data: { statistics, trend } });
  } catch (error) {
    next(error);
  }
};

export const getProductMetrics = async (req, res, next) => {
  try {
    const [performance, topProducts] = await Promise.all([getProductPerformance(), getTopProducts()]);
    ApiResponse.success(res, { message: "Product analytics loaded successfully", data: { performance, topProducts } });
  } catch (error) {
    next(error);
  }
};

export const getInventoryMetrics = async (req, res, next) => {
  try {
    const inventory = await getInventoryInsights();
    ApiResponse.success(res, { message: "Inventory analytics loaded successfully", data: inventory });
  } catch (error) {
    next(error);
  }
};
