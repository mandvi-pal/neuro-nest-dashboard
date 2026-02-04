import React, { useEffect, useState } from 'react';

function MilestoneCard({ child }) {
  const [animate, setAnimate] = useState(false);

  if (!child) return null;

  const { name, age_months, gender, milestonePrediction } = child;

  
  useEffect(() => {
    if (milestonePrediction) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [milestonePrediction]);

  
  const badgeMap = {
    'Fine Motor Skills': '🎨',
    'Language Development': '🗣️',
    'Emotional Awareness': '😊',
    'Cognitive Thinking': '🧠',
    'Gross Motor Skills': '🏃‍♀️'
  };

  
  const gameMap = {
    'Fine Motor Skills': '/games/color-sort',
    'Language Development': '/games/sound-match',
    'Emotional Awareness': '/games/emotion-match',
    'Cognitive Thinking': '/games/memory-match',
    'Gross Motor Skills': '/games/movement-challenge'
  };

  const badge = badgeMap[milestonePrediction] || '🧠';
  const gameLink = gameMap[milestonePrediction];

  return (
    <div style={{
      marginTop: '1rem',
      padding: '1rem',
      background: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s ease',
      transform: animate ? 'scale(1.03)' : 'scale(1)'
    }}>
      <h3>🧠 Predicted Milestone</h3>

      <p><strong>{name}</strong> ({gender}, {age_months} months)</p>

      {milestonePrediction ? (
        <>
          <p style={{ fontSize: '1.1rem', marginTop: '0.5rem', color: '#2ECC71' }}>
            ✅ {name} is likely ready for: <strong>{milestonePrediction}</strong> {badge}
          </p>

          {/* 🎮 Practice Game Link */}
          {gameLink && (
            <a
              href={gameLink}
              style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#3498db',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              🎮 Practice this skill
            </a>
          )}
        </>
      ) : (
        <p style={{ fontSize: '1.1rem', marginTop: '0.5rem', color: '#E74C3C' }}>
          ⚠️ No prediction available yet.
        </p>
      )}
    </div>
  );
}

export default MilestoneCard;
