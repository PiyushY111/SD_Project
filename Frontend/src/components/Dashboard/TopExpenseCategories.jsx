import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaChartPie } from 'react-icons/fa';
Chart.register(ArcElement, Tooltip, Legend);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const TopExpenseCategories = ({ categories, initialMonth }) => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(initialMonth || now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const doughnutData = {
    labels: categories?.map(cat => cat.category),
    datasets: [
      {
        data: categories?.map(cat => cat.amount),
        backgroundColor: ['#ff6384', '#36a2eb', '#c7f464'],
        borderWidth: 1,
      },
    ],
  };
  const doughnutOptions = {
    plugins: {
      legend: { display: false },
    },
    cutout: '70%',
    maintainAspectRatio: false,
  };

  return (
    <div className="expense-card modern-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          <FaChartPie style={{ color: '#ff6384', fontSize: '1.5em' }} /> Top 3 Expense Categories
        </h3>
        <div style={{ display: 'flex', gap: 6 }}>
          <select className="priority-select beautiful-priority-select" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
            {months.map((m, idx) => <option value={idx} key={m}>{m}</option>)}
          </select>
          <select className="priority-select beautiful-priority-select" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
            {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map(y => <option value={y} key={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginTop: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 300, maxWidth: 350, width: '45%', height: 550, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
        <ol style={{ flex: 1, minWidth: 120, marginTop: 0, fontSize: '1.08rem', fontWeight: 500, marginLeft: 24, listStyle: 'decimal inside' }}>
          {categories && categories.length > 0 ? (
            categories.map((cat, idx) => (
              <li key={cat._id || idx} style={{ marginBottom: 8 }}>
                <strong>{cat.category}</strong>: ₹{cat.amount}
              </li>
            ))
          ) : (
            <li>No data available</li>
          )}
        </ol>
      </div>
    </div>
  );
};

export default TopExpenseCategories; 