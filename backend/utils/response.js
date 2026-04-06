/**
 * Formats a successful API response.
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object|Array} data - Payload data
 */
const sendSuccess = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };
  
  if (data !== null && data !== undefined) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

/**
 * Formats an error API response.
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Array|Object} details - Additional error details (like validation errors)
 */
const sendError = (res, statusCode, message, details = null) => {
  const errorObj = {
    message,
  };

  if (details !== null && details !== undefined && Object.keys(details).length > 0) {
    errorObj.details = details;
  }

  res.status(statusCode).json({
    success: false,
    error: errorObj,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
