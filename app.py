from flask import Flask, send_from_directory, render_template, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from keras.models import model_from_json
import base64
import io
from PIL import Image

app = Flask(__name__, static_folder='.', template_folder='.')
CORS(app)

# Load model architecture and weights
try:
    json_file = open("Model/atozmodel.json", "r")
    model_json = json_file.read()
    json_file.close()
    model = model_from_json(model_json)
    model.load_weights("Model/atozmodel.h5")
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    exit(1)

def extract_features(image):
    feature = np.array(image)
    feature = feature.reshape(1,64,64,1)
    return feature/255.0

@app.route('/')
def serve():
    """Serves the main page"""
    return render_template('index.html')

@app.route('/detect', methods=['POST', 'OPTIONS'])
def detect():
    if request.method == 'OPTIONS':
        # Preflight request. Reply successfully:
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    try:
        # Get image data from request
        data = request.json
        if 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
            
        image_data = data['image'].split(',')[1]  # Remove the data URL prefix
        image_bytes = base64.b64decode(image_data)
        
        # Convert to OpenCV format
        image = Image.open(io.BytesIO(image_bytes))
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Process frame
        cropframe = frame[40:300, 0:300]
        cropframe = cv2.cvtColor(cropframe, cv2.COLOR_BGR2GRAY)
        cropframe = cv2.resize(cropframe, (64,64))
        cropframe = extract_features(cropframe)
        
        # Get prediction
        pred = model.predict(cropframe)
        pred_index = pred.argmax()
        
        # Define labels
        label = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        
        # Check if prediction index is valid
        if 0 <= pred_index < len(label):
            prediction_label = label[pred_index]
            confidence = float(np.max(pred) * 100)
        else:
            prediction_label = "Unknown"
            confidence = 0.0
        
        return jsonify({
            'gesture': prediction_label,
            'confidence': confidence
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/<path:path>')
def serve_static(path):
    """Serves static files"""
    return send_from_directory('.', path)

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 