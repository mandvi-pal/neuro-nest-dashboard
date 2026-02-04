import React from 'react';
import './MicroIntervention.css';

const MicroIntervention = ({ score, backendTip }) => {
  if (score == null) return null;

  let tips = [];
  if (score >= 0.8) {
    tips = [
      '🥰 Excellent bonding! Keep celebrating small moments together.',
      '💡 Continue reinforcing positive routines and shared joy.'
    ];
  } else if (score >= 0.6) {
    tips = [
      '😊 Good bonding. Try adding more playtime or hugs.',
      '💡 Small daily rituals (bedtime story, morning hug) strengthen connection.'
    ];
  } else if (score >= 0.4) {
    tips = [
      '😐 Moderate bonding. Spend a few minutes listening calmly today.',
      '💡 Encourage open conversation and validate your child’s feelings.'
    ];
  } else {
    tips = [
      '😢 Needs more connection. Plan a simple joyful activity together.',
      '💡 Even 10 minutes of undistracted attention can rebuild trust.'
    ];
  }

  // ✅ Prepend backend intervention if available
  if (backendTip) {
    tips = [backendTip, ...tips];
  }

  return (
    <div className="micro-card">
      <h4 className="micro-title">🌱 Micro‑Intervention Tips</h4>
      <ul className="micro-tips-list">
        {tips.map((tip, idx) => (
          <li key={idx} className="micro-tip">{tip}</li>
        ))}
      </ul>
    </div>
  );
};

export default MicroIntervention;
