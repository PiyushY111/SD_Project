import React, { useEffect, useState } from 'react';
import AddExpenseCard from '../components/Expenses/AddExpenseCard';
import ExpenseTableCard from '../components/Expenses/ExpenseTableCard';
import '../styles/Expenses.css';
import { toast } from 'react-toastify';
import HeroBanner from '../assets/HeroBanner.svg';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id || user?.userId;

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://capstone2-km5z.onrender.com/api/expenses?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setExpenses(data);
      } else {
        toast.error('Failed to load expenses');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchExpenses();
    }
  }, [userId]);

  if (!userId) {
    return <div className="expenses-page">Please login to view your expenses.</div>;
  }

  return (
    <div className="expenses-page-centered">
      <AddExpenseCard userId={userId} onExpenseAdded={fetchExpenses} />
      <ExpenseTableCard expenses={expenses} loading={loading} />
    </div>
  );
};

export default Expenses;
