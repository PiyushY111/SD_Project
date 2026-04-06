import Goal from '../models/Goal.js';

// POST /api/goals
export const addGoal = async (req, res) => {
  try {
    const { userId, title, type, targetAmount, priority, deadline, notes } = req.body;

    if (!userId || !title || !type || !targetAmount) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const newGoal = new Goal({
      userId,
      title,
      type,
      targetAmount,
      priority,
      deadline,
      notes
    });

    await newGoal.save();
    res.status(201).json({ message: 'Goal created', goal: newGoal });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add goal', error: err.message });
  }
};

// GET /api/goals?userId=...
export const getGoals = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch goals', error: err.message });
  }
};
