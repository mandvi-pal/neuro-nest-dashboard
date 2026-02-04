import { useState, useEffect } from 'react';
import axios from 'axios';
import ResultsChart from '../components/SmartScreening/ResultsChart';
// import './analyticsDashboard.css'; // Optional styling

function AnalyticsDashboard() {
  const [children, setChildren] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all children
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/children`);
        setChildren(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching children:", err.response?.data || err.message);
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  return (
    <div className="analytics-dashboard-wrapper">
      <h2>📈 Child-wise Screening Analytics</h2>

      {loading ? (
        <p>Loading children...</p>
      ) : children.length === 0 ? (
        <p className="no-data-msg">🚫 No child data available. Please add a child first.</p>
      ) : (
        <>
          <label htmlFor="child-select">Select Child:</label>
          <select
            id="child-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">-- Choose --</option>
            {children.map((child) => (
              <option key={child._id} value={child._id}>
                {child.name} – {child.age_readable || `${child.age_months} months`} – {child.gender}
              </option>
            ))}
          </select>

          <hr />

          {selectedId && <ResultsChart selectedId={selectedId} />}
        </>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
