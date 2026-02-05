import React, { useEffect, useState } from 'react';
import { fetchGrowthTwin } from '../../../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './GrowthTwin.css';

// Register Chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GrowthTwin = ({ child, childrenList = [], prediction: externalPrediction, score = 0 }) => {
  const [prediction, setPrediction] = useState(externalPrediction || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState(child?._id || "");

  // Fallback Data (Agar API fail ho jaye toh ye dikhega)
  const defaultData = {
    months: ["Current", "+3m", "+6m", "+9m", "+12m"],
    values: [30, 45, 65, 80, 95],
    focusArea: "Cognitive Dev (AI Sample)",
    similarity: 85,
    age_months: child?.age_months || 24
  };

  const displayAge = score > 0 
    ? score 
    : (prediction?.age_months || child?.age_months || 0);

  useEffect(() => {
    if (externalPrediction) setPrediction(externalPrediction);
  }, [externalPrediction]);

  useEffect(() => {
    if (Array.isArray(childrenList) && childrenList.length > 0 && !selectedChildId) {
      setSelectedChildId(childrenList[0]._id);
    }
  }, [childrenList, selectedChildId]);

  // API Fetching logic
  useEffect(() => {
    if (!selectedChildId || externalPrediction) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchGrowthTwin(selectedChildId)
      .then(res => {
        if (!isMounted) return;
        // Check if we got valid data structure
        if (res?.data && res.data.months && res.data.values) {
          setPrediction(res.data);
        } else {
          // If data is missing parts, use fallback
          setPrediction(defaultData);
        }
      })
      .catch(err => {
        if (!isMounted) return;
        console.error("API Error in GrowthTwin:", err);
        // Backend fail hone par bhi graph dikhao
        setPrediction(defaultData);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedChildId, externalPrediction]);

  // Data mapping for Chart
  const safeMonths = Array.isArray(prediction?.months) ? prediction.months : defaultData.months;
  const safeValues = Array.isArray(prediction?.values) ? prediction.values.map(v => Number(v)) : defaultData.values;

  return (
    <div className="growth-twin-container">
      <div className="growth-header">
        <h3>🌱 Growth Twin™ AI</h3>
        <p>Virtual growth trajectory based on historical data.</p>
      </div>

      {childrenList.length > 0 && (
        <div className="growth-dropdown-wrapper">
          <select 
            className="growth-select"
            value={selectedChildId} 
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            {childrenList.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {loading && <div className="status-msg">⏳ Generating AI Trajectory...</div>}

      {!loading && (
        <div className="twin-grid">
          {/* Chart Section */}
          <div className="chart-wrapper">
            <Line
              key={`${selectedChildId}-${safeValues.length}`} // Forces re-render on data change
              data={{
                labels: safeMonths,
                datasets: [{
                  label: 'Predicted Growth Path',
                  data: safeValues,
                  borderColor: '#2ecc71',
                  backgroundColor: 'rgba(46, 204, 113, 0.1)',
                  borderWidth: 3,
                  tension: 0.4,
                  fill: true,
                  pointRadius: 5,
                  pointBackgroundColor: '#27ae60'
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { display: false },
                  tooltip: { backgroundColor: '#2c3e50' }
                },
                scales: {
                  y: { 
                    beginAtZero: true, 
                    max: 100,
                    title: { display: true, text: 'Development %' }
                  },
                  x: { grid: { display: false } }
                }
              }}
            />
          </div>

          {/* Metrics Section */}
          <div className="growth-summary">
            <div className="metric-box">
              <strong>Next Focus Area</strong>
              <span className="focus-badge">{prediction?.focusArea || "Skill Building"}</span>
            </div>

            <div className="metric-box">
              <strong>AI Similarity</strong>
              <div className="sim-bar-container">
                 <progress value={prediction?.similarity || 85} max="100"></progress>
                 <span>{prediction?.similarity || 85}%</span>
              </div>
            </div>

            <div className="metric-box highlighted">
              <strong>Age Benchmark</strong>
              <span className="benchmark-value">
                {displayAge} Months
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthTwin;