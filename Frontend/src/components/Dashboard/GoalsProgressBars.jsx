import React from 'react';
import { FaBullseye } from 'react-icons/fa';

const GoalsProgressBars = ({ goals }) => {
  return (
    <div className="expense-card modern-card">
      <h3 style={{ fontWeight: 800, fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <FaBullseye style={{ color: '#c7f464', fontSize: '1.5em' }} /> Goals Progress
      </h3>
      {goals && goals.length > 0 ? (
        goals.map((goal, idx) => {
          const percent = Math.min(100, Math.round((goal.savedSoFar / goal.targetAmount) * 100));
          return (
            <div key={goal._id || idx} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 500 }}>{goal.title} ({goal.type}, {goal.priority})</div>
              <div style={{ background: '#eee', borderRadius: 8, height: 16, width: '100%', margin: '4px 0' }}>
                <div style={{ width: percent + '%', background: 'var(--lime)', height: '100%', borderRadius: 8 }} />
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>{percent}% of ₹{goal.targetAmount}</div>
            </div>
          );
        })
      ) : (
        <div>No goals to show</div>
      )}
    </div>
  );
};

export default GoalsProgressBars; 