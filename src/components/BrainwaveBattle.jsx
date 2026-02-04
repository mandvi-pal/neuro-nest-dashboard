import React, { useState, useEffect, useCallback } from 'react';
import './BrainwaveBattle.css';

const BrainwaveBattle = ({ onScoreUpdate }) => {
  const [gameStage, setGameStage] = useState('menu'); // Stages: 'menu', 'playing', 'result'
  const [difficulty, setDifficulty] = useState('Medium');
  const [currentLetter, setCurrentLetter] = useState('');
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Level configuration
  const config = {
    Low: { time: 15, optionsCount: 2, label: 'Easy' },
    Medium: { time: 10, optionsCount: 4, label: 'Normal' },
    High: { time: 7, optionsCount: 6, label: 'Pro' }
  };

  const generateQuestion = useCallback(() => {
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    setCurrentLetter(randomLetter);
    
    let choices = [randomLetter];
    const count = config[difficulty].optionsCount;
    
    while (choices.length < count) {
      let l = letters[Math.floor(Math.random() * letters.length)];
      if (!choices.includes(l)) choices.push(l);
    }
    setOptions(choices.sort(() => Math.random() - 0.5));
  }, [difficulty, letters]);

  const startGame = (level) => {
    setDifficulty(level);
    setScore(0);
    setTimeLeft(config[level].time);
    setGameStage('playing');
    generateQuestion();
  };

  useEffect(() => {
    let timer;
    if (gameStage === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameStage === 'playing') {
      setGameStage('result');
      if (onScoreUpdate) onScoreUpdate(score);
    }
    return () => clearInterval(timer);
  }, [gameStage, timeLeft, score, onScoreUpdate]);

  const handleAnswer = (choice) => {
    if (choice === currentLetter) {
      setScore(prev => prev + 10);
      generateQuestion();
    } else {
      // Wrong answer penalty for High level
      if (difficulty === 'High') setTimeLeft(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="brainwave-container">
      <h2 className="brainwave-title">Brainwave Battle</h2>

      {/* --- LEVEL SELECTION MENU --- */}
      {gameStage === 'menu' && (
        <div className="difficulty-menu">
          <p className="menu-text">Choose your challenge level:</p>
          <div className="diff-buttons">
            <button className="lvl-btn low" onClick={() => startGame('Low')}>🟢 Low (Easy)</button>
            <button className="lvl-btn med" onClick={() => startGame('Medium')}>🟡 Medium</button>
            <button className="lvl-btn high" onClick={() => startGame('High')}>🔴 High (Hard)</button>
          </div>
        </div>
      )}

      {/* --- GAMEPLAY AREA --- */}
      {gameStage === 'playing' && (
        <div className="game-play-area">
          <div className="game-status-bar">
            <span className="lvl-badge">{difficulty}</span>
            <span className={`timer-text ${timeLeft < 4 ? 'pulse-red' : ''}`}>⏱ {timeLeft}s</span>
          </div>
          
          <div className="target-letter-circle">
            {currentLetter}
          </div>

          <div className={`options-grid-dynamic opt-count-${config[difficulty].optionsCount}`}>
            {options.map(opt => (
              <button key={opt} className="game-choice-btn" onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
          <div className="score-badge">Current Score: {score}</div>
        </div>
      )}

      {/* --- FINAL RESULT SCREEN --- */}
      {gameStage === 'result' && (
        <div className="result-screen">
          <h3 className="finish-text">TIME EXPIRED! 🏁</h3>
          <div className="final-score-display">
            <span className="final-label">Final Score</span>
            <div className="big-score">{score}</div>
            <span className="diff-tag">Level: {difficulty}</span>
          </div>
          <button className="restart-btn" onClick={() => setGameStage('menu')}>PLAY AGAIN</button>
        </div>
      )}
    </div>
  );
};

export default BrainwaveBattle;