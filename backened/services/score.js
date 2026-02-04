const Screening = require('../models/Screening');


async function getLatestScores(childId) {
  try {
    const latest = await Screening.findOne({ childId }).sort({ createdAt: -1 }).lean();

    if (!latest) {
      return {
        quizScore: 0,
        soundScore: 0,
        emotionScore: 0,
        age_months: 0
      };
    }

    return {
      quizScore: latest.quizScore ?? 0,
      soundScore: latest.soundScore ?? 0,
      emotionScore: latest.emotionScore ?? 0,
      age_months: latest.age_months ?? 0
    };
  } catch (err) {
    console.error('❌ Error fetching scores:', err.message);
    return {
      quizScore: 0,
      soundScore: 0,
      emotionScore: 0,
      age_months: 0
    };
  }
}

module.exports = { getLatestScores };
