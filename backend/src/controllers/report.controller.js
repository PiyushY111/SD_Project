const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const MonthlyReportStrategy = require('../patterns/strategies/MonthlyReportStrategy');
const CategoryReportStrategy = require('../patterns/strategies/CategoryReportStrategy');

/**
 * DESIGN PATTERN: Strategy Pattern — report generation is delegated to strategy objects
 * SOLID: Dependency Inversion — controller depends on BaseReportStrategy abstraction
 * SOLID: Open/Closed — new report types can be added without modifying this controller
 * OOP: Polymorphism — monthly() and category() call the same generate() interface
 */
const ReportController = {
  /**
   * @param {BaseReportStrategy} strategy - injected strategy (default provided)
   */
  monthly: (strategy = new MonthlyReportStrategy()) =>
    asyncHandler(async (req, res) => {
      const { month, year } = req.query;
      const report = await strategy.generate({ userId: req.user.id, month, year });
      sendSuccess(res, 200, 'Monthly report generated successfully', report);
    }),

  category: (strategy = new CategoryReportStrategy()) =>
    asyncHandler(async (req, res) => {
      const { startDate, endDate } = req.query;
      const report = await strategy.generate({ userId: req.user.id, startDate, endDate });
      sendSuccess(res, 200, 'Category report generated successfully', report);
    }),
};

module.exports = ReportController;
