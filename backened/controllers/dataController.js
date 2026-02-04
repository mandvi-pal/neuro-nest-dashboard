const Child = require('../models/Child');
const { calculateAgeInMonths, calculateAgeReadable } = require('../utils/age');


exports.getChildren = async (req, res) => {
  try {
    const children = await Child.find();
    const updated = children.map(child => ({
      ...child._doc,
      age_months: calculateAgeInMonths(child.dob),
      age_readable: calculateAgeReadable(child.dob)
    }));
    res.json(updated);
  } catch (err) {
    console.error('❌ Error fetching children:', err);
    res.status(500).json({ error: 'Failed to fetch children' });
  }
};

exports.addChild = async (req, res) => {
  const { name, dob, gender } = req.body;
  if (!name || !dob || !gender) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (new Date(dob) > new Date()) {
    return res.status(400).json({ error: 'DOB cannot be in the future' });
  }
  try {
    const age_months = calculateAgeInMonths(dob);
    const age_readable = calculateAgeReadable(dob);
    const newChild = new Child({ name, dob, gender, age_months });
    await newChild.save();
    res.status(201).json({
      message: 'Child added successfully',
      child: { ...newChild._doc, age_readable }
    });
  } catch (err) {
    console.error('❌ Error saving child:', err);
    res.status(500).json({ error: 'Failed to add child' });
  }
};


exports.updateChild = async (req, res) => {
  const { id } = req.params;
  const { name, dob, gender } = req.body;
  if (!name || !dob || !gender) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (new Date(dob) > new Date()) {
    return res.status(400).json({ error: 'DOB cannot be in the future' });
  }
  try {
    const age_months = calculateAgeInMonths(dob);
    const age_readable = calculateAgeReadable(dob);
    const updated = await Child.findByIdAndUpdate(
      id,
      { name, dob, gender, age_months },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Child not found' });
    }
    res.json({ message: 'Child updated successfully', child: { ...updated._doc, age_readable } });
  } catch (err) {
    console.error('❌ Error updating child:', err);
    res.status(500).json({ error: 'Failed to update child' });
  }
};


exports.deleteChild = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Child.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Child not found' });
    }
    res.json({ message: 'Child deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting child:', err);
    res.status(500).json({ error: 'Failed to delete child' });
  }
};


exports.getRecommendations = (req, res) => {
  const { age_months, gender } = req.body;
  if (age_months === undefined || !gender) {
    return res.status(400).json({ error: 'age_months and gender are required' });
  }

  let recommendations = [];

  if (age_months < 36) {
    recommendations.push("Introduce sensory play and basic motor skills.");
  } else if (age_months < 72) {
    recommendations.push("Start basic reading and storytelling.");
  } else if (age_months < 144) {
    recommendations.push("Encourage group activities and emotional awareness.");
  } else if (age_months < 216) {
    recommendations.push("Introduce coding games and logical puzzles.");
  } else {
    recommendations.push("Explore career aptitude tests and mental wellness check-ins.");
  }

  if (gender === "Female") {
    recommendations.push("Support STEM learning through interactive apps.");
  } else {
    recommendations.push("Encourage creative expression through design and music.");
  }

  res.json({ recommendations });
};


exports.predictMilestone = (req, res) => {
  const { age_months, gender, cognitive_score, emotional_score, physical_score } = req.body;

  if (
    age_months === undefined ||
    gender === undefined ||
    cognitive_score === undefined ||
    emotional_score === undefined ||
    physical_score === undefined
  ) {
    return res.status(400).json({ error: 'All fields are required for prediction' });
  }

  const totalScore = cognitive_score + emotional_score + physical_score;
  let milestone = "";

  if (age_months < 36) {
    milestone = totalScore < 150
      ? "Focus on sensory play and basic motor skills"
      : "Ready for early storytelling and shape recognition";
  } else if (age_months < 72) {
    milestone = totalScore < 210
      ? "Practice short sentences and 2-step instructions"
      : "Ready for group play and basic counting";
  } else if (age_months < 144) {
    milestone = totalScore < 270
      ? "Encourage emotional awareness and cooperative play"
      : "Ready for logic puzzles and storytelling";
  } else {
    milestone = totalScore < 300
      ? "Support creative expression and emotional regulation"
      : "Ready for career exploration and mental wellness check-ins";
  }

  res.json({ milestone });
};
