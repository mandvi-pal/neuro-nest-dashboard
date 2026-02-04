import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import './soundGame.css';

// ✅ Sirf wahi sounds rakhe hain jo aapke paas available hain
const allSounds = [
  { label: "Dog Bark", file: "/sound/free-dog-bark-419014.mp3", correct: "Dog", category: "Animal", icon: "🐶" },
  { label: "Bell Ring", file: "/sound/notification-bell-sound-1-376885.mp3", correct: "Bell", category: "Object", icon: "🔔" },
  { label: "Clap", file: "/sound/clapping-6474.mp3", correct: "Clap", category: "Human", icon: "👏" }
];

function SoundGame({ childId, onComplete }) {
  const [shuffledSounds, setShuffledSounds] = useState([]); // Questions sequence
  const [current, setCurrent] = useState(0);
  const [localScore, setLocalScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [displayOptions, setDisplayOptions] = useState([]); // Dynamic Buttons

  // ✅ Shuffle logic for sounds and options on load
  useEffect(() => {
    const gameSounds = [...allSounds].sort(() => Math.random() - 0.5);
    setShuffledSounds(gameSounds);
    
    // Pehle question ke liye options shuffle karein
    const options = [...gameSounds].sort(() => Math.random() - 0.5);
    setDisplayOptions(options);
  }, []);

  // ✅ Jab bhi 'current' question badle, options ko shuffle karein
  useEffect(() => {
    if (shuffledSounds.length > 0) {
      const options = [...shuffledSounds].sort(() => Math.random() - 0.5);
      setDisplayOptions(options);
    }
  }, [current, shuffledSounds]);

  const handlePlay = () => {
    if (!shuffledSounds[current]) return;
    
    const audio = new Audio(shuffledSounds[current].file);
    audio.play().catch(err => console.error("❌ Error playing sound:", err));

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Listen carefully, what sound is this?");
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const handleChoice = async (choice) => {
    if (feedback) return; // Prevent multiple clicks

    const isCorrect = choice === shuffledSounds[current].correct;
    const updatedScore = localScore + (isCorrect ? 1 : 0);

    if (isCorrect) {
      setLocalScore(prev => prev + 1);
      setFeedback(`🎉 Correct! That was a ${choice}.`);
    } else {
      setFeedback(`❌ Oops! That was a ${shuffledSounds[current].correct}.`);
    }

    // Backend save logic
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/screening/saveSound`, {
        childId,
        sound: shuffledSounds[current].label,
        category: shuffledSounds[current].category,
        correct: isCorrect,
        timestamp: new Date()
      });
    } catch (err) {
      console.error("❌ Error saving sound log:", err.message);
    }

    // Next Question or Complete
    setTimeout(() => {
      if (current < shuffledSounds.length - 1) {
        setCurrent(prev => prev + 1);
        setFeedback('');
      } else {
        setCompleted(true);
        if (onComplete) onComplete(updatedScore);
        if (updatedScore >= 2) setShowCelebration(true);
      }
    }, 2000);
  };

  if (shuffledSounds.length === 0) return <div className="loader">Tuning Instruments...</div>;

  return (
    <div className="sound-game-wrapper">
      <h3 className="game-title">🔊 Sound Recognition</h3>

      {!completed ? (
        <div className="game-body">
          <div className="play-section">
            <p className="instruction-text">Tap the button to hear:</p>
            <button className="sound-play-btn" onClick={handlePlay} disabled={!!feedback}>
              <span className="play-icon">▶️</span> Play Sound
            </button>
          </div>

          <div className="sound-options-grid">
            {/* ✅ Options ab dynamic hain aur har baar shuffle hoti hain */}
            {displayOptions.map((item) => (
              <button
                key={item.correct}
                onClick={() => handleChoice(item.correct)}
                className={`sound-option-card ${feedback && item.correct === shuffledSounds[current].correct ? 'highlight-correct' : ''}`}
                disabled={!!feedback}
              >
                <span className="option-emoji">{item.icon}</span>
                <span className="option-label">{item.correct}</span>
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`feedback-toast ${feedback.includes('🎉') ? 'success' : 'error'}`}>
              {feedback}
            </div>
          )}

          <div className="progress-section">
            <div className="progress-bar-container">
              <div 
                className="progress-fill-dynamic" 
                style={{ width: `${((current + 1) / shuffledSounds.length) * 100}%` }}
              ></div>
            </div>
            <p className="progress-status">Sound {current + 1} of {shuffledSounds.length}</p>
          </div>
        </div>
      ) : (
        <div className="sound-result-card">
          <div className="result-emoji">{localScore >= 2 ? "🎖️" : "💡"}</div>
          <h3>Screening Finished!</h3>
          <p className="final-score-text">Final Score: {localScore} / {shuffledSounds.length}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>Play Again</button>
          {showCelebration && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />}
        </div>
      )}
    </div>
  );
}

export default SoundGame;