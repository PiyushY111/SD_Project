import React from 'react';
import { FaRedo } from 'react-icons/fa';

const RecurringBillsProgress = ({ bills }) => {
  return (
    <div className="expense-card modern-card">
      <h3 style={{ fontWeight: 800, fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <FaRedo style={{ color: '#ffb300', fontSize: '1.5em' }} /> Recurring Bills Progress
      </h3>
      {bills && bills.length > 0 ? (
        bills.map((bill, idx) => {
          const due = new Date(bill.dueDate);
          const now = new Date();
          const daysLeft = Math.max(0, Math.ceil((due - now) / (1000 * 60 * 60 * 24)));
          return (
            <div key={bill._id || idx} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 500 }}>{bill.title} (₹{bill.amount})</div>
              <div style={{ background: '#eee', borderRadius: 8, height: 16, width: '100%', margin: '4px 0' }}>
                <div style={{ width: bill.paid ? '100%' : '0%', background: bill.paid ? 'var(--lime)' : '#ff4d4f', height: '100%', borderRadius: 8 }} />
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>{bill.paid ? 'Paid' : `${daysLeft} days left`}</div>
            </div>
          );
        })
      ) : (
        <div>No recurring bills</div>
      )}
    </div>
  );
};

export default RecurringBillsProgress; 