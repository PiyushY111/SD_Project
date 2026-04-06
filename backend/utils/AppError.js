class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // Identify known application errors

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
