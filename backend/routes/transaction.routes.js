const express = require('express');
const TransactionController = require('../controllers/transaction.controller');
const { 
  createTransactionValidator, 
  updateTransactionValidator, 
  getTransactionsValidator 
} = require('../validators/transaction.validator');
const { validate } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All transaction routes are protected
router.use(protect);

// POST /api/transactions
router.post('/', createTransactionValidator, validate, TransactionController.create);

// GET /api/transactions?startDate=&endDate=&categoryId=
router.get('/', getTransactionsValidator, validate, TransactionController.getAll);

// PUT /api/transactions/:id
router.put('/:id', updateTransactionValidator, validate, TransactionController.update);

// DELETE /api/transactions/:id
router.delete('/:id', TransactionController.remove);

module.exports = router;
