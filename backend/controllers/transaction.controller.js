const Transaction = require('../models/transaction.model');
const Category = require('../models/category.model');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

const TransactionController = {
  async create(req, res, next) {
    try {
      const { amount, type, categoryId, date, description } = req.body;
      const userId = req.user.id;
      
      const category = await Category.findById(categoryId);
      if (!category) {
        return next(new AppError('Category not found', 404));
      }
      // Ensure category is either global or belongs to user
      if (category.userId && category.userId.toString() !== userId.toString()) {
        return next(new AppError('Unauthorized access to category', 403));
      }
      
      const transaction = await Transaction.create({
        userId,
        amount,
        type,
        categoryId,
        date: date || new Date(),
        description: description || ''
      });
      
      sendSuccess(res, 201, 'Transaction created successfully', transaction);
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const { startDate, endDate, categoryId } = req.query;
      const query = { userId: req.user.id };

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = startDate;
        if (endDate) query.date.$lte = endDate;
      }
      if (categoryId) {
        query.categoryId = categoryId;
      }

      const transactions = await Transaction.find(query)
        .populate('categoryId', 'name')
        .sort({ date: -1 });

      sendSuccess(res, 200, 'Transactions fetched successfully', transactions);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;
      
      const transaction = await Transaction.findById(id);
      if (!transaction) {
        return next(new AppError('Transaction not found', 404));
      }
      if (transaction.userId.toString() !== userId.toString()) {
        return next(new AppError('Not authorized to update this transaction', 403));
      }

      // Check category ownership if categoryId is being changed
      if (updateData.categoryId && updateData.categoryId !== transaction.categoryId.toString()) {
        const category = await Category.findById(updateData.categoryId);
        if (!category) {
          return next(new AppError('Category not found', 404));
        }
        if (category.userId && category.userId.toString() !== userId.toString()) {
          return next(new AppError('Unauthorized access to category', 403));
        }
      }

      const updated = await Transaction.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      sendSuccess(res, 200, 'Transaction updated successfully', updated);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const transaction = await Transaction.findById(id);
      if (!transaction) {
        return next(new AppError('Transaction not found', 404));
      }
      if (transaction.userId.toString() !== userId.toString()) {
        return next(new AppError('Not authorized to delete this transaction', 403));
      }

      await Transaction.findByIdAndDelete(id);
      sendSuccess(res, 200, 'Transaction deleted successfully');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = TransactionController;
