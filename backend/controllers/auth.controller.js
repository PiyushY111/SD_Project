const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const sendTokenResponse = (user, statusCode, message, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict'
  };

  res.cookie('token', token, options);

  sendSuccess(res, statusCode, message, {
    user: { id: user._id, name: user.name, email: user.email }
  });
};

const AuthController = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new AppError('Email already registered', 409));
      }

      const user = await User.create({ name, email, password });
      
      sendTokenResponse(user, 201, 'User registered successfully', res);
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) {
        return next(new AppError('Invalid email or password', 401));
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return next(new AppError('Invalid email or password', 401));
      }

      sendTokenResponse(user, 200, 'Login successful', res);
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    sendSuccess(res, 200, 'Logged out successfully', {});
  }
};

module.exports = AuthController;
