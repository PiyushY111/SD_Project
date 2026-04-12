const express = require('express');
const TransactionController = require('../controllers/transaction.controller');
const {
  createTransactionValidator,
  updateTransactionValidator,
  getTransactionsValidator,
} = require('../validators/transaction.validator');
const { validate } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', createTransactionValidator, validate, TransactionController.create);
router.get('/', getTransactionsValidator, validate, TransactionController.getAll);
router.put('/:id', updateTransactionValidator, validate, TransactionController.update);
router.delete('/:id', TransactionController.remove);

module.exports = router;
