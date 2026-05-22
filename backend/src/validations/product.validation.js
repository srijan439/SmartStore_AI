import { body, param, query } from "express-validator";

const statuses = ["Active", "Draft", "Archived", "Out of stock"];

export const listProductsValidation = [
  query("search").optional().trim().isLength({ max: 120 }).withMessage("Search must be 120 characters or fewer"),
  query("category").optional().trim().isLength({ max: 80 }).withMessage("Category must be 80 characters or fewer"),
  query("status").optional().isIn(statuses).withMessage("Invalid product status")
];

export const productIdValidation = [
  param("id").isMongoId().withMessage("A valid product id is required")
];

export const createProductValidation = [
  body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Product name must be 2 to 120 characters"),
  body("description").optional({ values: "falsy" }).trim().isLength({ max: 1000 }).withMessage("Description must be 1000 characters or fewer"),
  body("category").trim().isLength({ min: 2, max: 80 }).withMessage("Category must be 2 to 80 characters"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a positive integer"),
  body("image").optional({ values: "falsy" }).trim().isURL().withMessage("Image must be a valid URL"),
  body("status").optional().isIn(statuses).withMessage("Invalid product status")
];

export const updateProductValidation = [
  ...productIdValidation,
  body("name").optional().trim().isLength({ min: 2, max: 120 }).withMessage("Product name must be 2 to 120 characters"),
  body("description").optional({ values: "falsy" }).trim().isLength({ max: 1000 }).withMessage("Description must be 1000 characters or fewer"),
  body("category").optional().trim().isLength({ min: 2, max: 80 }).withMessage("Category must be 2 to 80 characters"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a positive integer"),
  body("image").optional({ values: "falsy" }).trim().isURL().withMessage("Image must be a valid URL"),
  body("status").optional().isIn(statuses).withMessage("Invalid product status")
];
