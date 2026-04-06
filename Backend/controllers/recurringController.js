import RecurringBill from '../models/RecurringBill.js';

export const addRecurringBill = async (req, res) => {
  try {
    const { userId, title, amount, dueDate, notes } = req.body;

    if (!userId || !title || !amount || !dueDate) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const bill = new RecurringBill({ userId, title, amount, dueDate, notes });
    await bill.save();

    res.status(201).json({ message: 'Recurring bill added', bill });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add bill', error: err.message });
  }
};

export const getRecurringBills = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const bills = await RecurringBill.find({ userId }).sort({ dueDate: 1 });
    res.status(200).json(bills);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bills', error: err.message });
  }
};
