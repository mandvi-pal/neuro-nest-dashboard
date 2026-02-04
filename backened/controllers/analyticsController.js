const Screening = require('../models/Screening');


exports.getAnalytics = async (req, res) => {
  try {
    const { childId } = req.query;

    if (!childId) {
      return res.status(400).json({ error: 'childId is required' });
    }

    const data = await Screening.findOne({ childId })
      .sort({ createdAt: -1 })
      .populate('childId')
      .lean();

    if (!data) {
      return res.status(404).json({ message: "No screening data found" });
    }

    const child = data.childId || {};

    res.status(200).json({
      child: {
        _id: child._id || childId,
        name: child.name || "Unknown",
        age_months: child.age_months || null,
        gender: child.gender || "Unknown"
      },
      emotionScore: data.emotionScore,
      soundScore: data.soundScore,
      quizScore: data.quizScore,
      feedback: data.feedback,
      createdAt: data.createdAt
    });
  } catch (err) {
    console.error("❌ Error fetching analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

exports.getAllAnalytics = async (req, res) => {
  try {
    const allScreenings = await Screening.find()
      .sort({ createdAt: -1 })
      .populate('childId')
      .lean();

    const seen = new Set();
    const latestPerChild = allScreenings.filter(screening => {
      const id = screening.childId?._id?.toString();
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    const formatted = latestPerChild.map(data => {
      const child = data.childId || {};
      return {
        child: {
          _id: child._id,
          name: child.name || "Unknown",
          age_months: child.age_months || null,
          gender: child.gender || "Unknown"
        },
        emotionScore: data.emotionScore,
        soundScore: data.soundScore,
        quizScore: data.quizScore,
        feedback: data.feedback,
        createdAt: data.createdAt
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching all analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
