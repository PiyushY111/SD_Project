import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaChartPie } from 'react-icons/fa';
Chart.register(ArcElement, Tooltip, Legend);

const InvestmentTracker = ({ investments }) => {
  const total = investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
  const byType = investments?.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + (inv.amount || 0);
    return acc;
  }, {}) || {};

  const doughnutData = {
    labels: Object.keys(byType),
    datasets: [
      {
        data: Object.values(byType),
        backgroundColor: ['#36a2eb', '#ff6384', '#c7f464', '#ffb300', '#50b8e7'],
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
      <h3 style={{ fontWeight: 800, fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <FaChartPie style={{ color: '#36a2eb', fontSize: '1.5em' }} /> Investment Tracker
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginTop: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 170, maxWidth: 200, width: '45%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
        <ul style={{ flex: 1, minWidth: 120, marginTop: 0, fontSize: '1.08rem', fontWeight: 500, marginLeft: 24, listStyle: 'disc inside' }}>
          <li><strong>Total Invested:</strong> ₹{total}</li>
          {Object.entries(byType).map(([type, amt]) => (
            <li key={type}>{type}: ₹{amt}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InvestmentTracker; 