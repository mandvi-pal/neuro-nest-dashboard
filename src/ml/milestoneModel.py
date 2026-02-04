# ml/milestoneModel.py
def predict_future_milestones(child_id, scores):
    # Example structure — replace with your model logic
    # scores: { emotion: 0.7, story: 0.6, sound: 0.5, sensor: 0.8, voice: 0.55, quiz: 0.62 }
    trend = {
        'language': scores.get('voice', 0.5) * 0.6 + scores.get('story', 0.4) * 0.4,
        'motor': scores.get('sensor', 0.5),
        'social_emotional': scores.get('emotion', 0.5),
        'cognition': scores.get('quiz', 0.5)
    }
    # Forecast next 3 months (dummy)
    forecast = { 'month1': {k: v*1.05 for k, v in trend.items()},
                 'month2': {k: v*1.1 for k, v in trend.items()},
                 'month3': {k: v*1.15 for k, v in trend.items()} }
    return { 'current': trend, 'forecast': forecast }
