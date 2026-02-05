import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChildSelector from '../components/ChildProfile/ChildSelector';
import ChildProfile from '../components/ChildProfile/ChildProfile';
import MilestoneCard from '../components/ChildProfile/MilestoneCard';
import ProgressTracker from '../components/ChildProfile/ProgressTracker';
import Recommendation from '../components/RecommendationEngine/Recommendation';
import ExportPDF from '../components/ExportPDF';
import Quiz from '../components/PracticeQuiz/Quiz';
import ProgressTrendChart from '../components/Analytics/ProgressTrendChart';

function ParentDashboard() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [practiceTopic, setPracticeTopic] = useState('');
  const [quizData, setQuizData] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/children`)
      .then(res => {
        setChildren(res.data);
        setSelectedChild(res.data[0] || null);
      })
      .catch(err => {
        console.error("❌ Error fetching children:", err);
        setError("Failed to load child profiles.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedChild?._id) return;

    axios.get(`${import.meta.env.VITE_API_URL}/api/analytics?childId=${selectedChild._id}`)
      .then(res => {
        setSelectedChild(prev => ({
          ...prev,
          screeningResults: [res.data]
        }));
      })
      .catch(() => {
        setSelectedChild(prev => ({
          ...prev,
          screeningResults: []
        }));
      });

    axios.post(`${import.meta.env.VITE_API_URL}/api/predict-milestone`, {
      childId: selectedChild._id
    })
    .then(res => {
      setSelectedChild(prev => ({
        ...prev,
        milestonePrediction: res.data.prediction
      }));
    });

    axios.get(`${import.meta.env.VITE_API_URL}/api/screening/history?childId=${selectedChild._id}`)
      .then(res => {
        setSelectedChild(prev => ({
          ...prev,
          screeningHistory: res.data
        }));
      });
  }, [selectedChild?._id]);

  const handleStartPractice = (topic) => {
    setPracticeTopic(topic);

    const sample = {
      Math: [
        {
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          answer: [1],
          explanation: "2 + 2 = 4"
        },
        {
          question: "Which is an even number?",
          options: ["3", "5", "8", "9"],
          answer: [2],
          explanation: "8 is even"
        }
      ],
      Shapes: [
        {
          question: "What shape has 3 sides?",
          options: ["Circle", "Triangle", "Square", "Hexagon"],
          answer: [1],
          explanation: "Triangle has 3 sides"
        },
        {
          question: "Which shape has no corners?",
          options: ["Square", "Rectangle", "Circle", "Triangle"],
          answer: [2],
          explanation: "Circle has no corners"
        }
      ]
    };

    setQuizData(sample[topic] || []);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h2>👨‍👩‍👧‍👦 Parent Dashboard</h2>

      {loading ? (
        <p>Loading child profiles...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : children.length === 0 ? (
        <p>No child profiles found. Please add a child first.</p>
      ) : (
        <>
          <ChildSelector childrenList={children} onSelect={setSelectedChild} />

          {selectedChild ? (
            <>
              <ChildProfile child={selectedChild} />
              <MilestoneCard child={selectedChild} />

              {selectedChild.screeningResults?.length > 0 ? (
                <div style={{ marginTop: '1rem', background: '#f0f8ff', padding: '1rem', borderRadius: '8px' }}>
                  <h4>📊 Last Screening Summary</h4>
                  <p><strong>Quiz Score:</strong> {selectedChild.screeningResults[0].quizScore} / 5</p>
                  <p><strong>Sound Score:</strong> {selectedChild.screeningResults[0].soundScore} / 5</p>
                  <p><strong>Emotion Score:</strong> {selectedChild.screeningResults[0].emotionScore} / 5</p>
                  <p><strong>Screened On:</strong> {new Date(selectedChild.screeningResults[0].createdAt).toLocaleDateString()}</p>
                </div>
              ) : (
                <p style={{ color: '#cc0000' }}>⚠️ No screening data available.</p>
              )}

              {selectedChild.screeningResults?.length > 0 && (
                <div style={{ marginTop: '1rem', background: '#fffbe6', padding: '1rem', borderRadius: '8px' }}>
                  <h4>📅 Next Screening Due</h4>
                  <p>
                    {(() => {
                      const lastDate = new Date(selectedChild.screeningResults[0].createdAt);
                      const nextDate = new Date(lastDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                      return nextDate.toLocaleDateString();
                    })()}
                  </p>
                </div>
              )}

              {selectedChild.screeningResults?.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4>💡 Parent Tips</h4>
                  <ul>
                    {selectedChild.screeningResults[0].quizScore < 3 && (
                      <li>🧠 Try memory match games to improve cognitive recall.</li>
                    )}
                    {selectedChild.screeningResults[0].soundScore < 3 && (
                      <li>🔊 Use sound matching or listening games to boost auditory skills.</li>
                    )}
                    {selectedChild.screeningResults[0].emotionScore < 3 && (
                      <li>😊 Practice emotion cards or roleplay to build emotional awareness.</li>
                    )}
                    {(selectedChild.screeningResults[0].quizScore >= 3 &&
                      selectedChild.screeningResults[0].soundScore >= 3 &&
                      selectedChild.screeningResults[0].emotionScore >= 3) && (
                      <li>🎉 Your child is progressing well! Keep up the joyful learning.</li>
                    )}
                  </ul>
                </div>
              )}

              {selectedChild.screeningResults?.length > 0 &&
               selectedChild.screeningResults[0].quizScore >= 4 &&
               selectedChild.screeningResults[0].soundScore >= 4 && (
                <div style={{ marginTop: '1rem', background: '#fff0f5', padding: '1rem', borderRadius: '8px' }}>
                  <h4>🎉 Great Job!</h4>
                  <p>Your child is doing wonderfully! Keep up the joyful learning!</p>
                </div>
              )}

              {selectedChild.screeningHistory?.length > 1 && (
                <ProgressTrendChart history={selectedChild.screeningHistory} />
              )}

              {selectedChild.progress ? (
                <>
                  <ProgressTracker progress={selectedChild.progress} />
                  <Recommendation
                    progress={selectedChild.progress}
                    onStartPractice={handleStartPractice}
                  />
                </>
              ) : (
                <p style={{ color: '#cc0000' }}>⚠️ No child progress data available.</p>
              )}

              {practiceTopic && quizData.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <h4>🧪 Practice: {practiceTopic}</h4>
                  <Quiz questions={quizData} />
                </div>
              )}

              <ExportPDF
                child={selectedChild}
                results={selectedChild.screeningResults || []}
                prediction={selectedChild.milestonePrediction || ''}
                nextScreeningDate={
                  selectedChild.screeningResults?.length > 0
                    ? new Date(new Date(selectedChild.screeningResults[0].createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                    : ''
                }
              />
            </>
          ) : (
            <p style={{ color: '#cc0000' }}>⚠️ No child selected.</p>
          )}
        </>
      )}
    </div>
  );
}

export default ParentDashboard;
