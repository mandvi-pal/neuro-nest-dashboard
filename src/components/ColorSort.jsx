import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import './colorSort.css';

const levels = [
  [
    { id: 1, color: '🔴', group: 'Red' },
    { id: 2, color: '🔵', group: 'Blue' },
    { id: 3, color: '🟢', group: 'Green' },
    { id: 4, color: '🔴', group: 'Red' },
    { id: 5, color: '🔵', group: 'Blue' },
    { id: 6, color: '🟢', group: 'Green' }
  ],
  [
    { id: 7, color: '🟡', group: 'Yellow' },
    { id: 8, color: '🟣', group: 'Purple' },
    { id: 9, color: '🔴', group: 'Red' },
    { id: 10, color: '🔵', group: 'Blue' }
  ]
];

const ColorSort = ({ childId, onScoreUpdate }) => {
  const [level, setLevel] = useState(0);
  const [items, setItems] = useState(levels[0]);
  const [score, setScore] = useState(0);
  const [sorted, setSorted] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const cheerRef = useRef(null);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (score === items.length) {
      setShowConfetti(true);
      try {
        cheerRef.current = new Audio('/yay-6326.mp3');
        cheerRef.current.play().catch(err => console.warn('Audio play failed:', err));
      } catch (err) {
        console.warn('Audio error:', err);
      }
      setTimeout(() => setShowConfetti(false), 3000);

      // Next level unlock
      if (level < levels.length - 1) {
        setTimeout(() => {
          setLevel(level + 1);
          setItems(levels[level + 1]);
          setScore(0);
          setSorted([]);
        }, 2000);
      }
    }
  }, [score, items.length, level]);

  const handleDrop = async (item, targetGroup) => {
    const isCorrect = item.group === targetGroup && !sorted.includes(item.id);
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      setSorted(prev => [...prev, item.id]);
      if (typeof onScoreUpdate === 'function') onScoreUpdate(newScore);
    }

    // Log attempt to backend
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/screening/saveColorSort`, {
        childId,
        color: item.color,
        targetGroup,
        correct: isCorrect,
        timestamp: new Date()
      });
    } catch (err) {
      console.error("❌ Error saving color sort log:", err.response?.data || err.message);
    }
  };

  const handleRestart = () => {
    setLevel(0);
    setItems(levels[0]);
    setScore(0);
    setSorted([]);
    setShowConfetti(false);
    if (typeof onScoreUpdate === 'function') onScoreUpdate(0);
  };

  return (
    <div className="color-sort-game">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
      <h3>🎨 Drag the colors into the correct bins</h3>
      <p>Level {level + 1} / {levels.length}</p>

      <div className="bins">
        {[...new Set(items.map(i => i.group))].map(group => (
          <div key={group} className="bin">
            <h4>{group} Bin</h4>
            <div
              className="drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const itemId = parseInt(e.dataTransfer.getData('text/plain'));
                const item = items.find(i => i.id === itemId);
                if (item) handleDrop(item, group);
              }}
            >
              Drop here
            </div>
          </div>
        ))}
      </div>

      <div className="items">
        {items.map(item => (
          <div
            key={item.id}
            className={`color-item ${sorted.includes(item.id) ? 'sorted' : ''}`}
            draggable={!sorted.includes(item.id)}
            onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
          >
            {item.color}
          </div>
        ))}
      </div>

      <p>Score: {score} / {items.length}</p>
      {score === items.length && level === levels.length - 1 && (
        <>
          <p className="success-msg">🎉 All levels complete!</p>
          <button className="restart-btn" onClick={handleRestart}>🔄 Play Again</button>
        </>
      )}
    </div>
  );
};

export default ColorSort;
