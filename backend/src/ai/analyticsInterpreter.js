import Product from "../models/Product.js";

const round = (value) => Math.round(Number(value || 0));

const emptyMetrics = {
  summary: {
    totalProducts: 0,
    activeProducts: 0,
    draftProducts: 0,
    archivedProducts: 0,
    outOfStockProducts: 0,
    totalStock: 0,
    inventoryValue: 0,
    averagePrice: 0,
    averageInventoryValue: 0
  },
  products: [],
  pricing: {
    categoryAverages: [],
    outliers: []
  },
  inventory: {
    lowStockProducts: [],
    outOfStockProducts: [],
    overstockedProducts: [],
    stockHealth: []
  },
  productPerformance: {
    highPerforming: [],
    underperforming: []
  },
  categoryPerformance: [],
  revenueTrend: [],
  meta: {
    source: "database-offline",
    message: "Connect MongoDB to generate live business intelligence."
  }
};

const mapProduct = (product) => ({
  id: product._id.toString(),
  name: product.name,
  category: product.category || "Uncategorized",
  status: product.status,
  price: round(product.price),
  stock: round(product.stock),
  inventoryValue: round(product.inventoryValue)
});

export const getBusinessMetrics = async () => {
  const [summary = {}] = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        activeProducts: { $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] } },
        draftProducts: { $sum: { $cond: [{ $eq: ["$status", "Draft"] }, 1, 0] } },
        archivedProducts: { $sum: { $cond: [{ $eq: ["$status", "Archived"] }, 1, 0] } },
        outOfStockProducts: { $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] } },
        totalStock: { $sum: "$stock" },
        inventoryValue: { $sum: { $multiply: ["$price", "$stock"] } },
        averagePrice: { $avg: "$price" },
        averageStock: { $avg: "$stock" }
      }
    }
  ]);

  const categoryPerformance = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        products: { $sum: 1 },
        activeProducts: { $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] } },
        inventoryUnits: { $sum: "$stock" },
        averagePrice: { $avg: "$price" },
        revenue: { $sum: { $multiply: ["$price", "$stock"] } }
      }
    },
    { $sort: { revenue: -1, inventoryUnits: -1 } }
  ]);

  const categoryAverages = categoryPerformance.map((category) => ({
    category: category._id || "Uncategorized",
    products: category.products,
    activeProducts: category.activeProducts,
    inventoryUnits: round(category.inventoryUnits),
    averagePrice: round(category.averagePrice),
    revenue: round(category.revenue)
  }));

  const products = await Product.aggregate([
    {
      $project: {
        name: 1,
        category: 1,
        status: 1,
        price: 1,
        stock: 1,
        inventoryValue: { $multiply: ["$price", "$stock"] }
      }
    },
    { $sort: { inventoryValue: -1, stock: -1 } },
    { $limit: 80 }
  ]);

  const mappedProducts = products.map(mapProduct);
  const averageInventoryValue = summary.totalProducts > 0 ? round(summary.inventoryValue / summary.totalProducts) : 0;
  const averageStock = round(summary.averageStock);
  const highPerforming = mappedProducts
    .filter((product) => product.status === "Active" && product.stock > 0)
    .slice(0, 6);
  const underperforming = mappedProducts
    .filter((product) => product.status !== "Active" || product.stock === 0 || product.inventoryValue < averageInventoryValue * 0.35)
    .slice(0, 8);
  const lowStockProducts = mappedProducts
    .filter((product) => product.stock > 0 && product.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 8);
  const outOfStockProducts = mappedProducts
    .filter((product) => product.stock === 0)
    .slice(0, 8);
  const overstockedProducts = mappedProducts
    .filter((product) => averageStock > 0 && product.stock >= Math.max(averageStock * 1.8, 25))
    .slice(0, 8);
  const categoryAverageMap = new Map(categoryAverages.map((category) => [category.category, category.averagePrice]));
  const pricingOutliers = mappedProducts
    .map((product) => {
      const categoryAverage = categoryAverageMap.get(product.category) || 0;
      const variance = categoryAverage > 0 ? (product.price - categoryAverage) / categoryAverage : 0;
      return {
        ...product,
        categoryAverage,
        variancePercent: Math.round(variance * 100),
        suggestion:
          variance > 0.25
            ? "Validate premium positioning or test a lower price point."
            : "Validate whether this product can support a higher price."
      };
    })
    .filter((product) => Math.abs(product.variancePercent) >= 25)
    .slice(0, 8);
  const revenueTrend = await Product.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        revenue: { $sum: { $multiply: ["$price", "$stock"] } },
        products: { $sum: 1 },
        inventoryUnits: { $sum: "$stock" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    { $limit: 12 }
  ]);

  return {
    summary: {
      totalProducts: summary.totalProducts || 0,
      activeProducts: summary.activeProducts || 0,
      draftProducts: summary.draftProducts || 0,
      archivedProducts: summary.archivedProducts || 0,
      outOfStockProducts: summary.outOfStockProducts || 0,
      totalStock: round(summary.totalStock),
      inventoryValue: round(summary.inventoryValue),
      averagePrice: round(summary.averagePrice),
      averageInventoryValue
    },
    products: mappedProducts.slice(0, 20),
    pricing: {
      categoryAverages,
      outliers: pricingOutliers
    },
    inventory: {
      lowStockProducts,
      outOfStockProducts,
      overstockedProducts,
      stockHealth: [
        { label: "Out of stock", value: outOfStockProducts.length },
        { label: "Low stock", value: lowStockProducts.length },
        { label: "Overstocked", value: overstockedProducts.length }
      ]
    },
    productPerformance: {
      highPerforming,
      underperforming
    },
    categoryPerformance: categoryAverages,
    revenueTrend: revenueTrend.map((point) => {
      const date = new Date(Date.UTC(point._id.year, point._id.month - 1, 1));

      return {
        month: date.toLocaleString("en-US", { month: "short" }),
        revenue: round(point.revenue),
        products: point.products,
        inventoryUnits: round(point.inventoryUnits)
      };
    }),
    meta: {
      source: "mongodb",
      generatedAt: new Date().toISOString(),
      note: "Revenue is an inventory-value proxy calculated from product price and stock."
    }
  };
};

export const getEmptyBusinessMetrics = () => emptyMetrics;
