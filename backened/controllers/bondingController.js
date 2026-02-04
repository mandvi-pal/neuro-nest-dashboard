
exports.getBondingScore = async (req, res) => {
  try {
    const { childId, text } = req.body;

    
    if (!childId || !text || !text.trim()) {
      return res.status(400).json({ error: 'Child ID and non-empty text are required' });
    }

    
    const positiveWords = ['love', 'happy', 'play', 'hug', 'smile', 'together'];
    const negativeWords = ['angry', 'sad', 'fight', 'cry', 'ignore'];

    let score = 0.5; 
    const lowerText = text.toLowerCase();

    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) {
        score += 0.1;
        console.log(`Matched positive word: ${word}`);
      }
    });

  
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) {
        score -= 0.1;
        console.log(`Matched negative word: ${word}`);
      }
    });

    score = Math.max(0, Math.min(1, score));

    
    let intervention = '';
    if (score >= 0.8) {
      intervention = '🥰 Excellent bonding! Keep celebrating small moments together.';
    } else if (score >= 0.6) {
      intervention = '😊 Good bonding. Try adding more playtime or hugs.';
    } else if (score >= 0.4) {
      intervention = '😐 Moderate bonding. Spend a few minutes listening calmly today.';
    } else {
      intervention = '😢 Needs more connection. Plan a simple joyful activity together.';
    }

   
    res.json({ score, intervention });
  } catch (err) {
    console.error('Bonding score error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
