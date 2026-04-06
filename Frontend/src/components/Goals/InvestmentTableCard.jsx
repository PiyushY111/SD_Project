import React, { useState } from 'react';
import '../../styles/Expenses.css';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const InvestmentTableCard = ({ investments = [], loading, onInvestmentDeleted }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://capstone2-km5z.onrender.com/api/investments/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Investment deleted');
        if (typeof onInvestmentDeleted === 'function') onInvestmentDeleted();
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Error deleting investment');
    }
  };

  return (
    <div className="expense-table-outer">
      <h2 className="expense-table-title">Investment Records</h2>
      <div className="expense-table-card expense-table-card-modern">
        {loading ? (
          <p style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>Loading...</p>
        ) : investments.length === 0 ? (
          <p style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>No investments found.</p>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Title</th>
                <th style={{ textAlign: 'center' }}>Type</th>
                <th style={{ textAlign: 'center' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Expected Return Rate (%)</th>
                <th style={{ textAlign: 'center' }}>Date</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv, idx) => (
                <tr
                  key={inv._id || idx}
                  className={`expense-row${hoveredRow === idx ? ' row-hovered' : ''}`}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ textAlign: 'center' }}>{inv.title}</td>
                  <td style={{ textAlign: 'center' }}>{inv.type}</td>
                  <td style={{ textAlign: 'center' }}>₹ {inv.amount}</td>
                  <td style={{ textAlign: 'center' }}>{inv.expectedReturnRate ?? '-'}</td>
                  <td style={{ textAlign: 'center' }}>{inv.date ? new Date(inv.date).toLocaleDateString() : '-'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="delete-expense-btn"
                      onClick={() => handleDelete(inv._id)}
                      title="Delete"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
                    >
                      <FaTrash />
                    </button>
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

export default InvestmentTableCard; 