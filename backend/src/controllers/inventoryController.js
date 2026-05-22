import {
  getInventoryAlerts,
  getInventoryProducts,
  getInventoryStatistics,
  getInventorySummary,
  getLowStockProducts,
  getOutOfStockProducts,
  getRestockRecommendations,
  updateInventoryQuantity
} from "../inventory/inventoryService.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getInventory = async (req, res, next) => {
  try {
    const data = await getInventoryProducts({
      search: req.query.search,
      status: req.query.status
    });

    ApiResponse.success(res, { message: "Inventory products loaded successfully", data });
  } catch (error) {
    next(error);
  }
};

export const getStatistics = async (req, res, next) => {
  try {
    const data = await getInventoryStatistics();
    ApiResponse.success(res, { message: "Inventory statistics loaded successfully", data });
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const data = await getInventorySummary({
      search: req.query.search,
      status: req.query.status
    });

    ApiResponse.success(res, { message: "Inventory summary loaded successfully", data });
  } catch (error) {
    next(error);
  }
};

export const getLowStock = async (req, res, next) => {
  try {
    const data = await getLowStockProducts();
    ApiResponse.success(res, { message: "Low-stock products loaded successfully", data });
  } catch (error) {
    next(error);
  }
};

export const getOutOfStock = async (req, res, next) => {
  try {
    const data = await getOutOfStockProducts();
    ApiResponse.success(res, { message: "Out-of-stock products loaded successfully", data });
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    const data = await getInventoryAlerts();
    ApiResponse.success(res, { message: "Inventory alerts loaded successfully", data });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const data = await getRestockRecommendations();
    ApiResponse.success(res, { message: "Restock recommendations loaded successfully", data });
  } catch (error) {
    next(error);
  }
};

export const updateQuantity = async (req, res, next) => {
  try {
    const data = await updateInventoryQuantity({
      id: req.params.id,
      stock: req.body.stock
    });

    ApiResponse.success(res, { message: "Inventory quantity updated successfully", data });
  } catch (error) {
    next(error);
  }
};
