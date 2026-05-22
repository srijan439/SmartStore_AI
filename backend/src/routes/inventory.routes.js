import { Router } from "express";
import mongoose from "mongoose";

import { getInventory } from "../data/store.js";
import Product from "../models/Product.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: getInventory() });
    }

    const products = await Product.find().sort({ stock: 1, createdAt: -1 });
    const inventory = products.map((product) => {
      const item = product.toClientJSON();
      const reorderPoint = Math.max(Math.ceil(item.stock * 0.35), 10);

      return {
        ...item,
        reorderPoint,
        restockUnits: Math.max(reorderPoint * 2 - item.stock, 0),
        status: item.stock === 0 ? "Out of stock" : item.status
      };
    });

    return res.json({ success: true, data: inventory });
  } catch (error) {
    return next(error);
  }
});

export default router;
