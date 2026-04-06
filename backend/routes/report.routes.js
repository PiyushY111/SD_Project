const express = require('express');
const ReportController = require('../controllers/report.controller');
const { monthlyReportValidator, categoryReportValidator } = require('../validators/report.validator');
const { validate } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All report routes are protected
router.use(protect);

// GET /api/reports/monthly?month=4&year=2025
router.get('/monthly', monthlyReportValidator, validate, ReportController.monthly);

// GET /api/reports/category?startDate=2025-01-01&endDate=2025-04-30
router.get('/category', categoryReportValidator, validate, ReportController.category);

module.exports = router;
