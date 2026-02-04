import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './emotionGame.css';

function EmotionGame({ childId, onComplete }) {
  
  const allQuestions = [
    { question: "Which face is happy?", options: ["😊", "😢", "😠", "😱"], answer: 0, type: "happy" },
    { question: "Which face is angry?", options: ["😐", "😠", "😴", "😇"], answer: 1, type: "angry" },
    { question: "Which face is scared?", options: ["😱", "😄", "😡", "😢"], answer: 0, type: "scared" },
    { question: "Which face is sad?", options: ["🤣", "😭", "😎", "🤩"], answer: 1, type: "sad" },
    { question: "Which face is surprised?", options: ["😴", "🤔", "😲", "🙄"], answer: 2, type: "surprise" },
    { question: "Which face is sleepy?", options: ["😋", "😴", "🥳", "😭"], answer: 1, type: "sleepy" },
    { question: "Which face is thinking?", options: ["🤔", "🤠", "🤢", "🤫"], answer: 0, type: "neutral" }
  ];

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [localScore, setLocalScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState("");

  
  useEffect(() => {
    const shuffle = [...allQuestions]
      .sort(() => Math.random() - 0.5) 
      .slice(0, 3); 
    setShuffledQuestions(shuffle);
  }, []);

  const handleSubmit = async () => {
    const currentQ = shuffledQuestions[current];
    const correct = selected === currentQ.answer;
    const updatedScore = localScore + (correct ? 1 : 0);
    
    setLocalScore(updatedScore);
    setFeedback(correct ? "🎉 Great job!" : "❌ Try again!");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/emotion`, {
        childId,
        emotionLog: {
          type: currentQ.type,
          correct,
          timestamp: Date.now()
        }
      });
    } catch (err) {
      console.error("Emotion log failed:", err);
    }

    if (current < shuffledQuestions.length - 1) {
      setTimeout(() => {
        setCurrent(current + 1);
        setSelected(null);
        setFeedback("");
      }, 1000);
    } else {
      setCompleted(true);
      if (onComplete) {
        onComplete(updatedScore, {
          emotionLog: {
            type: currentQ.type,
            correct,
            timestamp: Date.now()
          }
        });
      }
    }
  };

 
  if (shuffledQuestions.length === 0) return <div>Loading Game...</div>;

  return (
    <div className="emotion-game-wrapper">
      <div className="game-card-clean">
        <h3 className="game-title">😊 Emotion Matching</h3>

        {!completed ? (
          <div className="game-content">
            <p className="emotion-question">{shuffledQuestions[current].question}</p>
            
            <div className="emotion-options">
              {shuffledQuestions[current].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`emotion-option-btn ${selected === i ? 'selected' : ''}`}
                >
                  <span className="emoji-icon">{opt}</span>
                </button>
              ))}
            </div>

            <button
              className="emotion-submit-btn"
              onClick={handleSubmit}
              disabled={selected === null}
            >
              Submit Answer
            </button>

            {feedback && (
              <p className={`emotion-feedback ${feedback.includes('🎉') ? 'success' : 'error'}`}>
                {feedback}
              </p>
            )}

            <div className="game-progress">
              <div className="progress-text">Progress: {current + 1} / {shuffledQuestions.length}</div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${((current + 1) / shuffledQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="emotion-result-screen">
            <div className="result-icon">🏆</div>
            <h4>Game Finished!</h4>
            <p className="final-score">Final Score: <strong>{localScore} / {shuffledQuestions.length}</strong></p>
            <button className="btn-play-again" onClick={() => window.location.reload()}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmotionGame;