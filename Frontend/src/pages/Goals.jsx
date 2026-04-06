import React, { useState, useEffect } from 'react';
import AddGoalCard from '../components/Goals/AddGoalCard';
import AddInvestmentCard from '../components/Goals/AddInvestmentCard';
import InvestmentTableCard from '../components/Goals/InvestmentTableCard';
import AddSavingsMetaCard from '../components/Goals/AddSavingsMetaCard';
import SavingsMetaTableCard from '../components/Goals/SavingsMetaTableCard';
import GoalTableCard from '../components/Goals/GoalTableCard';
import '../styles/Goals.css';
import '../styles/Expenses.css';
import { motion, AnimatePresence } from 'framer-motion';

const Goals = () => {
  const [activeTab, setActiveTab] = useState('goals');
  const [investments, setInvestments] = useState([]);
  const [savingsMeta, setSavingsMeta] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loadingInvestments, setLoadingInvestments] = useState(true);
  const [loadingSavingsMeta, setLoadingSavingsMeta] = useState(true);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id || user?.userId;

  const fetchInvestments = async () => {
    try {
      setLoadingInvestments(true);
      const res = await fetch(`https://capstone2-km5z.onrender.com/api/investments?userId=${userId}`);
      const data = await res.json();
      if (res.ok) setInvestments(data);
    } finally {
      setLoadingInvestments(false);
    }
  };
  const fetchSavingsMeta = async () => {
    try {
      setLoadingSavingsMeta(true);
      // Get current month in YYYY-MM format
      const now = new Date();
      const month = now.toISOString().slice(0, 7);
      const res = await fetch(`https://capstone2-km5z.onrender.com/api/savings/${month}?userId=${userId}`);
      const data = await res.json();
      if (res.ok && data && data._id) setSavingsMeta([data]);
      else setSavingsMeta([]);
    } finally {
      setLoadingSavingsMeta(false);
    }
  };
  const fetchGoals = async () => {
    try {
      setLoadingGoals(true);
      const res = await fetch(`https://capstone2-km5z.onrender.com/api/goals?userId=${userId}`);
      const data = await res.json();
      if (res.ok) setGoals(data);
      else setGoals([]);
    } finally {
      setLoadingGoals(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGoals();
      fetchInvestments();
      fetchSavingsMeta();
    }
  }, [userId]);

  if (!userId) {
    return <div className="goals-page">Please login to view your goals and investments.</div>;
  }

  return (
    <div className="expenses-page-centered">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.2rem', marginBottom: '2.2rem' }}>
        <button
          className={activeTab === 'goals' ? 'auth-toggle-btn active' : 'auth-toggle-btn'}
          onClick={() => setActiveTab('goals')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'goals' ? 'var(--lime)' : 'var(--text-gray)',
            fontWeight: 600,
            fontSize: '1.1rem',
            padding: '0.3rem 1.2rem',
            borderBottom: activeTab === 'goals' ? '2.5px solid var(--lime)' : '2.5px solid transparent',
            cursor: 'pointer',
            borderRadius: 0,
            transition: 'color 0.2s, border-bottom 0.2s',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}
        >
          Goals
        </button>
        <button
          className={activeTab === 'investments' ? 'auth-toggle-btn active' : 'auth-toggle-btn'}
          onClick={() => setActiveTab('investments')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'investments' ? 'var(--lime)' : 'var(--text-gray)',
            fontWeight: 600,
            fontSize: '1.1rem',
            padding: '0.3rem 1.2rem',
            borderBottom: activeTab === 'investments' ? '2.5px solid var(--lime)' : '2.5px solid transparent',
            cursor: 'pointer',
            borderRadius: 0,
            transition: 'color 0.2s, border-bottom 0.2s',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}
        >
          Investments
        </button>
        <button
          className={activeTab === 'savings' ? 'auth-toggle-btn active' : 'auth-toggle-btn'}
          onClick={() => setActiveTab('savings')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'savings' ? 'var(--lime)' : 'var(--text-gray)',
            fontWeight: 600,
            fontSize: '1.1rem',
            padding: '0.3rem 1.2rem',
            borderBottom: activeTab === 'savings' ? '2.5px solid var(--lime)' : '2.5px solid transparent',
            cursor: 'pointer',
            borderRadius: 0,
            transition: 'color 0.2s, border-bottom 0.2s',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}
        >
          Savings
        </button>
      </div>
      <AnimatePresence mode="wait">
        {activeTab === 'goals' ? (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <AddGoalCard userId={userId} onGoalAdded={fetchGoals} />
            <GoalTableCard goals={goals} loading={loadingGoals} onGoalDeleted={fetchGoals} />
          </motion.div>
        ) : activeTab === 'investments' ? (
          <motion.div
            key="investments"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <AddInvestmentCard userId={userId} onInvestmentAdded={fetchInvestments} />
            <InvestmentTableCard investments={investments} loading={loadingInvestments} />
          </motion.div>
        ) : (
          <motion.div
            key="savings"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <AddSavingsMetaCard userId={userId} onSavingsMetaAdded={fetchSavingsMeta} />

            {loadingSavingsMeta ? (
              <div className="expense-table-outer"><p style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>Loading...</p></div>
            ) : savingsMeta && savingsMeta.length > 0 ? (
              <div className="expense-table-outer">
                <h2 className="expense-table-title">Most Recent Savings Meta</h2>
                <div className="expense-table-card expense-table-card-modern">
                  <table className="expense-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center' }}>Month</th>
                        <th style={{ textAlign: 'center' }}>Target Savings</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: 'center', minWidth: 110 }}>{savingsMeta[0]?.month}</td>
                        <td style={{ textAlign: 'center', minWidth: 120, fontWeight: 600 }}>₹ {savingsMeta[0]?.targetSavings}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="expense-table-outer"><p style={{ padding: '1rem', color: '#aaa', textAlign: 'center' }}>No savings meta found.</p></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;
