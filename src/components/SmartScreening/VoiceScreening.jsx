import React, { useState, useEffect, useRef } from 'react';
import './voiceScreening.css';

const allVoicePrompts = [
  { question: "How do you feel when your toy breaks?", expected: "sad", options: ["sad", "happy", "angry"] },
  { question: "How do you feel when you win a game?", expected: "happy", options: ["sad", "happy", "loved"] },
  { question: "How do you feel when someone hugs you?", expected: "loved", options: ["angry", "loved", "happy"] },
  { question: "How do you feel when it's dark outside?", expected: "scared", options: ["scared", "brave", "happy"] },
  { question: "How do you feel when you share your food?", expected: "kind", options: ["angry", "kind", "sad"] },
  { question: "How do you feel when you go to the park?", expected: "excited", options: ["excited", "sleepy", "bored"] }
];

function VoiceScreening({ onComplete }) {
  const [shuffledPrompts, setShuffledPrompts] = useState([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);

  const recognitionRef = useRef(null);

  // 1. Initialize Questions
  useEffect(() => {
    const randomSet = [...allVoicePrompts]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setShuffledPrompts(randomSet);
  }, []);

  // 2. Setup Speech Recognition with Safety Checks
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      setIsBrowserSupported(false);
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const said = event.results[0][0].transcript.toLowerCase();
        setTranscript(said);
        setListening(false);
        handleAnswer(said);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Error:", event.error);
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (!isBrowserSupported) {
      alert("Voice recognition is not supported in your browser. Please use buttons.");
      return;
    }
    if (listening) return;

    try {
      setTranscript('');
      setListening(true);
      recognitionRef.current.start();
    } catch (e) {
      console.error("Mic error:", e);
      setListening(false);
    }
  };

  const handleAnswer = (answer) => {
    if (finished) return;

    const currentPrompt = shuffledPrompts[step];
    const isCorrect = answer.toLowerCase().includes(currentPrompt.expected.toLowerCase());
    
    // Calculate new score
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (step < shuffledPrompts.length - 1) {
      setTimeout(() => {
        setStep(prev => prev + 1);
        setTranscript('');
      }, 800);
    } else {
      setFinished(true);
      // Final call to onComplete
      if (onComplete) onComplete(newScore);
    }
  };

  if (shuffledPrompts.length === 0) return <div className="voice-loader">Loading questions...</div>;

  const current = shuffledPrompts[step];

  return (
    <div className="voice-screening-card">
      <div className="voice-header">
        <span className="mic-icon">🎙️</span>
        <h3>Voice Screening</h3>
      </div>

      {!finished ? (
        <div className="voice-content">
          <p className="voice-question-text">{current.question}</p>

          <button 
            className={`mic-trigger-btn ${listening ? 'is-listening' : ''} ${!isBrowserSupported ? 'disabled' : ''}`} 
            onClick={startListening} 
            disabled={listening}
          >
            {listening ? (
              <span className="pulse-ring">🔴 Listening...</span>
            ) : (
              isBrowserSupported ? "🎤 Tap to Speak" : "🎤 Voice Not Supported"
            )}
          </button>

          <div className="voice-divider"><span>OR SELECT ONE</span></div>

          <div className="voice-options-grid">
            {current.options.map((opt, idx) => (
              <button
                key={idx}
                className="voice-opt-btn"
                onClick={() => handleAnswer(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          {transcript && (
            <div className="transcript-box">
              <p>You said: <strong>"{transcript}"</strong></p>
            </div>
          )}

          <div className="voice-footer">
            <div className="voice-progress-bar">
              <div 
                className="voice-progress-fill" 
                style={{ width: `${((step + 1) / shuffledPrompts.length) * 100}%` }}
              ></div>
            </div>
            <p className="step-count">Question {step + 1} of {shuffledPrompts.length}</p>
          </div>
        </div>
      ) : (
        <div className="voice-complete-ui">
          <div className="success-star">🌟</div>
          <h3>Wonderful Job!</h3>
          <p>Module Completed Successfully</p>
          <div className="final-score-badge">Final Score: {score}</div>
        </div>
      )}
    </div>
  );
}

export default VoiceScreening;