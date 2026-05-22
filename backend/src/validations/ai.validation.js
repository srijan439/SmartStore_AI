import { body, param } from "express-validator";

import { getSupportedContentTypes } from "../ai/promptTemplates.js";

const tones = ["Professional", "Friendly", "Luxury", "Playful", "Minimal", "Bold"];

export const aiContentValidation = [
  param("type").isIn(getSupportedContentTypes()).withMessage("Unsupported AI content type"),
  body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Product name must be 2 to 120 characters"),
  body("category").trim().isLength({ min: 2, max: 80 }).withMessage("Category must be 2 to 80 characters"),
  body("features")
    .isArray({ min: 1, max: 10 })
    .withMessage("Features must include 1 to 10 items"),
  body("features.*")
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Each feature must be 2 to 120 characters"),
  body("price").optional({ values: "falsy" }).trim().isLength({ max: 40 }).withMessage("Price must be 40 characters or fewer"),
  body("targetAudience").trim().isLength({ min: 2, max: 120 }).withMessage("Target audience must be 2 to 120 characters"),
  body("tone").optional({ values: "falsy" }).isIn(tones).withMessage("Invalid tone")
];
