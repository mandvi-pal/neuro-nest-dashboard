import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  BarElement,
  ArcElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const milestoneData = {
  0: "Smiles at people, lifts head during tummy time",
  12: "Says simple words, stands with support",
  24: "Uses short sentences, kicks ball",
  36: "Speaks clearly, climbs stairs",
  60: "Tells stories, draws person, hops"
};

// ✅ Scores aur submitted props add kiye hain
function ScreeningReport({ child, scores: liveScores, submitted }) {
  const [dbFeedback, setDbFeedback] = useState(null);
  const [chartType, setChartType] = useState('Bar');
  const navigate = useNavigate();

  useEffect(() => {
    // Agar live result nahi hai, tabhi DB se fetch karein
    if (!child?._id || submitted) return;

    axios.get(`${import.meta.env.VITE_API_URL}/api/feedback/${child._id}`)
      .then(res => setDbFeedback(res.data))
      .catch(() => setDbFeedback(null));
  }, [child, submitted]);

  // --- Data Logic (Live Scores vs DB Feedback) ---
  // Agar abhi-abhi screening submit hui hai toh liveScores use karein
  const finalScores = submitted ? {
    quiz: liveScores?.quiz || 0,
    sound: liveScores?.sound || 0,
    emotion: liveScores?.emotion || 0
  } : {
    quiz: dbFeedback?.quizScore || 0,
    sound: dbFeedback?.soundScore || 0,
    emotion: dbFeedback?.emotionScore || 0
  };

  const ageMonths = child?.age_months ?? liveScores?.age_months ?? 0;
  const closestAge = Object.keys(milestoneData)
    .reverse()
    .find((age) => ageMonths >= parseInt(age)) || 0;

  const milestoneSummary = milestoneData[closestAge];
  const quizStatus = finalScores.quiz >= 4 ? "On Track" : "Needs Attention";
  
  // Recommendation logic using live data or DB
  const finalRecommendation = liveScores?.recommendation || 
    (finalScores.quiz < 3 ? "Refer to specialist" : "Maintain daily activities");

  // Chart Data Preparation
  const chartData = {
    labels: ['Quiz', 'Sound', 'Emotion'],
    datasets: [
      {
        label: 'Activity Score',
        data: [finalScores.quiz, finalScores.sound, finalScores.emotion],
        backgroundColor: ['rgba(52, 152, 219, 0.7)', 'rgba(46, 204, 113, 0.7)', 'rgba(241, 196, 15, 0.7)'],
        borderColor: ['#2980b9', '#27ae60', '#f39c12'],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true, max: 5 } }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'Pie': return <Pie data={chartData} />;
      case 'Radar': return <Radar data={chartData} />;
      default: return <Bar data={chartData} options={chartOptions} />;
    }
  };

  // Agar data loading hai ya unavailable
  if (!child || (!submitted && !dbFeedback)) {
    return (
      <div className="section-card section-warning shadow-lg">
        <h3>📄 Screening Report</h3>
        <p>⚠️ No recent screening data found for <strong>{child?.name || "this child"}</strong>.</p>
        <button className="start-btn" onClick={() => navigate('/screening')}>Start New Activity</button>
      </div>
    );
  }

  return (
    <div className="section-card section-screening shadow-lg animate-fade-in">
      <div className="report-badge">Report Generated</div>
      <h3>📄 Developmental Report</h3>
      
      <div className="report-meta">
        <p><strong>Name:</strong> {child.name}</p>
        <p><strong>Age:</strong> {ageMonths} months</p>
      </div>

      <hr />
      <h4>📊 Milestone Summary ({ageMonths}m)</h4>
      <div className="milestone-box">{milestoneSummary}</div>

      <h4>🧠 Skill Performance</h4>
      <ul className="score-list">
        <li className={finalScores.quiz < 3 ? "low-score" : ""}>
          📝 Cognitive Quiz: <strong>{finalScores.quiz} / 5</strong> ({quizStatus})
        </li>
        <li>🔊 Sound Recognition: <strong>{finalScores.sound} / 5</strong></li>
        <li>😊 Emotional Response: <strong>{finalScores.emotion} / 5</strong></li>
      </ul>

      <hr />
      <div className="chart-header">
        <h4>📈 Visualization</h4>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="chart-select">
          <option value="Bar">Bar View</option>
          <option value="Pie">Pie View</option>
          <option value="Radar">Radar View</option>
        </select>
      </div>

      <div className="chart-wrapper">
        {renderChart()}
      </div>

      <div className="final-advice-box">
        <h4>✅ Expert Analysis & Recommendation</h4>
        <p className={finalRecommendation.includes("specialist") ? "advice-alert" : "advice-ok"}>
          {finalRecommendation}
        </p>
      </div>
    </div>
  );
}

export default ScreeningReport;