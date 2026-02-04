# ml/summaryGenerator.py
def generate_tips(child_id, scores):
    tips = []
    if scores.get('voice', 0) < 0.6:
        tips.append('Storytime: read and repeat 5 new words together.')
    if scores.get('sensor', 0) < 0.6:
        tips.append('Fine motor: 2‑minute finger tracing on sand or rice.')
    if scores.get('emotion', 0) < 0.6:
        tips.append('Emotion play: mirror faces and name the feelings.')
    if not tips:
        tips = ['Free play: choose a favorite game and celebrate small wins!']
    return tips
