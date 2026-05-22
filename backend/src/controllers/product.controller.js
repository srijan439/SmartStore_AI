import mongoose from "mongoose";

import Product from "../models/Product.js";

const ensureDatabaseReady = () => {
  if (mongoose.connection.readyState !== 1) {
    const error = new Error("Database connection is required for product management");
    error.statusCode = 503;
    throw error;
  }
};

const buildProductFilter = ({ search, category, status }) => {
  const filter = {};

  if (search) {
    const pattern = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: pattern }, { description: pattern }, { category: pattern }];
  }

  if (category) {
    filter.category = category.trim();
  }

  if (status) {
    filter.status = status;
  }

  return filter;
};

export const listProducts = async (req, res, next) => {
  try {
    ensureDatabaseReady();

    const filter = buildProductFilter(req.query);
    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, data: products.map((product) => product.toClientJSON()) });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    ensureDatabaseReady();

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product.toClientJSON() });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    ensureDatabaseReady();

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, data: product.toClientJSON() });
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    ensureDatabaseReady();

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    return next(error);
  }
};
