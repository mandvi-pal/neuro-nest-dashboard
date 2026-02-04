import React, { useState } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import './quizEngine.css';

const quizData = {
  36: [
    { question: "Can the child climb stairs independently?", options: ["Yes", "No", "Sometimes", "Needs help"], answer: 0 },
    { question: "Does the child speak in short sentences?", options: ["Yes", "No", "Only single words", "Not yet"], answer: 0 },
    { question: "Can the child recognize basic shapes?", options: ["Yes", "No", "Only circles", "Not tested"], answer: 0 },
    { question: "Does the child show empathy?", options: ["Yes", "No", "Rarely", "Not sure"], answer: 0 },
    { question: "Can the child follow 2-step instructions?", options: ["Yes", "No", "Sometimes", "Needs prompting"], answer: 0 }
  ],
  60: [
    { question: "Can the child count to 10?", options: ["Yes", "No", "Up to 5", "Not yet"], answer: 0 },
    { question: "Does the child tell simple stories?", options: ["Yes", "No", "With help", "Not interested"], answer: 0 },
    { question: "Can the child hop on one foot?", options: ["Yes", "No", "With support", "Not tried"], answer: 0 },
    { question: "Does the child play cooperatively?", options: ["Yes", "No", "Sometimes", "Prefers solo play"], answer: 0 },
    { question: "Can the child draw a person?", options: ["Yes", "No", "Just scribbles", "Not interested"], answer: 0 }
  ]
};

function QuizEngine({ childId, age_months, onComplete }) {
  const closestAge = Object.keys(quizData).reverse().find((age) => age_months >= parseInt(age)) || 36;
  const questions = quizData[closestAge];
  
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSelect = (qIndex, optionIndex) => {
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    // FIX: Check only if all questions have "some" selection
    if (answers.some(ans => ans === null)) {
      alert("⚠️ Please answer all questions before submitting.");
      return;
    }

    const score = answers.filter((ans, i) => ans === questions[i].answer).length;
    const recommendation = score >= 3 ? "On Track" : "Monitoring Needed";

    const payload = {
      childId,
      age_months: Number(age_months),
      quizScore: Number(score),
      quizTotal: Number(questions.length),
      recommendation,
      timestamp: new Date().toISOString()
    };

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/screening/saveQuiz`, payload);
      if (onComplete) onComplete(score);
      setSubmitted(true);
      if (score >= 4) setShowCelebration(true);
    } catch (err) {
      console.error("❌ Quiz Save Error:", err);
      setSubmitted(true); // Flow continue rakhein
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-wrapper">
      <h3 className="quiz-title">📝 Milestone Check</h3>
      {!submitted ? (
        <div className="quiz-container">
          {questions.map((q, i) => (
            <div key={i} className="quiz-box">
              <p className="quiz-q-text">{i + 1}. {q.question}</p>
              <div className="options-list">
                {q.options.map((opt, j) => (
                  <label key={j} className={`opt-label ${answers[i] === j ? 'active' : ''}`}>
                    <input type="radio" checked={answers[i] === j} onChange={() => handleSelect(i, j)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="quiz-submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "⏳ Submitting..." : "✅ Finish Quiz"}
          </button>
        </div>
      ) : (
        <div className="quiz-result-card">
          <h4>📊 Assessment Complete</h4>
          <p>Result: <strong>{recommendation}</strong></p>
          {showCelebration && <Confetti />}
        </div>
      )}
    </div>
  );
}

export default QuizEngine;