import React, { useState } from 'react';
import '../../styles/Expenses.css';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ExpenseTableCard = ({ expenses, loading }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://capstone2-km5z.onrender.com/api/expenses/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Expense deleted');
        window.location.reload(); // or pass onDelete prop and refetch
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Error deleting expense');
    }
  };

  return (
    <div className="expense-table-outer">
      <h2 className="expense-table-title">Expense Records</h2>
      <div className="expense-table-card expense-table-card-modern">
      {loading ? (
          <p style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>Loading...</p>
      ) : expenses.length === 0 ? (
          <p style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>No expenses found.</p>
      ) : (
        <table className="expense-table">
          <thead>
            <tr>
                <th style={{ textAlign: 'center' }}>Date</th>
                <th style={{ textAlign: 'center' }}>Title</th>
                <th style={{ textAlign: 'center' }}>Category</th>
                <th style={{ textAlign: 'center' }}>Amount (₹)</th>
                <th style={{ textAlign: 'center' }}>Priority</th>
                <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
              {expenses.map((exp, idx) => (
                <tr
                  key={exp._id}
                  className={`expense-row${hoveredRow === idx ? ' row-hovered' : ''}`}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ textAlign: 'center' }}>{new Date(exp.date).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'center' }}>{exp.title}</td>
                  <td style={{ textAlign: 'center' }}>{exp.category}</td>
                  <td style={{ textAlign: 'center' }}>₹ {exp.amount}</td>
                  <td style={{ textAlign: 'center' }}>{exp.priority}</td>
                  <td style={{ textAlign: 'center' }}>
                    <motion.button
                      className="delete-expense-btn"
                    onClick={() => handleDelete(exp._id)}
                    title="Delete"
                      whileHover={{ scale: 1.18, rotate: -10, backgroundColor: '#ff4d4f', color: '#fff' }}
                      whileTap={{ scale: 0.92 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
                    >
                      <FaTrash />
                    </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
};

export default ExpenseTableCard;
