import axios from 'axios';

// Backend ka base URL (Check karein aapka backend 5000 par hi hai na)
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE,
});

// =======================
// 📦 Child & Screening
// =======================
export const fetchChildren = () => api.get('/api/children');

// ✅ Backend route: router.post('/screening/scores', ...)
export const postScreeningScores = (payload) => 
  api.post('/api/screening/scores', payload);

// =======================
// 🤖 ML & AI Routes
// =======================

// ✅ Backend route: router.get('/ml/growth-trajectory/:childId', ...)
// Notice karein yahan 'get' use ho raha hai aur path backend se match hai
export const fetchGrowthTwin = (childId) => 
  api.get(`/api/ml/growth-trajectory/${childId}`); 

// ✅ Backend route: router.post('/bonding-score', ...)
export const getBondingScore = (payload) => 
  api.post('/api/bonding-score', payload);

// ✅ Backend route: router.post('/recommendations', ...)
export const getMicroTips = (payload) => 
  api.post('/api/recommendations', payload);

// ✅ Backend route: router.post('/emotion', ...)
export const saveEmotionLogs = (childId, logs) =>
  api.post('/api/emotion', { childId, logs });

export default api;