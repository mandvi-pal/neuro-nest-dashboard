const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

// --- ROUTE IMPORTS ---
const dataRoutes = require('./routes/dataRoutes');

// --- ROUTE MOUNTING ---
// Humne '/api' prefix diya hai. 
// Ab api.js ki saari requests (jaise /api/children, /api/ml/growth-trajectory) 
// isi dataRoutes file ke andar handle ho jayengi.
app.use('/api', dataRoutes);

// --- BASE ROUTE ---
app.get('/', (req, res) => {
  res.json({ ok: true, msg: '✅ BabyStep AI Backend is running!' });
});

// --- ERROR HANDLING MIDDLEWARE ---
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

// --- SERVER & DATABASE CONNECTION ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ ERROR: MONGO_URI is missing in .env file');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Express server running on: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });