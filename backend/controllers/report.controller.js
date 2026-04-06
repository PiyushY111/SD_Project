const Transaction = require('../models/transaction.model');
const { sendSuccess } = require('../utils/response');

const ReportController = {
  // GET /api/reports/monthly?month=4&year=2025
  async monthly(req, res, next) {
    try {
      const { month, year } = req.query;
      const userId = req.user.id;

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      const transactions = await Transaction.find({
        userId,
        date: { $gte: startDate, $lt: endDate },
      });

      let totalIncome = 0;
      let totalExpense = 0;

      for (const t of transactions) {
        if (t.type === 'INCOME') totalIncome += t.amount;
        else totalExpense += t.amount;
      }

      const report = {
        month,
        year,
        totalIncome,
        totalExpense,
        net: totalIncome - totalExpense,
        transactionCount: transactions.length,
      };

      sendSuccess(res, 200, 'Monthly report generated successfully', report);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/reports/category?startDate=2025-01-01&endDate=2025-04-30
  async category(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user.id;

      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();

      const summary = await Transaction.aggregate([
        {
          $match: {
            userId: userId,
            date: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: { categoryId: '$categoryId', type: '$type' },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: '_id.categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: { path: '$category', preserveNullAndEmpty: true },
        },
        {
          $project: {
            _id: 0,
            categoryId: '$_id.categoryId',
            categoryName: '$category.name',
            type: '$_id.type',
            total: 1,
            count: 1,
          },
        },
        { $sort: { total: -1 } },
      ]);

      const report = {
        startDate: start,
        endDate: end,
        categories: summary,
      };

      sendSuccess(res, 200, 'Category report generated successfully', report);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ReportController;
