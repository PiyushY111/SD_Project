import React, { useState } from 'react';
import '../../styles/Expenses.css';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const GoalTableCard = ({ goals, loading, onGoalDeleted }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://capstone2-km5z.onrender.com/api/goals/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Goal deleted');
        if (typeof onGoalDeleted === 'function') onGoalDeleted();
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Error deleting goal');
    }
  };

  return (
    <div className="expense-table-outer">
      <h2 className="expense-table-title">Goal Records</h2>
      <div className="expense-table-card expense-table-card-modern">
        {loading ? (
          <p style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>Loading...</p>
        ) : goals.length === 0 ? (
          <p style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>No goals found.</p>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Title</th>
                <th style={{ textAlign: 'center' }}>Type</th>
                <th style={{ textAlign: 'center' }}>Target Amount</th>
                <th style={{ textAlign: 'center' }}>Priority</th>
                <th style={{ textAlign: 'center' }}>Deadline</th>
                <th style={{ textAlign: 'center' }}>Notes</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal, idx) => (
                <tr
                  key={goal._id}
                  className={`expense-row${hoveredRow === idx ? ' row-hovered' : ''}`}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ textAlign: 'center' }}>{goal.title}</td>
                  <td style={{ textAlign: 'center' }}>{goal.type}</td>
                  <td style={{ textAlign: 'center' }}>₹ {goal.targetAmount}</td>
                  <td style={{ textAlign: 'center' }}>{goal.priority}</td>
                  <td style={{ textAlign: 'center' }}>{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : '-'}</td>
                  <td style={{ textAlign: 'center' }}>{goal.notes || '-'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="delete-expense-btn"
                      onClick={() => handleDelete(goal._id)}
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

export default GoalTableCard; 