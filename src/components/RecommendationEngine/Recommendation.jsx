import React from 'react';

function Recommendation({ progress, onStartPractice }) {
  // Find weak topics
  const weakTopics = Object.entries(progress)
    .filter(([_, score]) => score < 70)
    .map(([subject]) => subject);

  const adviceMap = {
    Math: "🧮 Practice number patterns and puzzles.",
    English: "📚 Read short stories and improve vocabulary.",
    Science: "🔬 Try simple experiments or nature walks.",
    Coding: "💻 Build small projects or play logic games.",
    Memory: "🧠 Use flashcards or matching games.",
    Shapes: "🧩 Use shape-sorting toys or drawing exercises.",
    Attention: "🎯 Try focus games like 'Simon Says'.",
    Social: "🤝 Encourage group play and sharing.",
    Language: "🗣️ Talk more with your child and read aloud."
  };

  return (
    <div style={{
      marginTop: '1.5rem',
      padding: '1rem',
      backgroundColor: '#FFF3E0',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      <h4>🧠 Recommended Topics</h4>

      {weakTopics.length === 0 ? (
        <p>🎉 All topics are strong! You can move to the Advance Module.</p>
      ) : (
        <ul style={{ paddingLeft: '1rem' }}>
          {weakTopics.map((topic, i) => (
            <li key={i} style={{ marginBottom: '1rem' }}>
              <strong>{topic}:</strong> {adviceMap[topic] || "📌 Practice more on this topic."}
              <br />
              <button
                onClick={() => onStartPractice(topic)}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.4rem 1rem',
                  fontSize: '0.9rem',
                  backgroundColor: '#2ECC71',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ▶️ Start Practice
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Recommendation;
