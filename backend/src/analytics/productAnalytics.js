import Product from "../models/Product.js";

export const getProductPerformance = async () => {
  const products = await Product.aggregate([
    {
      $project: {
        name: 1,
        category: 1,
        status: 1,
        stock: 1,
        price: 1,
        revenue: { $multiply: ["$price", "$stock"] }
      }
    },
    { $sort: { revenue: -1, stock: -1 } },
    { $limit: 8 }
  ]);

  return products.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    category: product.category,
    status: product.status,
    stock: product.stock,
    price: product.price,
    revenue: Math.round(product.revenue || 0)
  }));
};

export const getTopProducts = async () => {
  const products = await getProductPerformance();
  return products.slice(0, 5);
};

export const getCategoryDistribution = async () => {
  const categories = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        products: { $sum: 1 },
        inventoryUnits: { $sum: "$stock" },
        revenue: { $sum: { $multiply: ["$price", "$stock"] } }
      }
    },
    { $sort: { revenue: -1 } }
  ]);

  return categories.map((category) => ({
    category: category._id || "Uncategorized",
    products: category.products,
    inventoryUnits: category.inventoryUnits,
    revenue: Math.round(category.revenue || 0)
  }));
};
