import React, { useState } from 'react';
import '../pages/interactive.css'; 

import ColorSort from '../components/ColorSort';
import MemoryMatch from '../components/MemoryMatch';
import SoundEmotion from '../components/SoundEmotion';
import BrainwaveBattle from '../components/BrainwaveBattle';

const Interactive = () => {
  // State to manage scores for all games
  const [scores, setScores] = useState({
    color: 0,
    memory: 0,
    sound: 0,
    brainwave: 0 
  });

  // ✅ Updated function to handle live score updates
  const handleScoreUpdate = (game, score) => {
    setScores(prev => ({ 
      ...prev, 
      [game]: score 
    }));
  };

  return (
    <div className="interactive-game">
      <header className="game-header">
        <h2>🎮 Interactive Game Zone</h2>
        <p>Challenge your brain and track your progress!</p>
      </header>

      <div className="games-grid">
        {/* 🧠 Brainwave Battle */}
        <section className="game-section">
          <div className="game-card-header">
            <h3>⚡ Brainwave Battle</h3>
            <span className="live-badge">Live Score: {scores.brainwave}</span>
          </div>
          <BrainwaveBattle onScoreUpdate={(score) => handleScoreUpdate('brainwave', score)} />
        </section>

        {/* 🎨 Color Sort */}
        <section className="game-section">
          <div className="game-card-header">
            <h3>🎨 Color Sort Challenge</h3>
            <span className="live-badge">Live Score: {scores.color}</span>
          </div>
          <ColorSort onScoreUpdate={(score) => handleScoreUpdate('color', score)} />
        </section>

        {/* 🧠 Memory Match */}
        <section className="game-section">
          <div className="game-card-header">
            <h3>🧠 Memory Match Game</h3>
            <span className="live-badge">Live Score: {scores.memory}</span>
          </div>
          <MemoryMatch onScoreUpdate={(score) => handleScoreUpdate('memory', score)} />
        </section>

        {/* 🔊 Sound Emotion Match */}
        <section className="game-section">
          <div className="game-card-header">
            <h3>🔊 Sound Emotion Match</h3>
            <span className="live-badge">Live Score: {scores.sound}</span>
          </div>
          <SoundEmotion onScoreUpdate={(score) => handleScoreUpdate('sound', score)} />
        </section>
      </div>

      {/* 📊 Final Score Summary Section */}
      <footer className="score-summary-footer">
        <div className="summary-card">
          <h4>📊 LIVE TOTAL SCORES</h4>
          <div className="score-grid">
            <div className="score-item">
              <span className="icon">⚡</span>
              <span className="label">Brainwave</span>
              <span className="value">{scores.brainwave}</span>
            </div>
            <div className="score-item">
              <span className="icon">🎨</span>
              <span className="label">Color Sort</span>
              <span className="value">{scores.color}</span>
            </div>
            <div className="score-item">
              <span className="icon">🧠</span>
              <span className="label">Memory</span>
              <span className="value">{scores.memory}</span>
            </div>
            <div className="score-item">
              <span className="icon">🔊</span>
              <span className="label">Sound</span>
              <span className="value">{scores.sound}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Interactive;