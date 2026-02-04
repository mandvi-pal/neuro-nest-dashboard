import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import './memoryMatch.css';

const initialCards = [
  { id: 1, value: '🐶', matched: false },
  { id: 2, value: '🐶', matched: false },
  { id: 3, value: '🐱', matched: false },
  { id: 4, value: '🐱', matched: false },
  { id: 5, value: '🦁', matched: false },
  { id: 6, value: '🦁', matched: false }
];

const shuffleCards = () => {
  return [...initialCards]
    .sort(() => Math.random() - 0.5)
    .map(card => ({ ...card }));
};

const MemoryMatch = ({ onScoreUpdate }) => {
  const [cards, setCards] = useState(shuffleCards());
  const [flipped, setFlipped] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const cheerRef = useRef(null);
  const width = 800;
  const height = 600;

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;

      if (
        typeof first === 'number' &&
        typeof second === 'number' &&
        cards[first] &&
        cards[second]
      ) {
        const isMatch = cards[first].value === cards[second].value;

        setTimeout(() => {
          if (isMatch) {
            const updated = cards.map((card, idx) =>
              idx === first || idx === second ? { ...card, matched: true } : card
            );
            setCards(updated);
            setMatchedCount(prev => prev + 1);

            const newScore = score + 1;
            setScore(newScore);
            if (typeof onScoreUpdate === 'function') {
              onScoreUpdate(newScore);
            }
          }
          setFlipped([]);
        }, 800); // ✅ Delay match logic so UI stays visible
      }
    }
  }, [flipped, cards, score, onScoreUpdate]);

  useEffect(() => {
    if (matchedCount === initialCards.length / 2) {
      setShowConfetti(true);
      try {
        cheerRef.current = new Audio('/yay-6326.mp3'); // ✅ correct path
        cheerRef.current.play().catch(err => console.warn('Audio play failed:', err));
      } catch (err) {
        console.warn('Audio error:', err);
      }
    }
  }, [matchedCount]);

  const handleClick = (index) => {
    if (
      flipped.length < 2 &&
      !cards[index].matched &&
      !flipped.includes(index)
    ) {
      setFlipped([...flipped, index]);
    }
  };

  const restartGame = () => {
    setCards(shuffleCards());
    setFlipped([]);
    setMatchedCount(0);
    setScore(0);
    setShowConfetti(false);
    if (typeof onScoreUpdate === 'function') {
      onScoreUpdate(0);
    }
  };

  return (
    <div className="memory-container">
      <h2>🧠 Memory Match Game</h2>
      <p>Score: {score}</p>

      {/* 🎯 Emoji Preview Panel */}
      <div className="emoji-preview">
        <p>Match these emojis:</p>
        <div className="emoji-list">
          {[...new Set(initialCards.map(card => card.value))].map((emoji, idx) => (
            <span key={idx} className="emoji-item">{emoji}</span>
          ))}
        </div>
      </div>

      {/* 🎉 Confetti Celebration */}
      {showConfetti && <Confetti width={width} height={height} />}

      {/* 🧩 Game Grid */}
      <div className="memory-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${flipped.includes(index) || card.matched ? 'flipped' : ''}`}
            onClick={() => handleClick(index)}
          >
            {flipped.includes(index) || card.matched ? card.value : '🧩'}
          </div>
        ))}
      </div>

      {/* ✅ Success Message */}
      {matchedCount === initialCards.length / 2 && (
        <p className="success-msg">🎉 All pairs matched!</p>
      )}

      {/* 🔄 Restart Button */}
      <button className="restart-btn" onClick={restartGame}>🔄 Restart Game</button>
    </div>
  );
};

export default MemoryMatch;
