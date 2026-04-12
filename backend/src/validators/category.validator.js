const { body, query } = require('express-validator');

exports.createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 50 }).withMessage('Category name must be less than 50 characters'),
];
