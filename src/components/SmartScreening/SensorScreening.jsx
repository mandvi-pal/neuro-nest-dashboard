import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import './SensorScreening.css';

const emotionBadgeMap = {
  happy: { label: 'Joy Explorer', emoji: '🎉' },
  sad: { label: 'Emotion Aware', emoji: '💙' },
  angry: { label: 'Fire Tamer', emoji: '🔥' },
  surprise: { label: 'Curious Mind', emoji: '😲' },
  neutral: { label: 'Zen Master', emoji: '😐' },
};

const normalizeScore = (emotion) => {
  const scores = { happy: 5, surprise: 4, neutral: 3, sad: 2, angry: 1 };
  return scores[emotion] || 3;
};

const SensorScreening = ({ onComplete }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [webcamActive, setWebcamActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setWebcamActive(true);
      }
    } catch (err) {
      setError('⚠️ Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
  };

  const captureFrame = () => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const detectEmotion = async () => {
    const image = captureFrame();
    if (!image) return setError('🚫 Failed to capture image');

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${apiUrl}/api/emotion`, {
        image,
        childId: "demo-child"
      });

      const detected = res.data?.emotions?.[0]?.dominant_emotion?.toLowerCase();
      if (!detected) throw new Error('No face detected');

      const badgeInfo = emotionBadgeMap[detected] || { label: 'Explorer', emoji: '🤖' };
      const score = normalizeScore(detected);
      
      const resultData = {
        emotion: detected,
        badge: badgeInfo.label,
        emoji: badgeInfo.emoji,
        score: score,
        time: new Date().toLocaleTimeString()
      };

      setCurrentResult(resultData);
      setHistory(prev => [resultData, ...prev].slice(0, 5));
      setShowResult(true); // Isse result screen ruk jayegi
    } catch (err) {
      setError('🚫 Detection failed. Make sure your face is visible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sensor-container">
      <div className="sensor-card">
        <h2 className="sensor-title">🎥 AI Emotion Screening</h2>
        
        <div className="viewfinder-container">
          <video ref={videoRef} autoPlay playsInline muted className={`webcam-view ${showResult ? 'blur' : ''}`} />
          
          {/* Result Overlay - Jab detect ho jaye */}
          {showResult && currentResult && (
            <div className="result-overlay">
              <div className="result-popout">
                <span className="result-emoji">{currentResult.emoji}</span>
                <h3>{currentResult.badge}</h3>
                <p>Detected Emotion: <strong>{currentResult.emotion.toUpperCase()}</strong></p>
                <div className="result-btns">
                  <button className="btn-secondary" onClick={() => setShowResult(false)}>Try Again</button>
                  <button className="btn-primary" onClick={() => onComplete?.(currentResult.score)}>Continue</button>
                </div>
              </div>
            </div>
          )}

          {loading && <div className="loader-overlay">🔍 Analyzing Face...</div>}
        </div>

        {!showResult && (
          <div className="sensor-actions">
            <button className="capture-btn" onClick={detectEmotion} disabled={!webcamActive || loading}>
              {loading ? 'Processing...' : 'Capture Emotion'}
            </button>
            {error && <p className="error-msg">{error}</p>}
          </div>
        )}

        {/* Emotion Logs Section */}
        <div className="logs-section">
          <h4>🕒 Recent Emotion Logs</h4>
          <div className="logs-list">
            {history.length === 0 ? (
              <p className="empty-text">No logs yet. Take a scan!</p>
            ) : (
              history.map((log, i) => (
                <div key={i} className="log-card">
                  <span className="log-emoji">{log.emoji}</span>
                  <div className="log-details">
                    <span className="log-emotion">{log.emotion}</span>
                    <span className="log-time">{log.time}</span>
                  </div>
                  <span className="log-score">+{log.score}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorScreening;