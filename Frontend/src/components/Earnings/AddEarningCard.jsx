import React, { useState } from 'react';
import '../../styles/Expenses.css';
import { toast } from 'react-toastify';
import { FaRegEdit, FaRupeeSign, FaTags, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AddEarningCard = ({ userId, onEarningAdded }) => {
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    category: '',
    date: '',
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
    const payload = { ...formData, userId, amount: Number(formData.amount) };
    try {
      const res = await fetch('https://capstone2-km5z.onrender.com/api/earnings', {
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
        toast.success('Earning added successfully');
        setFormData({
          source: '',
          amount: '',
          category: '',
          date: '',
        });
        if (typeof onEarningAdded === 'function') onEarningAdded();
      } else {
        toast.error((data && data.message) || 'Failed to add earning (server error)');
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
        <FaRegEdit style={{ marginRight: 10, color: 'var(--lime)' }} /> Add New Earning
      </motion.h2>
      <form onSubmit={handleSubmit} className="expense-form beautiful-form-fields">
        <div className="form-group">
          <FaRegEdit className="input-icon" />
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            required
            autoComplete="off"
            placeholder=" "
            id="earning-source"
          />
          <label htmlFor="earning-source">Source</label>
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
            id="earning-amount"
          />
          <label htmlFor="earning-amount">Amount</label>
        </div>
        <div className="form-group">
          <FaTags className="input-icon" />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            id="earning-category"
            className="priority-select beautiful-priority-select"
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '2.2rem', cursor: 'pointer' }}
          >
            <option value="" disabled>Select Category</option>
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Gift">Gift</option>
            <option value="Passive Income">Passive Income</option>
            <option value="Other">Other</option>
          </select>
          <label htmlFor="earning-category"></label>
        </div>
        <div className="form-group">
          <FaCalendarAlt className="input-icon" />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            id="earning-date"
            className="beautiful-date"
          />
          <label htmlFor="earning-date">Date</label>
        </div>
        <motion.button
          type="submit"
          className="add-expense-btn beautiful-submit"
          whileTap={{ scale: 0.93, backgroundColor: '#c7f464', color: '#111' }}
          whileHover={{ scale: 1.04, boxShadow: '0 4px 24px 0 #c7f46444' }}
          disabled={submitting}
        >
          {submitting ? 'Adding...' : '➕ Add Earning'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddEarningCard; 