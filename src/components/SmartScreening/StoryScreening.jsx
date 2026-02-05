import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import './storyScreening.css';

// 1. Badi Question Bank (Aap isme aur stories add kar sakte hain)
const allStoryData = [
  { scene: "🐰 Bunny drops his toy in the park.", prompt: "What should Bunny do?", options: ["Cry loudly", "Ask for help", "Blame his friend"], correct: 1, skill: "Problem-solving" },
  { scene: "🐻 Bear offers to help Bunny find his way.", prompt: "What should Bunny say?", options: ["No, go away", "Thank you, Bear!", "Ignore him"], correct: 1, skill: "Gratitude" },
  { scene: "🦊 Fox finds a toy but it belongs to Bunny.", prompt: "What should Bunny do?", options: ["Snatch it", "Say 'That’s mine' calmly", "Start fighting"], correct: 1, skill: "Conflict resolution" },
  { scene: "🐘 Elephant accidentally steps on Bunny's flower.", prompt: "How should Bunny react?", options: ["Forgive him", "Get very angry", "Kick the elephant"], correct: 0, skill: "Empathy" },
  { scene: "🐯 Tiger is playing alone and looks sad.", prompt: "What can Bunny do?", options: ["Laugh at him", "Ask him to play", "Run away"], correct: 1, skill: "Social Bonding" }
];

function StoryScreening({ childId, onComplete }) {
  const [shuffledStories, setShuffledStories] = useState([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  // 2. Shuffle Logic: Page load par questions randomize honge
  useEffect(() => {
    const randomStories = [...allStoryData]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3); // Har baar sirf 3 unique questions
    setShuffledStories(randomStories);
  }, []);

  const current = shuffledStories[step];

  // 3. Optimized TTS (Voice Output)
  const speak = (text) => {
    window.speechSynthesis.cancel(); // Purani awaaz roko
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9; // Thoda slow taaki bacha samajh sake
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (shuffledStories.length > 0 && !finished) {
      speak(`${current.scene}. ${current.prompt}`);
    }
    // Cleanup: Jab component band ho toh awaaz bhi band ho jaye
    return () => window.speechSynthesis.cancel();
  }, [step, shuffledStories, finished]);

  // 4. Voice Recognition (Voice Input)
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const matchedIndex = current.options.findIndex(opt =>
        transcript.includes(opt.toLowerCase())
      );
      
      if (matchedIndex !== -1) {
        handleChoice(matchedIndex);
      } else {
        setFeedback("❌ Didn't catch that, try again!");
        speak("I didn't catch that, can you try again?");
      }
    };
    recognition.start();
  };

  const handleChoice = async (index) => {
    const isCorrect = index === current.correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback("🎉 Great choice!");
    } else {
      setFeedback("❌ Think again, Bunny!");
    }

    // Save to Database
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/screening/saveStory`, {
        childId,
        scene: current.scene,
        choice: current.options[index],
        skill: current.skill,
        correct: isCorrect,
        timestamp: new Date()
      });
    } catch (err) {
      console.error("❌ Save Error:", err.message);
    }

    // Next Step logic
    if (step < shuffledStories.length - 1) {
      setTimeout(() => {
        setStep(prev => prev + 1);
        setFeedback('');
      }, 1500);
    } else {
      setFinished(true);
      const finalScore = score + (isCorrect ? 1 : 0);
      if (onComplete) onComplete(finalScore);
      if (finalScore >= 2) setShowCelebration(true);
    }
  };

  if (shuffledStories.length === 0) return <div className="loading">Loading Stories...</div>;

  return (
    <div className="story-screening">
      <div className="story-header">
        <h3>📖 Story Screening</h3>
        <span className="badge">Voice Enabled</span>
      </div>

      {!finished ? (
        <div className="story-body">
          <div className="scene-card">
            <p className="scene-text">{current.scene}</p>
          </div>
          <p className="prompt-text">{current.prompt}</p>
          
          <div className="options">
            {current.options.map((opt, i) => (
              <button key={i} onClick={() => handleChoice(i)} className="story-option">
                {opt}
              </button>
            ))}
          </div>

          <div className="action-area">
            <button className="voice-btn-large" onClick={startListening}>
              🎙️ Speak Answer
            </button>
            {feedback && <p className={`story-feedback ${feedback.includes('🎉') ? 'success' : 'error'}`}>{feedback}</p>}
          </div>

          <div className="progress-container">
             <span className="progress-label">Progress: {step + 1} / {shuffledStories.length}</span>
             <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${((step + 1) / shuffledStories.length) * 100}%` }}></div>
             </div>
          </div>
        </div>
      ) : (
        <div className="completion-message">
          <div className="result-icon">🌈</div>
          <h3>Story Complete!</h3>
          <p className="score-summary">You scored <strong>{score}</strong> / {shuffledStories.length}</p>
          <div className="recommendation">
            {score >= 2 
              ? "🌟 Excellent! Empathy and problem-solving skills are strong." 
              : "📚 Good effort! Let's read more stories together."}
          </div>
          <button className="btn-play-again" onClick={() => window.location.reload()}>
            Play New Stories
          </button>
          {showCelebration && <Confetti />}
        </div>
      )}
    </div>
  );
}

export default StoryScreening;