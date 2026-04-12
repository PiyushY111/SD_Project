const sendSuccess = (res, statusCode, message, data = null) => {
  const response = { success: true, message };
  if (data !== null && data !== undefined) response.data = data;
  res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message, details = null) => {
  const errorObj = { message };
  if (details !== null && details !== undefined && Object.keys(details).length > 0) {
    errorObj.details = details;
  }
  res.status(statusCode).json({ success: false, error: errorObj });
};

module.exports = { sendSuccess, sendError };
