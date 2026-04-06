const express = require('express');
const CategoryController = require('../controllers/category.controller');
const { createCategoryValidator } = require('../validators/category.validator');
const { validate } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All category routes are protected
router.use(protect);

// GET /api/categories
router.get('/', CategoryController.getAll);

// POST /api/categories
router.post('/', createCategoryValidator, validate, CategoryController.create);

module.exports = router;
