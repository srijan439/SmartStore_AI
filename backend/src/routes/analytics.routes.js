import { Router } from "express";
import mongoose from "mongoose";

import { getAnalytics } from "../data/store.js";
import Product from "../models/Product.js";

const router = Router();

const salesTrend = [
  { month: "Jan", revenue: 31200, orders: 412 },
  { month: "Feb", revenue: 35600, orders: 448 },
  { month: "Mar", revenue: 39100, orders: 493 },
  { month: "Apr", revenue: 42800, orders: 531 },
  { month: "May", revenue: 48200, orders: 588 },
  { month: "Jun", revenue: 51700, orders: 624 }
];

router.get("/", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: getAnalytics() });
    }

    const products = await Product.find().sort({ createdAt: -1 });
    const revenue = products.reduce((total, product) => total + product.price * product.stock, 0);
    const lowStockCount = products.filter((product) => product.stock <= Math.max(Math.ceil(product.stock * 0.35), 10)).length;
    const orders = Math.max(products.length * 12, 1);
    const topProducts = products
      .map((product) => ({
        ...product.toClientJSON(),
        sales: Math.max(Math.round(product.price * Math.max(product.stock, 1)), 1)
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4);

    return res.json({
      success: true,
      data: {
        summary: {
          revenue,
          orders,
          averageOrderValue: Math.round(revenue / orders),
          products: products.length,
          lowStockCount
        },
        salesTrend,
        topProducts
      }
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
