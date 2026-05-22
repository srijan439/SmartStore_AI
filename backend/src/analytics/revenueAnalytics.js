import Product from "../models/Product.js";

export const getRevenueStatistics = async () => {
  const [summary = {}] = await Product.aggregate([
    {
      $group: {
        _id: null,
        revenue: { $sum: { $multiply: ["$price", "$stock"] } },
        productCount: { $sum: 1 },
        inventoryUnits: { $sum: "$stock" },
        averagePrice: { $avg: "$price" },
        activeProducts: {
          $sum: {
            $cond: [{ $eq: ["$status", "Active"] }, 1, 0]
          }
        },
        lowStockCount: {
          $sum: {
            $cond: [{ $lte: ["$stock", 10] }, 1, 0]
          }
        }
      }
    }
  ]);

  const revenue = Math.round(summary.revenue || 0);
  const productCount = summary.productCount || 0;
  const inventoryUnits = summary.inventoryUnits || 0;

  return {
    revenue,
    productCount,
    inventoryUnits,
    activeProducts: summary.activeProducts || 0,
    lowStockCount: summary.lowStockCount || 0,
    averagePrice: Math.round(summary.averagePrice || 0),
    averageInventoryValue: productCount > 0 ? Math.round(revenue / productCount) : 0
  };
};

export const getRevenueTrend = async () => {
  const trend = await Product.aggregate([
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

  return trend.map((point) => {
    const date = new Date(Date.UTC(point._id.year, point._id.month - 1, 1));

    return {
      month: date.toLocaleString("en-US", { month: "short" }),
      revenue: Math.round(point.revenue || 0),
      products: point.products,
      inventoryUnits: point.inventoryUnits
    };
  });
};
