import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import './soundEmotion.css';

const sounds = [
  { emoji: '👏', label: 'Clap', file: 'applause-383901.mp3' },
  { emoji: '😢', label: 'Cry', file: 'crying-338200.mp3' },
  { emoji: '😂', label: 'Laugh', file: 'kids-laugh-45357.mp3' },
  { emoji: '😡', label: 'Angry', file: 'angry-beast-6172.mp3' },
  { emoji: '😴', label: 'Sleep', file: 'snoring-8486.mp3' }
];

const SoundEmotion = ({ onScoreUpdate }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  
  // Ek hi audio instance use karenge taaki control asaan ho
  const audioRef = useRef(new Audio());
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Cleanup jab component unmount ho
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  useEffect(() => {
    if (gameStarted && currentSound === null) {
      playNextSound();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (score === sounds.length && sounds.length > 0) {
      stopAudio();
      setShowConfetti(true);
      const cheer = new Audio('/yay-6326.mp3');
      cheer.play().catch(err => console.warn('Cheer sound failed:', err));
    }
  }, [score]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null; // Listener hatao
      setIsSoundPlaying(false);
    }
  };

  const playNextSound = () => {
    stopAudio();

    // Pehle se bache hue sounds select karein (jo abhi tak sahi nahi hue)
    // Ya simply random shuffle logic:
    const remaining = sounds.filter(s => s.label !== currentSound);
    const next = remaining[Math.floor(Math.random() * remaining.length)];

    if (!next) return;

    setCurrentSound(next.label);
    setIsSoundPlaying(true);

    // Audio source update karein
    audioRef.current.src = `/sound/${next.file}`;
    
    audioRef.current.onended = () => {
      setIsSoundPlaying(false);
    };

    audioRef.current.play().catch(err => {
      console.warn('Playback error:', err);
      setIsSoundPlaying(false);
    });
  };

  const handleChoice = (label) => {
    if (!gameStarted || !currentSound) return;

    // Jaise hi user click kare, snoring ya koi bhi sound turant band
    stopAudio();
    setAttempted(prev => prev + 1);

    if (label === currentSound) {
      const newScore = score + 1;
      setScore(newScore);
      if (typeof onScoreUpdate === 'function') {
        onScoreUpdate(newScore);
      }
    }

    // 0.5 sec ka gap taaki screen update mehsoos ho
    setTimeout(() => {
      if (score + 1 < sounds.length) {
        playNextSound();
      }
    }, 500);
  };

  const handleReplay = () => {
    if (!currentSound || isSoundPlaying) return;
    setIsSoundPlaying(true);
    audioRef.current.play().catch(() => setIsSoundPlaying(false));
  };

  const handleRestart = () => {
    stopAudio();
    setScore(0);
    setAttempted(0);
    setShowConfetti(false);
    setCurrentSound(null);
    setGameStarted(false);
    if (typeof onScoreUpdate === 'function') {
      onScoreUpdate(0);
    }
  };

  return (
    <div className="sound-emotion-game">
      {showConfetti && <Confetti width={width} height={height} />}
      
      <div className="game-container">
        <h3>🔊 Listen and match the correct emotion</h3>

        {!gameStarted ? (
          <button className="start-btn" onClick={() => setGameStarted(true)}>
            ▶️ Start Game
          </button>
        ) : (
          <>
            <div className="status-area">
              <p className="match-prompt">
                {isSoundPlaying ? "👂 Listening..." : "🎧 Which emoji matches the sound?"}
              </p>

              {!isSoundPlaying && score < sounds.length && (
                <button className="replay-btn" onClick={handleReplay}>
                  🔁 Replay Sound
                </button>
              )}
            </div>

            <div className="sound-grid">
              {sounds.map((sound, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(sound.label)}
                  disabled={score === sounds.length}
                  className={`choice-btn ${isSoundPlaying ? 'playing' : ''}`}
                >
                  <span className="emoji-large">{sound.emoji}</span>
                </button>
              ))}
            </div>

            <div className="score-board">
              <p>✅ Score: <strong>{score} / {sounds.length}</strong></p>
              <p>🎯 Attempted: {attempted}</p>
            </div>

            {score === sounds.length && (
              <div className="completion-area">
                <p className="success-msg">🎉 Amazing! You matched all emotions!</p>
                <button className="restart-btn" onClick={handleRestart}>🔄 Play Again</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SoundEmotion;