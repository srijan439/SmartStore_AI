import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";

const getStatusCode = (error) => {
  if (error instanceof ApiError) {
    return error.statusCode;
  }

  if (error.name === "CastError") {
    return 400;
  }

  if (error.name === "ValidationError") {
    return 400;
  }

  if (error.code === 11000) {
    return 409;
  }

  return error.statusCode || error.status || 500;
};

const getMessage = (error, statusCode) => {
  if (process.env.NODE_ENV === "production" && statusCode >= 500) {
    return "Internal server error";
  }

  if (error.name === "CastError") {
    return "Invalid resource identifier";
  }

  if (error.name === "ValidationError") {
    return "Database validation failed";
  }

  if (error.code === 11000) {
    return "Duplicate resource";
  }

  return error.message || "Internal server error";
};

const getErrors = (error, statusCode) => {
  if (error instanceof ApiError) {
    return error.errors || [];
  }

  if (error.name === "ValidationError") {
    return Object.values(error.errors || {}).map((item) => ({
      field: item.path,
      message: item.message
    }));
  }

  if (statusCode >= 500) {
    return [];
  }

  return error.errors || [];
};

export const errorMiddleware = (error, req, res, next) => {
  const statusCode = getStatusCode(error);
  const message = getMessage(error, statusCode);
  const errors = getErrors(error, statusCode);

  logger.error(`${req.method} ${req.originalUrl} ${statusCode}: ${message}`);

  if (process.env.NODE_ENV !== "production" && statusCode >= 500 && error.stack) {
    logger.error(error.stack);
  }

  return ApiResponse.error(res, {
    statusCode,
    message,
    errors
  });
};

export default errorMiddleware;
