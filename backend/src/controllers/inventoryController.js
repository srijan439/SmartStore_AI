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

export const getInventory = async (req, res, next) => {
  try {
    const data = await getInventoryProducts({
      search: req.query.search,
      status: req.query.status
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getStatistics = async (req, res, next) => {
  try {
    const data = await getInventoryStatistics();
    res.json({ success: true, data });
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

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getLowStock = async (req, res, next) => {
  try {
    const data = await getLowStockProducts();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getOutOfStock = async (req, res, next) => {
  try {
    const data = await getOutOfStockProducts();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    const data = await getInventoryAlerts();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const data = await getRestockRecommendations();
    res.json({ success: true, data });
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

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
