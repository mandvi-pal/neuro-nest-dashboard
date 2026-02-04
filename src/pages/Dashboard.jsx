import { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; 

function Dashboard() {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/children')
      .then(res => setChildren(res.data))
      .catch(err => console.error('Error fetching children:', err));
  }, []);

  return (
    <div className="dashboard-wrapper">
      <h2>🧠 NeuroNest Dashboard</h2>

      {children.length === 0 ? (
        <p className="dashboard-empty">⚠️ No child profiles found.</p>
      ) : (
        children.map((child) => (
          <div key={child._id} className="dashboard-card">
            <div className="dashboard-row">
              <label>Name:</label>
              <span>{child.name}</span>
            </div>
            <div className="dashboard-row">
              <label>Age:</label>
              <span>{child.age_months} months</span>
            </div>
            <div className="dashboard-row">
              <label>Gender:</label>
              <span>{child.gender}</span>
            </div>
            <button className="dashboard-btn">📄 View Report</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
