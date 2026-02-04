import React, { useState } from 'react';

function Quiz({ questions }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionClick = (index) => {
    setSelected(index);
    setShowExplanation(true);
    if (questions[current].answer.includes(index)) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowExplanation(false);
    setCurrent((prev) => prev + 1);
  };

  const isFinished = current >= questions.length;

  return (
    <div style={{ marginTop: '1rem' }}>
      {isFinished ? (
        <div>
          <h4>✅ Quiz Completed</h4>
          <p>Your score: {score} / {questions.length}</p>
        </div>
      ) : (
        <>
          <h4>Question {current + 1} of {questions.length}</h4>
          <p>{questions[current].question}</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {questions[current].options.map((opt, i) => (
              <li key={i}>
                <button
                  onClick={() => handleOptionClick(i)}
                  disabled={selected !== null}
                  style={{
                    margin: '0.5rem 0',
                    padding: '0.5rem 1rem',
                    background: selected === i
                      ? questions[current].answer.includes(i)
                        ? '#d4edda'
                        : '#f8d7da'
                      : '#f0f0f0',
                    border: '1px solid #ccc',
                    cursor: selected === null ? 'pointer' : 'default'
                  }}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
          {showExplanation && (
            <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
              💡 {questions[current].explanation}
            </p>
          )}
          {showExplanation && current < questions.length - 1 && (
            <button onClick={handleNext} style={{ marginTop: '1rem' }}>
              Next Question →
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Quiz;
