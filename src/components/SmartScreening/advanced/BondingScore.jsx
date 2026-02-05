import React, { useState, useEffect } from 'react';
import { getBondingScore, fetchChildren } from '../../../services/api';
import './BondingScore.css';
import MicroIntervention from './MicroIntervention'; 

const BondingScore = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [text, setText] = useState('');
  const [score, setScore] = useState(null);
  const [intervention, setIntervention] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Fetch children on mount safely
  useEffect(() => {
    fetchChildren()
      .then(res => {
        // Handle both res.data or res.data.data structures
        const data = res?.data?.data || res?.data || [];
        setChildren(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Failed to fetch children:", err));
  }, []);

  const analyze = async () => {
    if (!selectedChild || !text.trim()) {
      alert("Please select a child and enter some text.");
      return;
    }

    setLoading(true);
    try {
      // ✅ FIX: Send as a single payload object as per api.js
      const payload = {
        childId: selectedChild._id,
        text: text.trim()
      };

      const res = await getBondingScore(payload);
      
      console.log("Bonding API response:", res.data);

      // Score 0.8 ya 80 dono ho sakte hain, isliye normalization
      let rawScore = res.data?.score ?? 0;
      if (rawScore > 1) rawScore = rawScore / 100; // 80 -> 0.8 conversion

      setScore(rawScore);
      setIntervention(res.data?.intervention || res.data?.tip || '');
      
    } catch (err) {
      console.error("Bonding API error:", err);
      // 🔥 Fallback: Error aane par user ko purani screen na dikhe, default values de do
      setScore(0.5);
      setIntervention("Try to spend more uninterrupted time playing together.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bonding-card">
      <h3 className="bonding-title">🤝 Parent–Child Bonding Score</h3>

      <select
        className="bonding-dropdown"
        value={selectedChild?._id || ''}
        onChange={e => {
          const child = children.find(c => c._id === e.target.value);
          setSelectedChild(child || null);
        }}
      >
        <option value="">👶 Select your child</option>
        {children.map(child => (
          <option key={child._id} value={child._id}>
            {child.name} ({child.age_months || child.age} months)
          </option>
        ))}
      </select>

      <textarea
        className="bonding-textarea"
        placeholder="Describe a recent interaction with your child (e.g. We played with blocks today...)"
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <button 
        className="bonding-button" 
        onClick={analyze} 
        disabled={loading || !selectedChild || !text.trim()}
      >
        {loading ? '⏳ Analyzing…' : '✅ Get bonding score'}
      </button>

      {score !== null && (
        <div className="bonding-results-area animate-fade-in">
          <p className="bonding-result">
            Your bonding score: <strong>{Math.round(score * 100)}</strong>/100
          </p>

          <div className="bonding-progress">
            <div 
              className="bonding-progress-fill" 
              style={{ 
                width: `${Math.round(score * 100)}%`,
                backgroundColor: score >= 0.7 ? '#4caf50' : score >= 0.4 ? '#ff9800' : '#f44336'
              }}
            />
          </div>

          <p className="bonding-emoji">
            {score >= 0.8 && '🥰 Excellent bonding!'}
            {score >= 0.6 && score < 0.8 && '😊 Good bonding'}
            {score >= 0.4 && score < 0.6 && '😐 Moderate bonding'}
            {score < 0.4 && '😢 Needs more connection'}
          </p>

          <MicroIntervention score={score} backendTip={intervention} />
        </div>
      )}
    </div>
  );
};

export default BondingScore;