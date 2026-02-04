# ml/feedbackClassifier.py
import math
def bonding_score(child_id, text):
    # Placeholder scoring based on length & positivity
    pos_words = ['love', 'hug', 'play', 'smile', 'together', 'proud']
    score = 0.5 + 0.05 * sum(w in text.lower() for w in pos_words)
    return min(1.0, max(0.0, score))
