from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import base64, cv2, numpy as np, datetime

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "✅ Flask AI is Running!"

@app.route('/api/emotion', methods=['POST'])
def detect_emotion():
    try:
        payload = request.get_json(force=True)
        image_data = payload.get('image')

        if not image_data:
            return jsonify({'error': 'No image provided'}), 400

        
        header, encoded = image_data.split(",", 1)
        img_bytes = base64.b64decode(encoded)
        np_img = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        print("🔍 DeepFace is analyzing...")
       
        results = DeepFace.analyze(
            img_path=img, 
            actions=['emotion'], 
            enforce_detection=False,
            detector_backend='opencv'
        )
        
        
        if not isinstance(results, list):
            results = [results]
            
        final_results = []
        for res in results:
           
            region_data = res.get('region', {})
            clean_region = {"x": 0, "y": 0, "w": 0, "h": 0}
            
            if isinstance(region_data, dict):
                
                clean_region = {k: int(v) for k, v in region_data.items() if isinstance(v, (int, float))}
            
            
            final_results.append({
                "dominant_emotion": res.get('dominant_emotion', 'unknown'),
                "emotion": {k: float(v) for k, v in res.get('emotion', {}).items()},
                "region": clean_region
            })

        print("✅ Analysis Success!")
        return jsonify({
            "status": "success",
            "emotions": final_results
        })

    except Exception as e:
        print(f"🔥 Flask Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)