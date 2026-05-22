import { validationResult } from "express-validator";

import ApiError from "../utils/ApiError.js";

export const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((error) => ({
    field: error.path || error.param,
    message: error.msg,
    value: error.value
  }));

  return next(new ApiError(400, "Validation failed", errors));
};

export default validateRequest;
