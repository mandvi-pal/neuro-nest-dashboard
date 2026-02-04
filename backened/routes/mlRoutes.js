const express = require('express');
const router = express.Router();

// 1. Bonding Score Route
router.post('/bonding-score', (req, res) => {
  try {
    const { childId, feedbackText } = req.body;
    
    console.log(`Bonding score requested for child ${childId}`);
    
    // Yahan hum dummy score bhej rahe hain, baad mein AI logic add kar sakte hain
    res.json({ 
      score: 0.85, 
      message: "Great bonding level detected!" 
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error in Bonding Score" });
  }
}); // ✅ Bracket fixed here

// 2. Generate Tips Route
router.post('/generate-tips', (req, res) => {
  try {
    const { childId, scores } = req.body;

    console.log(`Tips requested for child ${childId} with scores:`, scores);
    
    res.json({
      tips: [
        "Spend 15 minutes of screen-free play time together.",
        "Practice naming everyday objects to boost vocabulary.",
        "Establish a calming 10-minute bedtime routine."
      ],
      tip: "Focus on interactive play to improve social response." // Single tip for MicroIntervention
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error in Tips Generation" });
  }
});

module.exports = router;