const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { sendError } = require('./utils/response');
const AppError = require('./utils/AppError');

const authRoutes = require('./routes/auth.routes');
const transactionRoutes = require('./routes/transaction.routes');
const categoryRoutes = require('./routes/category.routes');
const reportRoutes = require('./routes/report.routes');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new AppError('Route not found', 404));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return sendError(res, 400, 'Mongoose Validation Error', err.errors);
  }

  if (err.name === 'CastError') {
    return sendError(res, 400, 'Invalid ID format', err.message);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || null;

  sendError(res, statusCode, message, details);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
