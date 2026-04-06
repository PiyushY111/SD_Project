const { body, query } = require('express-validator');
const { TRANSACTION_TYPES } = require('../models/transaction.model');

exports.createTransactionValidator = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(Object.values(TRANSACTION_TYPES)).withMessage('Invalid transaction type. Must be INCOME or EXPENSE'),
  body('categoryId')
    .notEmpty().withMessage('categoryId is required')
    .isMongoId().withMessage('categoryId must be a valid MongoDB ObjectId'),
  body('date')
    .optional()
    .isISO8601().withMessage('date must be a valid ISO8601 date string')
    .toDate(),
  body('description')
    .optional()
    .trim(),
];

// Optional fields for update
exports.updateTransactionValidator = [
  body('amount')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('type')
    .optional()
    .isIn(Object.values(TRANSACTION_TYPES)).withMessage('Invalid transaction type. Must be INCOME or EXPENSE'),
  body('categoryId')
    .optional()
    .isMongoId().withMessage('categoryId must be a valid MongoDB ObjectId'),
  body('date')
    .optional()
    .isISO8601().withMessage('date must be a valid ISO8601 date string')
    .toDate(),
  body('description')
    .optional()
    .trim(),
];

exports.getTransactionsValidator = [
  query('startDate')
    .optional()
    .isISO8601().withMessage('startDate must be a valid date')
    .toDate(),
  query('endDate')
    .optional()
    .isISO8601().withMessage('endDate must be a valid date')
    .toDate(),
  query('categoryId')
    .optional()
    .isMongoId().withMessage('categoryId must be a valid MongoDB ObjectId'),
];
