const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  age_months: { type: Number }, 
  progress: { type: Object },   
});

module.exports = mongoose.model('Child', childSchema);
