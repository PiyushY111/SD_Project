const { query } = require('express-validator');

exports.monthlyReportValidator = [
  query('month')
    .notEmpty().withMessage('month is required')
    .isInt({ min: 1, max: 12 }).withMessage('month must be an integer between 1 and 12')
    .toInt(),
  query('year')
    .notEmpty().withMessage('year is required')
    .isInt({ min: 1900, max: 2100 }).withMessage('year must be a valid year integer')
    .toInt(),
];

exports.categoryReportValidator = [
  query('startDate')
    .optional()
    .isISO8601().withMessage('startDate must be a valid date')
    .toDate(),
  query('endDate')
    .optional()
    .isISO8601().withMessage('endDate must be a valid date')
    .toDate(),
];
