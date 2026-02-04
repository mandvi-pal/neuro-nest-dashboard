// src/pages/ParentDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import ChildSelector from '../components/ChildProfile/ChildSelector';
import ChildProfile from '../components/ChildProfile/ChildProfile';
import MilestoneTracker from '../components/ChildProfile/MilestoneTracker';
import ProgressTracker from '../components/ChildProfile/ProgressTracker';
import Recommendation from '../components/RecommendationEngine/Recommendation';
import ExportPDF from '../components/ExportPDF';
import Quiz from '../components/PracticeQuiz/Quiz';
import ProgressTrendChart from '../components/Analytics/ProgressTrendChart';
import ResultsChart from '../pages/ResultsChart';
import GrowthTwin from '../components/SmartScreening/advanced/GrowthTwin';

import Confetti from 'react-confetti';
import './ParentDashboard.css';

function ParentDashboard() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);

  const [practiceTopic, setPracticeTopic] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [quizScore, setQuizScore] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const { t, i18n } = useTranslation();

  // 🧮 AGE CALCULATION LOGIC (For Benchmark Fix)
  const getCalculatedAge = (child) => {
    if (!child) return 0;
    if (child.age_months && child.age_months > 0) return child.age_months;
    if (child.dob) {
      const birth = new Date(child.dob);
      const now = new Date();
      let months = (now.getFullYear() - birth.getFullYear()) * 12;
      months += now.getMonth() - birth.getMonth();
      return months <= 0 ? 0 : months;
    }
    return 0;
  };

  /* ---------------- Fetch children ---------------- */
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/children`)
      .then((res) => {
        setChildren(res.data);
        setSelectedChild(res.data[0] || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- Fetch child related data ---------------- */
  useEffect(() => {
    if (!selectedChild?._id) return;

    const childId = selectedChild._id;

    // 1. Analytics & Age Update
    axios.get(`${import.meta.env.VITE_API_URL}/api/analytics?childId=${childId}`)
      .then((res) => setSelectedChild(prev => ({
        ...prev,
        age_months: prev?.age_months || res.data.age_months || getCalculatedAge(prev),
        screeningResults: [res.data]
      })));

    // 2. Milestone Prediction
    axios.post(`${import.meta.env.VITE_API_URL}/api/predict-milestone`, { childId })
      .then((res) => setSelectedChild(prev => ({
        ...prev,
        milestonePrediction: res.data.prediction
      })));

    // 3. Screening History
    axios.get(`${import.meta.env.VITE_API_URL}/api/screening/history?childId=${childId}`)
      .then((res) => setSelectedChild(prev => ({
        ...prev,
        screeningHistory: res.data
      })));

    // 4. Growth Twin Data
    axios.get(`${import.meta.env.VITE_API_URL}/api/growth-twin?childId=${childId}`)
      .then((res) => setSelectedChild(prev => ({
        ...prev,
        growthTwin: res.data
      })));

  }, [selectedChild?._id]);

  /* ---------------- Quiz Logic ---------------- */
  const handleStartPractice = (topic) => {
    setPracticeTopic(topic);
    setQuizScore(null);
    setShowCelebration(false);
    
    const sample = {
      Math: [{ question: t('quiz.math.q1'), options: ['3', '4', '5', '6'], answer: [1] }],
      Shapes: [{ question: t('quiz.shapes.q1'), options: [t('circle'), t('triangle')], answer: [1] }]
    };
    setQuizData(sample[topic] || []);
  };

  const handleQuizComplete = (score) => {
    setQuizScore(score);
    if (score >= quizData.length) setShowCelebration(true);
    
    axios.post(`${import.meta.env.VITE_API_URL}/api/quiz/save`, {
      childId: selectedChild._id,
      topic: practiceTopic,
      score,
      total: quizData.length,
      timestamp: new Date(),
    });
  };

  if (loading) return <p className="loading-text">{t('loading')}</p>;
  if (!selectedChild) return <p>No child found</p>;

  return (
    <div className="dashboard-container">
      <div className="language-switcher">
        <select onChange={(e) => i18n.changeLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>

      <h2>👨‍👩‍👧‍👦 {t('dashboardTitle')}</h2>

      {/* 🟢 Child Profile Section */}
      <section className="section-card">
        <ChildSelector childrenList={children} onSelect={setSelectedChild} />
        <ChildProfile child={selectedChild} />
      </section>

      {/* 🟢 Growth Twin Section (Fixed Age Benchmark) */}
      <section className="section-card">
        <h3>🌱 Growth Twin</h3>
        <GrowthTwin
          child={selectedChild}
          childrenList={children}
          prediction={selectedChild.growthTwin}
          score={quizScore !== null ? quizScore : getCalculatedAge(selectedChild)}
        />
      </section>

      {/* 🟢 Milestone Tracker Section (Wapas Add Kar Diya) */}
      <section className="section-card">
        <h3>📊 {t('milestones')}</h3>
        <MilestoneTracker child={selectedChild} />
        {selectedChild.milestonePrediction && (
          <p style={{marginTop: '15px', fontWeight: 'bold', color: '#2c3e50'}}>
            🏅 {t('milestonePrediction')}: <span style={{color: '#27ae60'}}>{selectedChild.milestonePrediction}</span>
          </p>
        )}
      </section>

      {/* 🟢 Analytics Section */}
      <section className="section-card analytics-grid">
        <ResultsChart childrenList={children} chartStyle="modern" />
        {selectedChild.screeningHistory?.length > 1 && (
          <ProgressTrendChart history={selectedChild.screeningHistory} chartStyle="smooth" />
        )}
      </section>

      {/* 🟢 Practice Quiz Section */}
      <section className="section-card">
        <h3>🧪 {t('practiceTopics')}</h3>
        <div className="practice-buttons" style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
          <button onClick={() => handleStartPractice('Math')}>{t('startMathQuiz')}</button>
          <button onClick={() => handleStartPractice('Shapes')}>{t('startShapesQuiz')}</button>
        </div>
        {practiceTopic && quizData.length > 0 && (
          <Quiz questions={quizData} onComplete={handleQuizComplete} />
        )}
        {showCelebration && <Confetti />}
      </section>

      {/* 🟢 Recommendations & Reports */}
      {selectedChild.progress && (
        <section className="section-card">
          <ProgressTracker progress={selectedChild.progress} />
          <Recommendation progress={selectedChild.progress} onStartPractice={handleStartPractice} />
        </section>
      )}

      <section className="section-card reports-section">
        <h3>📄 Professional Report</h3>
        <ExportPDF 
          child={{...selectedChild, age_months: getCalculatedAge(selectedChild)}} 
          results={selectedChild.screeningResults || []} 
        />
      </section>
    </div>
  );
}

export default ParentDashboard;