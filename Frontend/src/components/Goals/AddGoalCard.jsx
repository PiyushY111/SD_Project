import React, { useState } from 'react';
import '../../styles/Expenses.css';
import { toast } from 'react-toastify';
import { FaRegEdit, FaRupeeSign, FaTags, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AddGoalCard = ({ userId, onGoalAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    type: '',
    priority: '',
    deadline: '',
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
      targetAmount: Number(formData.targetAmount),
    };
    try {
      const res = await fetch('https://capstone2-km5z.onrender.com/api/goals', {
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
        toast.success('Goal added successfully');
        setFormData({
          title: '',
          targetAmount: '',
          type: '',
          priority: '',
          deadline: '',
          notes: '',
        });
        if (typeof onGoalAdded === 'function') onGoalAdded();
      } else {
        toast.error((data && data.message) || 'Failed to add goal (server error)');
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
        <FaRegEdit style={{ marginRight: 10, color: 'var(--lime)' }} /> Add New Goal
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
            id="goal-title"
          />
          <label htmlFor="goal-title">Title</label>
        </div>
        <div className="form-group">
          <FaRupeeSign className="input-icon" />
          <input
            type="number"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            required
            autoComplete="off"
            placeholder=" "
            id="goal-amount"
          />
          <label htmlFor="goal-amount">Target Amount</label>
        </div>
        <div className="form-group">
          <FaTags className="input-icon" />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            id="goal-type"
            className="priority-select beautiful-priority-select"
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingLeft: '2.5rem', paddingRight: '2.2rem', cursor: 'pointer' }}
          >
            <option value="" disabled>Select Type</option>
            <option value="short-term">Short-term</option>
            <option value="long-term">Long-term</option>
          </select>
          <label htmlFor="goal-type"></label>
        </div>
        <div className="form-group priority-group" style={{ position: 'relative' }}>
          <motion.select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            id="goal-priority"
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
            htmlFor="goal-priority"
            className={formData.priority || document.activeElement?.id === 'goal-priority' ? 'floating' : ''}
            style={{ left: '1.2rem', transition: '0.22s cubic-bezier(0.4,1.6,0.6,1)', zIndex: 3 }}
          >
            
          </label>
        </div>
        <div className="form-group">
          <FaCalendarAlt className="input-icon" />
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            id="goal-deadline"
            className="beautiful-date"
          />
          <label htmlFor="goal-deadline">Deadline</label>
        </div>
        <div className="form-group">
          <FaRegEdit className="input-icon" />
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            autoComplete="off"
            placeholder=" "
            id="goal-notes"
          />
          <label htmlFor="goal-notes">Notes (optional)</label>
        </div>
        <motion.button
          type="submit"
          className="add-expense-btn beautiful-submit"
          whileTap={{ scale: 0.93, backgroundColor: '#c7f464', color: '#111' }}
          whileHover={{ scale: 1.04, boxShadow: '0 4px 24px 0 #c7f46444' }}
          disabled={submitting}
        >
          {submitting ? 'Adding...' : '➕ Add Goal'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddGoalCard;
