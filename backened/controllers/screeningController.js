const axios = require('axios');
const Screening = require('../models/Screening');

const saveAllResults = async (req, res) => {
  try {
    const {
      childId,
      age_months, // ✅ Age receive kar rahe hain
      emotionScore,
      soundScore,
      quizScore,
      emotionTotal,
      soundTotal,
      quizTotal,
      feedback = {},
      image 
    } = req.body;

    if (!childId) {
      return res.status(400).json({ error: 'childId is required' });
    }

    // Number conversion and validation
    const emotionNum = emotionScore !== undefined ? Number(emotionScore) : null;
    const soundNum = soundScore !== undefined ? Number(soundScore) : null;
    const quizNum = quizScore !== undefined ? Number(quizScore) : null;

    const emotionMax = Number(emotionTotal ?? 5);
    const soundMax = Number(soundTotal ?? 5);
    const quizMax = Number(quizTotal ?? 5);

    // ✅ DB mein save kar rahe hain (Age ke saath)
    const saved = await Screening.create({
      childId,
      age_months: age_months || 0, // ✅ Model mein ye field honi chahiye
      emotionScore: emotionNum,
      soundScore: soundNum,
      quizScore: quizNum,
      feedback,
      createdAt: new Date()
    });

    let heatmapImage = null;
    let emotionResult = null;

    // --- AI/Flask Integration ---
    if (image) {
      try {
        console.log("📥 Calling Flask for emotion detection...");
        const flaskResponse = await axios.post('http://localhost:5001/api/emotion', {
          image,
          childId
        }, { headers: { "Content-Type": "application/json" } });
        
        emotionResult = flaskResponse.data;

        const scoresDict = {};
        if (emotionResult?.emotions?.length) {
          const first = emotionResult.emotions[0];
          Object.assign(scoresDict, first.emotion_scores);
        } else {
          scoresDict.emotion = emotionNum ?? 0;
        }

        const heatmapResponse = await axios.post('http://localhost:5001/api/emotion-heatmap', {
          scores: scoresDict
        }, { headers: { "Content-Type": "application/json" } });

        heatmapImage = heatmapResponse.data?.imageBase64 || null;
      } catch (err) {
        console.error("❌ Flask Error:", err.message);
      }
    }

    // --- ✅ Report Analysis Logic (Important for Frontend) ---
    const totalScore = (emotionNum || 0) + (soundNum || 0) + (quizNum || 0);
    let finalStatus = "Healthy Progress";
    let finalRec = "Keep engaging in sensory activities and daily play.";

    if (totalScore < 5) {
      finalStatus = "Observation Suggested";
      finalRec = "Focus more on communication and sound recognition games.";
    } else if (totalScore >= 12) {
      finalStatus = "Exceptional Growth";
      finalRec = "Child is performing above average. Introduce complex puzzles.";
    }

    // ✅ Frontend ko complete data bhej rahe hain
    res.status(201).json({
      message: "✅ Screening results saved successfully",
      childId: saved.childId,
      screeningId: saved._id,
      age_months: saved.age_months, // ✅ Return age
      result: finalStatus,          // ✅ Return Status
      recommendation: finalRec,     // ✅ Return Tip
      scores: {
        emotion: emotionNum,
        sound: soundNum,
        quiz: quizNum,
        total: totalScore
      },
      emotions: emotionResult?.emotions || [],
      heatmap: heatmapImage
    });

  } catch (err) {
    console.error("❌ Error saving screening:", err);
    res.status(500).json({ error: "Failed to save screening results" });
  }
};

module.exports = { saveAllResults };