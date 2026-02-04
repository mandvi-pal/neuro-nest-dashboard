import React, { useState } from 'react';
import axios from 'axios';
import './parentFeedback.css';

function ParentFeedback({ childId, onComplete, setFeedbackData }) {
  const [form, setForm] = useState({
    sleepHours: '',
    speechLevel: '',
    behaviorNotes: '',
    concerns: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bondingScore, setBondingScore] = useState(null);
  const [tips, setTips] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Sleep hours negative na ho jayein
    if (name === "sleepHours" && value < 0) return;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    // Basic Validation
    if (!form.sleepHours || !form.speechLevel) {
      return alert("⚠️ Please fill in the required fields (Sleep & Speech).");
    }

    if (!childId) {
      return alert("❌ Child ID missing. Please refresh and try again.");
    }

    // Backend ko jo data chahiye wahi bhej rahe hain
    const payload = { 
      childId: childId, 
      sleepHours: Number(form.sleepHours),
      speechLevel: form.speechLevel,
      behaviorNotes: form.behaviorNotes,
      concerns: form.concerns,
      emotionScore: 3, // Default placeholder scores for backend
      soundScore: 4,
      quizScore: 2,
      timestamp: new Date()
    };

    setLoading(true);

    try {
      // 1. Save Feedback to Database (Using the working endpoint saveAll)
      await axios.post(`${import.meta.env.VITE_API_URL}/api/screening/saveAll`, payload);

      // 2. ML Bonding Score Call
      try {
        const bondingRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/ml/bonding-score`, {
          childId: childId,
          feedbackText: `${form.behaviorNotes} ${form.concerns}`
        });
        setBondingScore(bondingRes.data?.score ?? null);
      } catch (e) { console.error("Bonding API failed"); }

      // 3. ML Tips Call
      try {
        const tipsRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/ml/generate-tips`, {
          childId: childId,
          scores: {
            sleep: Number(form.sleepHours),
            speech: form.speechLevel
          }
        });
        setTips(tipsRes.data?.tips || []);
      } catch (e) { console.error("Tips API failed"); }

      // Success State
      setSubmitted(true);
      if (setFeedbackData) setFeedbackData(form);
      
      // Kuch der baad SmartScreening ko signal bhejna
      setTimeout(() => {
         if (onComplete) onComplete();
      }, 4000);

    } catch (err) {
      console.error("❌ Submission Error:", err.response?.data || err.message);
      alert("Submission failed: " + (err.response?.data?.error || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-card">
      {!submitted ? (
        <div className="feedback-body">
          <h3 className="feedback-title">💬 Parent Observation</h3>
          
          <div className="input-group">
            <label>🛌 Sleep (hours per night):</label>
            <input
              type="number"
              name="sleepHours"
              min="0"
              max="24"
              value={form.sleepHours}
              onChange={handleChange}
              placeholder="e.g. 8"
              className="feedback-input"
            />
          </div>

          <div className="input-group">
            <label>🗣️ Speech Level:</label>
            <select
              name="speechLevel"
              value={form.speechLevel}
              onChange={handleChange}
              className="feedback-select"
            >
              <option value="">-- Choose --</option>
              <option value="Not speaking">Not speaking</option>
              <option value="Single words">Single words</option>
              <option value="Short sentences">Short sentences</option>
              <option value="Fluent speech">Fluent speech</option>
            </select>
          </div>

          <div className="input-group">
            <label>🧠 Behavior Notes:</label>
            <textarea
              name="behaviorNotes"
              value={form.behaviorNotes}
              onChange={handleChange}
              placeholder="Was the child happy or distracted?"
              className="feedback-textarea"
            />
          </div>

          <div className="input-group">
            <label>❓ Any other concerns?</label>
            <textarea
              name="concerns"
              value={form.concerns}
              onChange={handleChange}
              placeholder="Anything else you noticed..."
              className="feedback-textarea"
            />
          </div>

          <button
            type="button"
            className="feedback-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "⏳ Saving..." : "✅ Submit Feedback"}
          </button>
        </div>
      ) : (
        <div className="feedback-summary-mini">
          <div className="success-icon">🎉</div>
          <p className="feedback-success">Data Saved Successfully!</p>

          {bondingScore !== null && (
            <div className="bonding-badge">
              🤝 Bonding Analysis: <strong>{Math.round(bondingScore * 100)}/100</strong>
            </div>
          )}

          {tips.length > 0 && (
            <div className="mini-tips">
              <h4>💡 Personalized Tips:</h4>
              <ul>
                {tips.slice(0, 3).map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          )}
          <p className="redirect-text" style={{fontSize: '0.8rem', color: '#888', marginTop: '10px'}}>
            Closing session in a few seconds...
          </p>
        </div>
      )}
    </div>
  );
}

export default ParentFeedback;