
  import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, Filler);

function ProgressTrendChart({ history }) {
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <div className="section-warning">
        <p>⚠️ No screening history available.</p>
      </div>
    );
  }

  const labels = history.map(item =>
    new Date(item.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  );

  const data = {
    labels,
    datasets: [
      {
        label: '🧠 Quiz Score',
        data: history.map(item => item.quizScore),
        borderColor: '#3498db',
        backgroundColor: '#3498db33',
        tension: 0.3,
        fill: false,
        pointStyle: 'rectRounded',
        pointRadius: 5
      },
      {
        label: '🔊 Sound Score',
        data: history.map(item => item.soundScore),
        borderColor: '#2ecc71',
        backgroundColor: '#2ecc7133',
        tension: 0.3,
        fill: false,
        pointStyle: 'circle',
        pointRadius: 5
      },
      {
        label: '😊 Emotion Score',
        data: history.map(item => item.emotionScore),
        borderColor: '#e74c3c',
        backgroundColor: '#e74c3c33',
        tension: 0.3,
        fill: false,
        pointStyle: 'triangle',
        pointRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: '📈 Screening Progress Over Time',
        font: {
          size: 18
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} / 5`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        },
        title: {
          display: true,
          text: 'Score'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Screening Date'
        }
      }
    }
  };

  return (
    <div className="trend-chart-container">
      <Line data={data} options={options} />
    </div>
  );
}

export default ProgressTrendChart;
