import React from 'react';
import ProgressChart from './ProgressChart';
import Recommendation from '../RecommendationEngine/Recommendation';

function ChildProfile({ child }) {
  if (!child || !child.progress) return null;

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '1.5rem',
      marginTop: '1rem',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ color: '#4CAF50' }}>{child.name}'s Profile</h3>
      <p><strong>Age:</strong> {child.age_readable || "Age not available"}</p>
      <p><strong>Gender:</strong> {child.gender || "Not specified"}</p>

      <ProgressChart progress={child.progress} />
      <Recommendation progress={child.progress} />
    </div>
  );
}

export default ChildProfile;
