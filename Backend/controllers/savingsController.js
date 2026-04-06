import SavingsMeta from '../models/SavingsMeta.js';

// POST /api/savings
export const setMonthlySavings = async (req, res) => {
  try {
    const { userId, month, targetSavings } = req.body;

    if (!userId || !month || !targetSavings) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await SavingsMeta.findOne({ userId, month });
    if (existing) {
      existing.targetSavings = targetSavings;
      await existing.save();
      return res.status(200).json({ message: 'Savings target updated', data: existing });
    }

    const newEntry = new SavingsMeta({ userId, month, targetSavings });
    await newEntry.save();

    res.status(201).json({ message: 'Savings target set', data: newEntry });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save', error: err.message });
  }
};

// GET /api/savings/:month?userId=...
export const getMonthlySavings = async (req, res) => {
  try {
    const { userId } = req.query;
    const { month } = req.params;

    if (!userId || !month) {
      return res.status(400).json({ message: 'Missing userId or month' });
    }

    const data = await SavingsMeta.findOne({ userId, month });
    res.status(200).json(data || {});
  } catch (err) {
    res.status(500).json({ message: 'Failed to get savings', error: err.message });
  }
};
