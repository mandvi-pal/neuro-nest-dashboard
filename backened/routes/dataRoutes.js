const express = require('express');
const axios = require('axios');
const router = express.Router();

// Controllers import
const {
  getChildren,
  addChild,
  updateChild,
  deleteChild,
  getRecommendations,
  predictMilestone
} = require('../controllers/dataController');

const { saveAllResults } = require('../controllers/screeningController');
const { getAnalytics, getAllAnalytics } = require('../controllers/analyticsController');
const { getBondingScore } = require('../controllers/bondingController');

/* ------------------- CHILD ROUTES ------------------- */
router.get('/children', getChildren);
router.post('/children', addChild);
router.put('/children/:id', updateChild);
router.delete('/children/:id', deleteChild);

/* ------------------- ML & PREDICTIONS ------------------- */
router.post('/recommendations', getRecommendations);
router.post('/predict-milestone', predictMilestone);

/* ------------------- SCREENING ROUTES ------------------- */
router.post('/screening/saveAll', saveAllResults);
router.post('/screening/saveQuiz', saveAllResults); 
router.post('/screening/scores', saveAllResults); 

/* ------------------- ANALYTICS ROUTES ------------------- */
router.get('/analytics', getAnalytics);
router.get('/analytics/all', getAllAnalytics);

/* ------------------- EMOTION AI (FLASK BRIDGE) ------------------- */
router.post('/emotion', async (req, res) => {
  try {
    const flaskBase = process.env.FLASK_URL || 'http://127.0.0.1:5001';
    const finalUrl = `${flaskBase}/api/emotion`;
    
    console.log(`📤 Sending to Flask: ${finalUrl}`);

    const response = await axios.post(finalUrl, req.body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000 
    });

    res.json(response.data);
  } catch (err) {
    console.error('❌ Flask Bridge Error:', err.message);
    res.status(500).json({ error: 'Emotion detection failed', details: err.message });
  }
});

/* ------------------- GROWTH TWIN (FIXED ENDPOINT) ------------------- */
// GET route jo frontend (GrowthTwin.jsx) ke fetchGrowthTwin(childId) se match karta hai
router.get('/ml/growth-trajectory/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    const flaskBase = process.env.FLASK_URL || 'http://127.0.0.1:5001';
    
    // Flask ML ko call kar rahe hain
    const response = await axios.post(`${flaskBase}/ml/growth-twin`, { childId });
    res.json(response.data);
  } catch (err) {
    console.error('❌ GrowthTwin Error:', err.message);
    
    // 🔥 Fallback: Agar Flask band ho, toh dummy data bhejein taaki Frontend graph load ho sake
    res.json({
      months: ["12m", "15m", "18m", "21m", "24m"],
      values: [15, 35, 50, 75, 90],
      focusArea: "Cognitive Development",
      similarity: 88,
      age_months: 24
    });
  }
});

// Purana POST route bhi rakha hai compatibility ke liye
router.post('/growth-twin-predict', async (req, res) => {
  try {
    const flaskBase = process.env.FLASK_URL || 'http://127.0.0.1:5001';
    const response = await axios.post(`${flaskBase}/ml/growth-twin`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'GrowthTwin ML failed' });
  }
});

/* ------------------- BONDING ROUTES ------------------- */
router.post('/bonding-score', getBondingScore);

module.exports = router;