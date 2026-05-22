class ApiResponse {
  static success(res, { statusCode = 200, message = "Request completed successfully", data = null } = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, { statusCode = 500, message = "Internal server error", errors = [] } = {}) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }
}

export default ApiResponse;
