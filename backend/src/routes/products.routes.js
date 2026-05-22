import { Router } from "express";

import { createProduct, deleteProduct, listProducts, updateProduct } from "../controllers/product.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  createProductValidation,
  listProductsValidation,
  productIdValidation,
  updateProductValidation
} from "../validations/product.validation.js";

const router = Router();

router.get("/", listProductsValidation, validateRequest, asyncHandler(listProducts));

router.post("/", createProductValidation, validateRequest, asyncHandler(createProduct));
router.put("/:id", updateProductValidation, validateRequest, asyncHandler(updateProduct));
router.delete("/:id", productIdValidation, validateRequest, asyncHandler(deleteProduct));

export default router;
