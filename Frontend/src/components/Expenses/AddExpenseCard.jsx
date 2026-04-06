import React, { useState } from 'react';
import '../../styles/Expenses.css';
import { toast } from 'react-toastify';
import { FaRegEdit, FaRupeeSign, FaTags, FaCalendarAlt, FaStar, FaRegStar, FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AddExpenseCard = ({ userId, onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    priority: '', 
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
      const res = await fetch('https://capstone2-km5z.onrender.com/api/expenses', {
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
        toast.success('Expense added successfully');
        setFormData({
          title: '',
          amount: '',
          category: '',
          priority: '', 
          date: '',
        });
        if (typeof onExpenseAdded === 'function') onExpenseAdded();
      } else {
        toast.error((data && data.message) || 'Failed to add expense (server error)');
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
        <FaRegEdit style={{ marginRight: 10, color: 'var(--lime)' }} /> Add New Expense
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
            id="expense-title"
          />
          <label htmlFor="expense-title">Title</label>
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
            id="expense-amount"
          />
          <label htmlFor="expense-amount">Amount</label>
        </div>
        <div className="form-group">
          <FaTags className="input-icon" />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            autoComplete="off"
            placeholder=" "
            id="expense-category"
          />
          <label htmlFor="expense-category">Category</label>
        </div>
        <div className="form-group priority-group" style={{ position: 'relative' }}>
          <motion.select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            id="expense-priority"
            className="priority-select beautiful-priority-select"
            whileFocus={{ scale: 1.04, boxShadow: '0 0 0 2px #c7f46455' }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 0 2px #c7f46433' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '2.2rem', cursor: 'pointer' }}
            onBlur={(e) => e.target.classList.remove('select-focused')}
            onFocus={(e) => e.target.classList.add('select-focused')}
          >
            <option value="" disabled>Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </motion.select>
          <FaChevronDown className="dropdown-icon" style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#c7f464', fontSize: 18 }} />
          <label
            htmlFor="expense-priority"
            className={formData.priority || document.activeElement?.id === 'expense-priority' ? 'floating' : ''}
            style={{ left: '1.2rem', transition: '0.22s cubic-bezier(0.4,1.6,0.6,1)', zIndex: 3 }}
          >
            
          </label>
        </div>
        <div className="form-group">
          <FaCalendarAlt className="input-icon" />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            id="expense-date"
            className="beautiful-date"
          />
          <label htmlFor="expense-date">Date</label>
        </div>
        <motion.button
          type="submit"
          className="add-expense-btn beautiful-submit"
          whileTap={{ scale: 0.93, backgroundColor: '#c7f464', color: '#111' }}
          whileHover={{ scale: 1.04, boxShadow: '0 4px 24px 0 #c7f46444' }}
          disabled={submitting}
        >
          {submitting ? 'Adding...' : '➕ Add Expense'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddExpenseCard;
