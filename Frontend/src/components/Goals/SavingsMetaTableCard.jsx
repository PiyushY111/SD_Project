import React, { useState } from 'react';
import '../../styles/Expenses.css';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SavingsMetaTableCard = ({ savingsMeta, loading }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://capstone2-km5z.onrender.com/api/savingsMeta/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Savings meta deleted');
        window.location.reload(); // or pass onDelete prop and refetch
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Error deleting savings meta');
    }
  };

  return (
    <div className="expense-table-outer">
      <h2 className="expense-table-title">Savings Meta Records</h2>
      <div className="expense-table-card expense-table-card-modern">
        {loading ? (
          <p style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>Loading...</p>
        ) : savingsMeta.length === 0 ? (
          <p style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>No savings meta found.</p>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Month</th>
                <th style={{ textAlign: 'center' }}>Target Savings</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {savingsMeta.map((meta, idx) => (
                <tr
                  key={meta._id}
                  className={`expense-row${hoveredRow === idx ? ' row-hovered' : ''}`}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ textAlign: 'center', minWidth: 110 }}>{meta.month}</td>
                  <td style={{ textAlign: 'center', minWidth: 120, fontWeight: 600 }}>₹ {meta.targetSavings}</td>
                  <td style={{ textAlign: 'center', minWidth: 80 }}>
                    <motion.button
                      className="delete-expense-btn"
                      onClick={() => handleDelete(meta._id)}
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

export default SavingsMetaTableCard; 