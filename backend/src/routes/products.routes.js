import { Router } from "express";
import { body, validationResult } from "express-validator";

import { addProduct, getProducts } from "../data/store.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ success: true, data: getProducts() });
});

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("sku").trim().notEmpty().withMessage("SKU is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("stock").isInt({ min: 0 }).withMessage("Stock must be a positive integer")
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const product = addProduct(req.body);
    return res.status(201).json({ success: true, data: product });
  }
);

export default router;
