import React, { useState } from 'react';
import '../../styles/Expenses.css';
import { toast } from 'react-toastify';
import { FaRegEdit, FaRupeeSign, FaTags, FaCalendarAlt, FaPercent } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AddInvestmentCard = ({ userId, onInvestmentAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: '',
    expectedReturnRate: '',
    date: '',
  });
  const [recurring, setRecurring] = useState(false);
  const [recurringDueDate, setRecurringDueDate] = useState('');
  const [recurringNotes, setRecurringNotes] = useState('');
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
      expectedReturnRate: formData.expectedReturnRate ? Number(formData.expectedReturnRate) : 0,
    };
    try {
      // Add investment
      const res = await fetch('https://capstone2-km5z.onrender.com/api/investments', {
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
        // Checked for Recurring Investments
        if (recurring) {
          await fetch('https://capstone2-km5z.onrender.com/api/recurring', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              title: formData.title,
              amount: Number(formData.amount),
              dueDate: Number(recurringDueDate),
              notes: recurringNotes,
            }),
          });
        }
        toast.success('Investment added successfully');
        setFormData({
          title: '',
          amount: '',
          type: '',
          expectedReturnRate: '',
          date: '',
        });
        setRecurring(false);
        setRecurringDueDate('');
        setRecurringNotes('');
        if (typeof onInvestmentAdded === 'function') onInvestmentAdded();
      } else {
        toast.error((data && data.message) || 'Failed to add investment (server error)');
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
        <FaRegEdit style={{ marginRight: 10, color: 'var(--lime)' }} /> Add New Investment
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
            id="investment-title"
          />
          <label htmlFor="investment-title">Title</label>
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
            id="investment-amount"
          />
          <label htmlFor="investment-amount">Amount</label>
        </div>
        <div className="form-group">
          <FaTags className="input-icon" />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            id="investment-type"
            className="priority-select beautiful-priority-select"
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingLeft: '2.5rem', paddingRight: '2.2rem', cursor: 'pointer' }}
          >
            <option value="" >Select Type</option>
            <option value="FD">FD</option>
            <option value="Mutual Fund">Mutual Fund</option>
            <option value="SIP">SIP</option>
            <option value="Other">Other</option>
          </select>
          <label htmlFor="investment-type"></label>
        </div>
        <div className="form-group">
          <FaPercent className="input-icon" />
          <input
            type="number"
            name="expectedReturnRate"
            value={formData.expectedReturnRate}
            onChange={handleChange}
            autoComplete="off"
            placeholder=" "
            id="investment-expectedReturnRate"
            min="0"
            max="100"
            step="0.01"
          />
          <label htmlFor="investment-expectedReturnRate">Expected Return Rate (%)</label>
        </div>
        <div className="form-group">
          <FaCalendarAlt className="input-icon" />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            id="investment-date"
            className="beautiful-date"
          />
          <label htmlFor="investment-date">Date</label>
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginTop: '-0.5rem', marginBottom: '0.2rem' }}>
          <input
            type="checkbox"
            id="recurring-investment"
            checked={recurring}
            onChange={e => setRecurring(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--lime)', cursor: 'pointer' }}
          />
          <label htmlFor="recurring-investment" style={{ color: 'var(--lime)', fontWeight: 500, fontSize: '1.01rem', cursor: 'pointer' }}>
            Also add as recurring investment
          </label>
        </div>
        {recurring && (
          <>
            <div className="form-group">
              <FaCalendarAlt className="input-icon" />
              <input
                type="number"
                name="recurringDueDate"
                value={recurringDueDate}
                onChange={e => setRecurringDueDate(e.target.value)}
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
                name="recurringNotes"
                value={recurringNotes}
                onChange={e => setRecurringNotes(e.target.value)}
                placeholder=" "
                id="recurring-notes"
              />
              <label htmlFor="recurring-notes">Notes (optional)</label>
            </div>
          </>
        )}
        <motion.button
          type="submit"
          className="add-expense-btn beautiful-submit"
          whileTap={{ scale: 0.93, backgroundColor: '#c7f464', color: '#111' }}
          whileHover={{ scale: 1.04, boxShadow: '0 4px 24px 0 #c7f46444' }}
          disabled={submitting}
        >
          {submitting ? 'Adding...' : '➕ Add Investment'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddInvestmentCard; 