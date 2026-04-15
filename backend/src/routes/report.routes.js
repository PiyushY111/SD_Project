const express = require('express');
const ReportController = require('../controllers/report.controller');
const { monthlyReportValidator, categoryReportValidator } = require('../validators/report.validator');
const { validate } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

// Strategy Pattern: default strategies injected here; swap them out for testing or new report types
router.get('/monthly', monthlyReportValidator, validate, ReportController.monthly());
router.get('/category', categoryReportValidator, validate, ReportController.category());

module.exports = router;
