import React, { useState } from 'react';
import '../../styles/Expenses.css';
import { toast } from 'react-toastify';
import { FaRegEdit, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AddRecurringBillCard = ({ userId, onBillAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const payload = {
      ...formData,
      userId,
      amount: Number(formData.amount),
      dueDate: Number(formData.dueDate),
    };
    try {
      const res = await fetch('https://capstone2-km5z.onrender.com/api/recurring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (res.ok) {
        toast.success('Recurring bill added successfully');
        setFormData({
          title: '',
          amount: '',
          dueDate: '',
          notes: '',
        });
        if (typeof onBillAdded === 'function') onBillAdded();
      } else {
        toast.error((data && data.message) || 'Failed to add recurring bill (server error)');
      }
    } catch (err) {
      toast.error('Something went wrong (network or server error)');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="expense-card modern-card beautiful-form"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.25 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="form-title"
      >
        <FaRegEdit style={{ marginRight: 10, color: 'var(--lime)' }} /> Add Recurring Bill
      </motion.h2>
      <form onSubmit={handleSubmit} className="expense-form beautiful-form-fields">
        <div className="form-group">
          <FaRegEdit className="input-icon" />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            autoComplete="off"
            placeholder=" "
            id="recurring-title"
          />
          <label htmlFor="recurring-title">Title</label>
        </div>
        <div className="form-group">
          <FaRupeeSign className="input-icon" />
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            autoComplete="off"
            placeholder=" "
            id="recurring-amount"
          />
          <label htmlFor="recurring-amount">Amount</label>
        </div>
        <div className="form-group">
          <FaCalendarAlt className="input-icon" />
          <input
            type="number"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            min="1"
            max="31"
            placeholder=" "
            id="recurring-dueDate"
          />
          <label htmlFor="recurring-dueDate">Due Date (Day of Month)</label>
        </div>
        <div className="form-group">
          <FaRegEdit className="input-icon" />
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder=" "
            id="recurring-notes"
          />
          <label htmlFor="recurring-notes">Notes (optional)</label>
        </div>
        <motion.button
          type="submit"
          className="add-expense-btn beautiful-submit"
          whileTap={{ scale: 0.93, backgroundColor: '#c7f464', color: '#111' }}
          whileHover={{ scale: 1.04, boxShadow: '0 4px 24px 0 #c7f46444' }}
          disabled={submitting}
        >
          {submitting ? 'Adding...' : '➕ Add Recurring Bill'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddRecurringBillCard; 