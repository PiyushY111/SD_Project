const Category = require('../models/category.model');
const { sendSuccess } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const CategoryController = {
  getAll: asyncHandler(async (req, res) => {
    const categories = await Category.find({
      $or: [{ userId: null }, { userId: req.user.id }],
    });
    sendSuccess(res, 200, 'Categories fetched successfully', categories);
  }),

  create: asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const userId = req.user.id;

    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      $or: [{ userId: null }, { userId }],
    });

    if (existing) {
      return next(new ApiError('Category with this name already exists', 409));
    }

    const category = await Category.create({ name, userId });
    sendSuccess(res, 201, 'Category created successfully', category);
  }),
};

module.exports = CategoryController;
