const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Middleware to check validation results from express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors to be cleaner
    const extractedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));
    
    return next(new AppError('Validation Failed', 400, extractedErrors));
  }
  next();
};

module.exports = {
  validate
};
