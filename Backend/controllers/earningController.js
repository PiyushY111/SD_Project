import Earning from '../models/Earning.js';

// POST /api/earnings
export const addEarning = async (req, res) => {
  try {
    const { userId, source, category, amount, date } = req.body;

    if (!userId || !source || !category || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newEarning = new Earning({ userId, source, category, amount, date });
    await newEarning.save();

    res.status(201).json({ message: 'Earning added', earning: newEarning });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add earning', error: err.message });
  }
};

// GET /api/earnings?userId=...
export const getEarnings = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const earnings = await Earning.find({ userId }).sort({ date: -1 });
    res.status(200).json(earnings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch earnings', error: err.message });
  }
};
