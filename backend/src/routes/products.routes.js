import { Router } from "express";

import { createProduct, deleteProduct, listProducts, updateProduct } from "../controllers/product.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  createProductValidation,
  listProductsValidation,
  productIdValidation,
  updateProductValidation
} from "../validations/product.validation.js";

const router = Router();

router.get("/", listProductsValidation, validateRequest, listProducts);

router.post("/", createProductValidation, validateRequest, createProduct);
router.put("/:id", updateProductValidation, validateRequest, updateProduct);
router.delete("/:id", productIdValidation, validateRequest, deleteProduct);

export default router;
