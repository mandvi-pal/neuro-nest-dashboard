const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  
  emotionScore: { type: Number, default: null },
  soundScore: { type: Number, default: null },
  quizScore: { type: Number, default: null },
  feedback: {
    sleepHours: { type: String, default: '' },
    speechLevel: { type: String, default: '' },
    behaviorNotes: { type: String, default: '' },
    concerns: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Screening', screeningSchema);
