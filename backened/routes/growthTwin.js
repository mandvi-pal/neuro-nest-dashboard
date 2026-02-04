const express = require('express');
const axios = require('axios');
const { getLatestScores } = require('../services/score'); // ✅ CommonJS import

const router = express.Router();

router.get('/growth-twin', async (req, res) => {
  try {
    const { childId } = req.query;
    if (!childId) return res.status(400).json({ error: 'childId is required' });

    
    const scores = await getLatestScores(childId);

    
    const flaskRes = await axios.post(`${process.env.FLASK_URL}/ml/growth-twin`, {
      childId,
      scores
    });

    
    res.json(flaskRes.data);
  } catch (err) {
    console.error('❌ GrowthTwin error:', err.message);
    res.status(500).json({ error: 'Failed to fetch GrowthTwin prediction' });
  }
});

module.exports = router;
