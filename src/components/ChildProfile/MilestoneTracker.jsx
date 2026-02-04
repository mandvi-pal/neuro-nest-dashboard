
import React from 'react';
import './milestoneTracker.css';

function MilestoneTracker({ child }) {
  if (!child || !child.screeningResults?.length) {
    return (
      <div className="milestone-wrapper">
        <h3>📊 Milestone Tracker</h3>
        <p className="milestone-empty">⚠️ No screening results available yet.</p>
      </div>
    );
  }

  const result = child.screeningResults[0];
  const createdAt = result?.createdAt ? new Date(result.createdAt) : null;
  const nextScreeningDate = createdAt
    ? new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
    : null;

  return (
    <div className="milestone-wrapper">
      <h3>📊 Milestone Tracker</h3>
      <p className="age-label">
        🧒 {child.name || "Unknown"} ({child.gender || "N/A"}, {child.age_months ?? "N/A"} months)
      </p>

      {child.milestonePrediction && (
        <div className="milestone-card milestone-prediction">
          <h4>🧠 Predicted Milestone</h4>
          <p className="prediction-text">{child.milestonePrediction}</p>
        </div>
      )}

      <div className="milestone-card milestone-summary">
        <h4>📋 Last Screening Summary</h4>
        <div className="score-row">
          <span><strong>Quiz Score:</strong></span>
          <progress value={result?.quizScore ?? 0} max="5"></progress>
          <span>{result?.quizScore ?? "N/A"} / 5</span>
        </div>
        <div className="score-row">
          <span><strong>Sound Score:</strong></span>
          <progress value={result?.soundScore ?? 0} max="5"></progress>
          <span>{result?.soundScore ?? "N/A"} / 5</span>
        </div>
        <div className="score-row">
          <span><strong>Emotion Score:</strong></span>
          <progress value={result?.emotionScore ?? 0} max="5"></progress>
          <span>{result?.emotionScore ?? "N/A"} / 5</span>
        </div>
        <p className="screened-on">
          <strong>Screened On:</strong>{" "}
          {createdAt ? createdAt.toLocaleDateString() : "N/A"}
        </p>
      </div>

      <div className="milestone-card milestone-next">
        <h4>📅 Next Screening Due</h4>
        <p className="next-date">
          {nextScreeningDate ? nextScreeningDate.toLocaleDateString() : "N/A"}
        </p>
      </div>
    </div>
  );
}

export default MilestoneTracker;
