import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ProgressTracker({ progress }) {
  if (!progress || Object.keys(progress).length === 0) {
    return (
      <div className="section-card section-warning">
        <p>⚠️ No progress data available.</p>
      </div>
    );
  }

  const labels = Object.keys(progress);
  const scores = Object.values(progress);

  const data = {
    labels,
    datasets: [
      {
        label: 'Progress (%)',
        data: scores,
        backgroundColor: '#2ECC71',
        borderRadius: 6,
        barThickness: 40
      }
    ]
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeOutBounce'
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10
        },
        grid: {
          color: '#eee'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="section-card chart-container">
      <h4>📈 Subject-wise Progress</h4>
      <Bar data={data} options={options} />
    </div>
  );
}

export default ProgressTracker;
