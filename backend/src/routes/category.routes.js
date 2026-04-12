const express = require('express');
const CategoryController = require('../controllers/category.controller');
const { createCategoryValidator } = require('../validators/category.validator');
const { validate } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', CategoryController.getAll);
router.post('/', createCategoryValidator, validate, CategoryController.create);

module.exports = router;
