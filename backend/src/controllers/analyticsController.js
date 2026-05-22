import { getDashboardAnalytics } from "../analytics/analyticsService.js";
import { getInventoryInsights } from "../analytics/inventoryAnalytics.js";
import { getProductPerformance, getTopProducts } from "../analytics/productAnalytics.js";
import { getRevenueStatistics, getRevenueTrend } from "../analytics/revenueAnalytics.js";

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const analytics = await getDashboardAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
};

export const getRevenueMetrics = async (req, res, next) => {
  try {
    const [statistics, trend] = await Promise.all([getRevenueStatistics(), getRevenueTrend()]);
    res.json({ success: true, data: { statistics, trend } });
  } catch (error) {
    next(error);
  }
};

export const getProductMetrics = async (req, res, next) => {
  try {
    const [performance, topProducts] = await Promise.all([getProductPerformance(), getTopProducts()]);
    res.json({ success: true, data: { performance, topProducts } });
  } catch (error) {
    next(error);
  }
};

export const getInventoryMetrics = async (req, res, next) => {
  try {
    const inventory = await getInventoryInsights();
    res.json({ success: true, data: inventory });
  } catch (error) {
    next(error);
  }
};
