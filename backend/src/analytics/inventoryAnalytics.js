import Product from "../models/Product.js";

export const getInventoryInsights = async () => {
  const [summary = {}] = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalStock: { $sum: "$stock" },
        outOfStock: {
          $sum: {
            $cond: [{ $eq: ["$stock", 0] }, 1, 0]
          }
        },
        lowStock: {
          $sum: {
            $cond: [{ $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", 10] }] }, 1, 0]
          }
        },
        healthyStock: {
          $sum: {
            $cond: [{ $gt: ["$stock", 10] }, 1, 0]
          }
        },
        inventoryValue: { $sum: { $multiply: ["$price", "$stock"] } }
      }
    }
  ]);

  const statusDistribution = await Product.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        stock: { $sum: "$stock" }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return {
    totalStock: summary.totalStock || 0,
    outOfStock: summary.outOfStock || 0,
    lowStock: summary.lowStock || 0,
    healthyStock: summary.healthyStock || 0,
    inventoryValue: Math.round(summary.inventoryValue || 0),
    statusDistribution: statusDistribution.map((item) => ({
      status: item._id || "Unknown",
      count: item.count,
      stock: item.stock
    }))
  };
};
