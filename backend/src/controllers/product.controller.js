import mongoose from "mongoose";

import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const ensureDatabaseReady = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new ApiError(503, "Database connection is required for product management");
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

    ApiResponse.success(res, {
      message: "Products loaded successfully",
      data: products.map((product) => product.toClientJSON())
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    ensureDatabaseReady();

    const product = await Product.create(req.body);
    ApiResponse.success(res, {
      statusCode: 201,
      message: "Product created successfully",
      data: product.toClientJSON()
    });
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
      throw new ApiError(404, "Product not found");
    }

    return ApiResponse.success(res, {
      message: "Product updated successfully",
      data: product.toClientJSON()
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    ensureDatabaseReady();

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return ApiResponse.success(res, {
      message: "Product deleted successfully",
      data: { id: req.params.id }
    });
  } catch (error) {
    return next(error);
  }
};
