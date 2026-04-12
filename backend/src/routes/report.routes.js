const express = require('express');
const ReportController = require('../controllers/report.controller');
const { monthlyReportValidator, categoryReportValidator } = require('../validators/report.validator');
const { validate } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/monthly', monthlyReportValidator, validate, ReportController.monthly);
router.get('/category', categoryReportValidator, validate, ReportController.category);

module.exports = router;
