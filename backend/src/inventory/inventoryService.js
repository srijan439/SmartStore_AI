import mongoose from "mongoose";

import { getInventory as getFallbackInventory } from "../data/store.js";
import Product from "../models/Product.js";
import { generateInventoryAlerts } from "./alertGenerator.js";
import { buildRestockRecommendations } from "./restockEngine.js";
import { enrichInventoryProduct, summarizeStockStatus } from "./stockAnalyzer.js";

const round = (value) => Math.round(Number(value || 0));

const toClientProduct = (product) => {
  if (product.toClientJSON) {
    return product.toClientJSON();
  }

  return {
    id: product._id?.toString?.() || product.id,
    name: product.name,
    description: product.description || "",
    category: product.category || "Uncategorized",
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    image: product.image || "",
    status: product.status || "Active",
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
};

const getFallbackProducts = () => {
  return getFallbackInventory().map((product) =>
    enrichInventoryProduct({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status
    })
  );
};

const requireDatabase = () => {
  if (mongoose.connection.readyState !== 1) {
    const error = new Error("Database connection is required to update inventory");
    error.statusCode = 503;
    throw error;
  }
};

export const getInventoryProducts = async ({ search = "", status = "all" } = {}) => {
  if (mongoose.connection.readyState !== 1) {
    const fallback = getFallbackProducts();
    return filterInventoryProducts(fallback, { search, status });
  }

  const products = await Product.find().sort({ stock: 1, updatedAt: -1 });
  const enriched = products.map((product) => enrichInventoryProduct(toClientProduct(product)));

  return filterInventoryProducts(enriched, { search, status });
};

export const filterInventoryProducts = (products, { search = "", status = "all" } = {}) => {
  const normalizedSearch = String(search || "").trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.category.toLowerCase().includes(normalizedSearch);
    const matchesStatus = status === "all" || product.inventoryStatus === status;

    return matchesSearch && matchesStatus;
  });
};

export const getInventoryStatistics = async () => {
  if (mongoose.connection.readyState !== 1) {
    const products = getFallbackProducts();
    const summary = summarizeStockStatus(products);

    return {
      ...summary,
      inventoryValue: products.reduce((sum, product) => sum + product.inventoryValue, 0),
      averageStock: summary.totalProducts > 0 ? Math.round(summary.totalInventoryCount / summary.totalProducts) : 0,
      mostStockedProducts: [...products].sort((a, b) => b.stock - a.stock).slice(0, 5),
      leastStockedProducts: [...products].sort((a, b) => a.stock - b.stock).slice(0, 5),
      categoryStats: [],
      stockTrend: [],
      meta: { source: "fallback" }
    };
  }

  const [summary = {}] = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalInventoryCount: { $sum: "$stock" },
        inventoryValue: { $sum: { $multiply: ["$price", "$stock"] } },
        averageStock: { $avg: "$stock" },
        inStockCount: { $sum: { $cond: [{ $gt: ["$stock", 20] }, 1, 0] } },
        lowStockCount: { $sum: { $cond: [{ $and: [{ $gte: ["$stock", 1] }, { $lte: ["$stock", 20] }] }, 1, 0] } },
        outOfStockCount: { $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] } }
      }
    }
  ]);

  const [mostStockedProducts, leastStockedProducts, categoryStats, stockTrend] = await Promise.all([
    Product.find().sort({ stock: -1, updatedAt: -1 }).limit(5),
    Product.find().sort({ stock: 1, updatedAt: -1 }).limit(5),
    Product.aggregate([
      {
        $group: {
          _id: "$category",
          products: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          inventoryValue: { $sum: { $multiply: ["$price", "$stock"] } },
          lowStockCount: { $sum: { $cond: [{ $and: [{ $gte: ["$stock", 1] }, { $lte: ["$stock", 20] }] }, 1, 0] } },
          outOfStockCount: { $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] } }
        }
      },
      { $sort: { totalStock: -1 } }
    ]),
    Product.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" }
          },
          totalStock: { $sum: "$stock" },
          products: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 }
    ])
  ]);

  return {
    totalProducts: summary.totalProducts || 0,
    totalInventoryCount: round(summary.totalInventoryCount),
    inventoryValue: round(summary.inventoryValue),
    averageStock: round(summary.averageStock),
    inStockCount: summary.inStockCount || 0,
    lowStockCount: summary.lowStockCount || 0,
    outOfStockCount: summary.outOfStockCount || 0,
    mostStockedProducts: mostStockedProducts.map((product) => enrichInventoryProduct(toClientProduct(product))),
    leastStockedProducts: leastStockedProducts.map((product) => enrichInventoryProduct(toClientProduct(product))),
    categoryStats: categoryStats.map((category) => ({
      category: category._id || "Uncategorized",
      products: category.products,
      totalStock: round(category.totalStock),
      inventoryValue: round(category.inventoryValue),
      lowStockCount: category.lowStockCount,
      outOfStockCount: category.outOfStockCount
    })),
    stockTrend: stockTrend.map((point) => {
      const date = new Date(Date.UTC(point._id.year, point._id.month - 1, 1));

      return {
        month: date.toLocaleString("en-US", { month: "short" }),
        totalStock: round(point.totalStock),
        products: point.products
      };
    }),
    meta: {
      source: "mongodb",
      generatedAt: new Date().toISOString()
    }
  };
};

export const getInventoryAlerts = async () => {
  const products = await getInventoryProducts();
  return generateInventoryAlerts(products);
};

export const getRestockRecommendations = async () => {
  const products = await getInventoryProducts();
  return buildRestockRecommendations(products);
};

export const getLowStockProducts = async () => {
  const products = await getInventoryProducts();
  return products.filter((product) => product.inventoryStatus === "Low Stock");
};

export const getOutOfStockProducts = async () => {
  const products = await getInventoryProducts();
  return products.filter((product) => product.inventoryStatus === "Out of Stock");
};

export const getInventorySummary = async ({ search = "", status = "all" } = {}) => {
  const [statistics, products, alerts, recommendations] = await Promise.all([
    getInventoryStatistics(),
    getInventoryProducts({ search, status }),
    getInventoryAlerts(),
    getRestockRecommendations()
  ]);

  return {
    statistics,
    products,
    alerts,
    recommendations
  };
};

export const updateInventoryQuantity = async ({ id, stock }) => {
  requireDatabase();

  const nextStock = Number(stock);
  const product = await Product.findById(id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  product.stock = nextStock;

  if (nextStock === 0) {
    product.status = "Out of stock";
  } else if (product.status === "Out of stock") {
    product.status = "Active";
  }

  await product.save();

  return enrichInventoryProduct(product.toClientJSON());
};
