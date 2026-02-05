import React from 'react';
import './EmotionHeatmap.css';

const EmotionHeatmap = ({ logs = [], image }) => {
  
  // ✅ Image logic (Heatmap from backend)
  if (image && typeof image === 'string' && image.startsWith('data:image')) {
    return (
      <div className="heatmap-card">
        <h3 className="heatmap-title">📊 Emotion Trend Analysis</h3>
        <div className="heatmap-image-container">
          <img src={image} alt="Emotion Heatmap" className="heatmap-image" />
        </div>
      </div>
    );
  }

  if (!Array.isArray(logs) || logs.length === 0) {
    return (
      <div className="heatmap-card empty">
        <div className="empty-content"><span>📉</span><p>No emotion logs yet.</p></div>
      </div>
    );
  }

  const transformed = logs.map(log => {
    const dt = log?.timestamp || log?.time ? new Date(log.timestamp || log.time) : new Date();
    return {
      date: dt.toLocaleDateString([], { day: '2-digit', month: 'short' }),
      time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotion: (log?.type || log?.emotion || 'neutral').toLowerCase(),
      intensity: typeof log?.score === 'number' ? log.score / 5 : (log.correct ? 0.9 : 0.5),
      rawScore: log?.score || 3
    };
  });

  return (
    <div className="heatmap-card">
      <h3 className="heatmap-title">📊 Emotion Trend Analysis</h3>
      
      {/* Heatmap Grid Visual */}
      <div className="heatmap-grid">
        {transformed.map((d, i) => (
          <div
            key={i}
            className="heatmap-cell"
            style={{ backgroundColor: colorFor(d.emotion, d.intensity) }}
          >
            <span className="heatmap-tooltip">
              {d.date} | {d.emotion.toUpperCase()} ({Math.round(d.intensity * 100)}%)
            </span>
          </div>
        ))}
      </div>

      <div className="heatmap-divider"></div>

      {/* ✅ Proper Logs List Section */}
      <div className="detailed-logs">
        <h4>📋 Activity Logs</h4>
        <div className="logs-scrollable">
          {transformed.map((log, index) => (
            <div key={index} className="log-row-item">
              <div className="log-status-dot" style={{ backgroundColor: colorFor(log.emotion, 1) }}></div>
              <div className="log-main-info">
                <span className="log-emotion-name">{log.emotion.toUpperCase()}</span>
                <span className="log-date-time">{log.date} • {log.time}</span>
              </div>
              <div className="log-intensity-badge">
                Intensity: {Math.round(log.intensity * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const colorFor = (emotion, intensity = 0.5) => {
  const scale = 0.3 + intensity * 0.7;
  switch (emotion) {
    case 'happy': return `rgba(46, 204, 113, ${scale})`;
    case 'sad': return `rgba(52, 152, 219, ${scale})`;
    case 'angry': return `rgba(231, 76, 60, ${scale})`;
    case 'surprise':
    case 'surprised': return `rgba(241, 196, 15, ${scale})`;
    case 'neutral': return `rgba(149, 165, 166, ${scale})`;
    case 'scared': return `rgba(155, 89, 182, ${scale})`;
    default: return `rgba(155, 89, 182, ${scale})`;
  }
};

export default EmotionHeatmap;