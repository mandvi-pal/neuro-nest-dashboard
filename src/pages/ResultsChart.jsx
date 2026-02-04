import { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';
import './ResultChart.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ResultsChart({ childrenList }) {
  const [selectedId, setSelectedId] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef();

  // ✅ Set default selected child when list is ready
  useEffect(() => {
    if (Array.isArray(childrenList) && childrenList.length > 0) {
      setSelectedId(childrenList[0]._id);
    }
  }, [childrenList]);

  // ✅ Fetch analytics when selectedId changes
  useEffect(() => {
    if (!selectedId) {
      setAnalytics(null);
      return;
    }

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/analytics?childId=${selectedId}`);
        setAnalytics(res.data);
      } catch (err) {
        console.error("❌ Error fetching analytics:", err.response?.data || err.message);
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedId]);

  // ✅ Scroll to chart when child changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedId]);

  const isValid =
    typeof analytics?.quizScore === 'number' &&
    typeof analytics?.soundScore === 'number';

  const data = isValid
    ? {
        labels: ['Quiz Score', 'Sound Score'],
        datasets: [
          {
            label: `${analytics.child?.name || 'Child'}'s Screening`,
            data: [analytics.quizScore, analytics.soundScore],
            backgroundColor: ['#9b59b6', '#1abc9c']
          }
        ]
      }
    : null;

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: { stepSize: 1 }
      }
    }
  };

  // ✅ Guard against undefined or empty childrenList
  if (!Array.isArray(childrenList) || childrenList.length === 0) {
    return (
      <div className="section-warning">
        <p>⚠️ No children available. Please add a child to view screening data.</p>
      </div>
    );
  }

  return (
    <div className="section-card section-screening" ref={chartRef}>
      <h3>📊 Screening Report</h3>

      <label htmlFor="child-select">👶 Select Child:</label>
      <select
        id="child-select"
        value={selectedId || ''}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        {childrenList.map((child) => (
          <option key={child._id} value={child._id}>
            {child.name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: '1rem' }}>
        {loading ? (
          <p>Loading chart...</p>
        ) : analytics === null ? (
          <div className="section-warning">
            <p>⚠️ No screening data found. Please complete a screening.</p>
          </div>
        ) : !isValid ? (
          <div className="section-warning">
            <p>⚠️ Incomplete data. Please complete both quiz and sound sections.</p>
          </div>
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
}

export default ResultsChart;
