import Expense from '../models/Expense.js';

// POST /api/expenses
export const addExpense = async (req, res) => {
  try {
    const { userId, title, category, amount, priority, date } = req.body;

    if (!userId || !title || !category || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newExpense = new Expense({ userId, title, category, amount, priority, date });
    await newExpense.save();

    res.status(201).json({ message: 'Expense added', expense: newExpense });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add expense', error: err.message });
  }
};

// GET /api/expenses?userId=...
export const getExpenses = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: err.message });
  }
};
