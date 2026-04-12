const Transaction = require('../models/transaction.model');
const Category = require('../models/category.model');
const { sendSuccess } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const TransactionController = {
  create: asyncHandler(async (req, res, next) => {
    const { amount, type, categoryId, date, description } = req.body;
    const userId = req.user.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new ApiError('Category not found', 404));
    }
    if (category.userId && category.userId.toString() !== userId.toString()) {
      return next(new ApiError('Unauthorized access to category', 403));
    }

    const transaction = await Transaction.create({
      userId,
      amount,
      type,
      categoryId,
      date: date || new Date(),
      description: description || '',
    });

    sendSuccess(res, 201, 'Transaction created successfully', transaction);
  }),

  getAll: asyncHandler(async (req, res) => {
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
  }),

  update: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return next(new ApiError('Transaction not found', 404));
    }
    if (transaction.userId.toString() !== userId.toString()) {
      return next(new ApiError('Not authorized to update this transaction', 403));
    }

    if (updateData.categoryId && updateData.categoryId !== transaction.categoryId.toString()) {
      const category = await Category.findById(updateData.categoryId);
      if (!category) {
        return next(new ApiError('Category not found', 404));
      }
      if (category.userId && category.userId.toString() !== userId.toString()) {
        return next(new ApiError('Unauthorized access to category', 403));
      }
    }

    const updated = await Transaction.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    sendSuccess(res, 200, 'Transaction updated successfully', updated);
  }),

  remove: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return next(new ApiError('Transaction not found', 404));
    }
    if (transaction.userId.toString() !== userId.toString()) {
      return next(new ApiError('Not authorized to delete this transaction', 403));
    }

    await Transaction.findByIdAndDelete(id);
    sendSuccess(res, 200, 'Transaction deleted successfully');
  }),
};

module.exports = TransactionController;
