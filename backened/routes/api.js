const express = require('express');
const router = express.Router();


const {
  getChildren,
  addChild,
  updateChild,
  deleteChild,
  getRecommendations,
  predictMilestone
} = require('../controllers/dataController');


  saveAllResults
} = require('../controllers/screeningController');

const {
  getAnalytics
} = require('../controllers/analyticsController');


const { saveEmotionLogs } = require('../controllers/emotionController');


router.get('/children', getChildren);


router.post('/children', addChild);


router.put('/children/:id', updateChild);


router.delete('/children/:id', deleteChild);


router.post('/recommendations', getRecommendations);


router.post('/predict-milestone', predictMilestone);


router.post('/screening/saveAll', saveAllResults);


router.post('/emotion/logs', saveEmotionLogs);


router.get('/analytics', getAnalytics);

module.exports = router;
