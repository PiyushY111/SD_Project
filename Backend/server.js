import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
// Routes Imports
import authRoutes from './routes/auth.js';
import earningRoutes from './routes/earnings.js';
import expenseRoutes from './routes/expenses.js';
import goalRoutes from './routes/goals.js';
import investmentRoutes from './routes/investments.js';
import recurringRoutes from './routes/recurring.js';
import savingsRoutes from './routes/savings.js';

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/earnings', earningRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/savings', savingsRoutes);


app.get('/', (req, res) => {
  res.send('FinBuddy Backend is Running ');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
