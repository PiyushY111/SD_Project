import React, { useState } from 'react';
import '../../styles/Expenses.css';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RecurringBillTableCard = ({ bills, loading }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://capstone2-km5z.onrender.com/api/recurring/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Recurring bill deleted');
        window.location.reload(); // or pass onDelete prop and refetch
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Error deleting recurring bill');
    }
  };

  return (
    <div className="expense-table-outer">
      <h2 className="expense-table-title">Recurring Bills</h2>
      <div className="expense-table-card expense-table-card-modern">
        {loading ? (
          <p style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>Loading...</p>
        ) : bills.length === 0 ? (
          <p style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>No recurring bills found.</p>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Title</th>
                <th style={{ textAlign: 'center' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Due Date</th>
                <th style={{ textAlign: 'center' }}>Notes</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, idx) => (
                <tr
                  key={bill._id}
                  className={`expense-row${hoveredRow === idx ? ' row-hovered' : ''}`}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ textAlign: 'center', minWidth: 120 }}>{bill.title}</td>
                  <td style={{ textAlign: 'center', minWidth: 100, fontWeight: 600 }}>₹ {bill.amount}</td>
                  <td style={{ textAlign: 'center', minWidth: 100 }}>{bill.dueDate}</td>
                  <td style={{ textAlign: 'center', minWidth: 120 }}>{bill.notes}</td>
                  <td style={{ textAlign: 'center', minWidth: 80 }}>
                    <motion.button
                      className="delete-expense-btn"
                      onClick={() => handleDelete(bill._id)}
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

export default RecurringBillTableCard; 