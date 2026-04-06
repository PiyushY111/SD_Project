import React, { useEffect, useState } from 'react';
import TopExpenseCategories from '../components/Dashboard/TopExpenseCategories';
import MonthlyBreakdownChart from '../components/Dashboard/MonthlyBreakdownChart';
import GoalsProgressBars from '../components/Dashboard/GoalsProgressBars';
import SpendingTrendGraph from '../components/Dashboard/SpendingTrendGraph';
import InvestmentTracker from '../components/Dashboard/InvestmentTracker';
import RecurringBillsProgress from '../components/Dashboard/RecurringBillsProgress';
import SavingsTracker from '../components/Dashboard/SavingsTracker';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [breakdown, setBreakdown] = useState({ expenses: 0, investments: 0, savings: 0 });
  const [goals, setGoals] = useState([]);
  const [trend, setTrend] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [bills, setBills] = useState([]);
  const [savingsTarget, setSavingsTarget] = useState(0);
  const [savingsCurrent, setSavingsCurrent] = useState(0);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id || user?.userId;

  useEffect(() => {
    if (!userId) return;
    const fetchAll = async () => {
      try {
        // Expenses
        const expRes = await fetch(`https://capstone2-km5z.onrender.com/api/expenses?userId=${userId}`);
        const expenses = await expRes.json();
        // Top 3 categories
        const catMap = {};
        expenses.forEach(e => {
          catMap[e.category] = (catMap[e.category] || 0) + e.amount;
        });
        const topCategories = Object.entries(catMap)
          .map(([category, amount]) => ({ category, amount }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 3);
        setCategories(topCategories);
        // Trend (group by week)
        const trendMap = {};
        expenses.forEach(e => {
          const date = new Date(e.date);
          const week = `${date.getFullYear()}-${date.getMonth() + 1}-W${Math.ceil(date.getDate() / 7)}`;
          if (!trendMap[week]) trendMap[week] = 0;
          trendMap[week] += e.amount;
        });
        const trendArr = Object.entries(trendMap).map(([date, expenses]) => ({ date, expenses }));
        setTrend(trendArr);
        // Total expenses for breakdown
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

        // Investments
        const invRes = await fetch(`https://capstone2-km5z.onrender.com/api/investments?userId=${userId}`);
        const investmentsData = await invRes.json();
        setInvestments(investmentsData);
        const totalInvestments = investmentsData.reduce((sum, i) => sum + (i.amount || 0), 0);

        // Goals
        const goalsRes = await fetch(`https://capstone2-km5z.onrender.com/api/goals?userId=${userId}`);
        const goalsData = await goalsRes.json();
        setGoals(goalsData);

        // Recurring Bills
        const billsRes = await fetch(`https://capstone2-km5z.onrender.com/api/recurring?userId=${userId}`);
        const billsData = await billsRes.json();
        setBills(billsData);

        // Savings (current month)
        const now = new Date();
        const month = now.toISOString().slice(0, 7);
        const savingsRes = await fetch(`https://capstone2-km5z.onrender.com/api/savings/${month}?userId=${userId}`);
        const savingsData = await savingsRes.json();
        setSavingsTarget(savingsData?.targetSavings || 0);
        // Calculate current savings: salary - expenses - investments
        // (Assume salary is in user object or set to 0 if not present)
        const salary = user.salary || 0;
        setSavingsCurrent(Math.max(0, salary - totalExpenses - totalInvestments));

        // Breakdown
        setBreakdown({
          expenses: totalExpenses,
          investments: totalInvestments,
          savings: Math.max(0, salary - totalExpenses - totalInvestments),
        });
      } catch {
        // Handle error
      } finally {
        // No-op
      }
    };
    fetchAll();
  }, [userId]);

  return (
    <div className="dashboard-page">
      {/* <h1>Dashboard</h1> */}
      <div className="dashboard-grid">
        <TopExpenseCategories categories={categories} />
        <MonthlyBreakdownChart breakdown={breakdown} />
        <GoalsProgressBars goals={goals} />
        <SpendingTrendGraph data={trend} />
        <InvestmentTracker investments={investments} />
        <RecurringBillsProgress bills={bills} />
        <SavingsTracker target={savingsTarget} current={savingsCurrent} />
      </div>
    </div>
  );
};

export default Dashboard;
