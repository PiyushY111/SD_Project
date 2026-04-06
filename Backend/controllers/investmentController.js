import Investment from '../models/Investment.js';

// POST /api/investments
export const addInvestment = async (req, res) => {
  try {
    const { userId, title, type, amount, expectedReturnRate, date } = req.body;

    if (!userId || !title || !type || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newInvestment = new Investment({ userId, title, type, amount, expectedReturnRate, date });
    await newInvestment.save();

    res.status(201).json({ message: 'Investment added', investment: newInvestment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add investment', error: err.message });
  }
};

// GET /api/investments?userId=...
export const getInvestments = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const investments = await Investment.find({ userId }).sort({ date: -1 });
    res.status(200).json(investments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch investments', error: err.message });
  }
};
