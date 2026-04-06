import React, { useState, useEffect } from 'react';
import AddRecurringBillCard from '../components/Recurring/AddRecurringBillCard';
import RecurringBillTableCard from '../components/Recurring/RecurringBillTableCard';
import '../styles/Expenses.css';

const Recurring = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id || user?.userId;

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://capstone2-km5z.onrender.com/api/recurring?userId=${userId}`);
      const data = await res.json();
      if (res.ok) setBills(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchBills();
  }, [userId]);

  if (!userId) {
    return <div className="expenses-page-centered">Please login to view your recurring bills.</div>;
  }

  return (
    <div className="expenses-page-centered">
      <AddRecurringBillCard userId={userId} onBillAdded={fetchBills} />
      <RecurringBillTableCard bills={bills} loading={loading} />
    </div>
  );
};

export default Recurring;
