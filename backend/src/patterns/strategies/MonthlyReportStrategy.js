const BaseReportStrategy = require('./BaseReportStrategy');
const Transaction = require('../../models/transaction.model');

/**
 * DESIGN PATTERN: Strategy Pattern (Concrete Strategy)
 * OOP: Inheritance — extends BaseReportStrategy
 * OOP: Polymorphism — overrides generate() and getType()
 * SOLID: Liskov Substitution — fully substitutable for BaseReportStrategy
 * SOLID: Single Responsibility — only handles monthly report logic
 */
class MonthlyReportStrategy extends BaseReportStrategy {
  async generate({ userId, month, year }) {
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

    return {
      month,
      year,
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  }

  getType() {
    return 'monthly';
  }
}

module.exports = MonthlyReportStrategy;
