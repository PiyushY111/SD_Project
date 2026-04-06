import React, { useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';
import { FaChartLine } from 'react-icons/fa';
Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SpendingTrendGraph = ({ data, initialMonth }) => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(initialMonth || now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const chartRef = useRef(null);

  // Area chart with gradient fill for expenses only
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Expenses',
        data: data.map(d => d.expenses),
        borderColor: '#ff6384',
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const {ctx: c, chartArea} = chart;
          if (!chartArea) return 'rgba(255,99,132,0.15)';
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(255,99,132,0.35)');
          gradient.addColorStop(1, 'rgba(255,99,132,0.05)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#ff6384',
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: '#232323' },
        ticks: { color: '#c7f464' },
      },
      y: {
        grid: { color: '#232323' },
        ticks: { color: '#c7f464' },
      },
    },
  };

  return (
    <div className="expense-card modern-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          <FaChartLine style={{ color: '#ff6384', fontSize: '1.5em' }} /> Spending Trends
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
      <div style={{ height: 260, marginTop: 18 }}>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default SpendingTrendGraph; 