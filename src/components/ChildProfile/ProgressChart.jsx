import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function ProgressChart({ progress }) {
  const subjects = Object.keys(progress);
  const scores = Object.values(progress);

  const data = {
    labels: subjects,
    datasets: [
      {
        label: 'Progress (%)',
        data: scores,
        borderColor: '#FF5722', // 🔶 Line color
        backgroundColor: 'rgba(255, 87, 34, 0.2)', // 🔶 Fill under line
        pointBackgroundColor: '#FF9800', // 🔶 Point color
        pointBorderColor: '#E65100',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#ddd', // 🔷 Grid line color
        },
        ticks: {
          color: '#333', // 🔷 Y-axis label color
          stepSize: 10,
        },
      },
      x: {
        grid: {
          color: '#eee',
        },
        ticks: {
          color: '#333', // 🔷 X-axis label color
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#444', // 🔷 Legend text color
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#333',
        borderColor: '#FF5722',
        borderWidth: 1,
      },
    },
  };

  return (
    <div style={{ marginTop: '2rem', height: '300px' }}>
      <h4 style={{ color: '#FF5722' }}>📊 Progress Chart</h4>
      <Line data={data} options={options} />
    </div>
  );
}

export default ProgressChart;