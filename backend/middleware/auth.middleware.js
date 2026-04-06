const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token; // Check cookie first

    // Fallback exactly for testing APIs via Auth Headers just in case
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('No token provided, authorization denied', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new AppError('User not found, token invalid', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError('Token is not valid or has expired', 401));
  }
};

module.exports = { protect };
