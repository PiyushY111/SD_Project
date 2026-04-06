import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaChartPie } from 'react-icons/fa';
Chart.register(ArcElement, Tooltip, Legend);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthlyBreakdownChart = ({ breakdown, initialMonth }) => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(initialMonth || now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const data = {
    labels: ['Expenses', 'Investments', 'Savings'],
    datasets: [
      {
        data: [breakdown?.expenses ?? 0, breakdown?.investments ?? 0, breakdown?.savings ?? 0],
        backgroundColor: ['#ff6384', '#36a2eb', '#c7f464'],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="expense-card modern-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          <FaChartPie style={{ color: '#36a2eb', fontSize: '1.5em' }} /> Monthly Breakdown
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
      <Pie data={data} />
    </div>
  );
};

export default MonthlyBreakdownChart; 