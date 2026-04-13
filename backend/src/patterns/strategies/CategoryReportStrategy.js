const BaseReportStrategy = require('./BaseReportStrategy');
const Transaction = require('../../models/transaction.model');
const mongoose = require('mongoose');

/**
 * DESIGN PATTERN: Strategy Pattern (Concrete Strategy)
 * OOP: Inheritance — extends BaseReportStrategy
 * OOP: Polymorphism — overrides generate() and getType()
 * SOLID: Liskov Substitution — fully substitutable for BaseReportStrategy
 * SOLID: Single Responsibility — only handles category breakdown report logic
 */
class CategoryReportStrategy extends BaseReportStrategy {
  async generate({ userId, startDate, endDate }) {
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();

    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
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
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
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

    return { startDate: start, endDate: end, categories: summary };
  }

  getType() {
    return 'category';
  }
}

module.exports = CategoryReportStrategy;
