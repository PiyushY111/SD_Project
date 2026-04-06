const Category = require('../models/category.model');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

const CategoryController = {
  async getAll(req, res, next) {
    try {
      const categories = await Category.find({
        $or: [{ userId: null }, { userId: req.user.id }],
      });
      
      sendSuccess(res, 200, 'Categories fetched successfully', categories);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name } = req.body;
      const userId = req.user.id;
      
      const existing = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        $or: [{ userId: null }, { userId }],
      });
      
      if (existing) {
        return next(new AppError('Category with this name already exists', 409));
      }
      
      const category = await Category.create({ name, userId });
      sendSuccess(res, 201, 'Category created successfully', category);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = CategoryController;
