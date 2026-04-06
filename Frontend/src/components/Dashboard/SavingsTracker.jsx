import React from 'react';
import { FaPiggyBank } from 'react-icons/fa';

const SavingsTracker = ({ target, current }) => {
  const percent = Math.min(100, Math.round((current / target) * 100));
  const alert = current < target * 0.8 ? null : (current < target ? 'Warning: Nearing savings limit!' : 'Alert: Savings target at risk!');
  return (
    <div className="expense-card modern-card">
      <h3 style={{ fontWeight: 800, fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <FaPiggyBank style={{ color: '#c7f464', fontSize: '1.5em' }} /> Savings Tracker
      </h3>
      <div style={{ background: '#eee', borderRadius: 8, height: 16, width: '100%', margin: '8px 0' }}>
        <div style={{ width: percent + '%', background: percent < 80 ? 'var(--lime)' : '#ffb300', height: '100%', borderRadius: 8 }} />
      </div>
      <div style={{ fontSize: 12, color: '#888' }}>{percent}% of ₹{target} saved</div>
      {alert && <div style={{ color: '#ff4d4f', fontWeight: 500, marginTop: 6 }}>{alert}</div>}
    </div>
  );
};

export default SavingsTracker; 