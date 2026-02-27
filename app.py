from flask import Flask, request, jsonify, render_template
import os
from werkzeug.utils import secure_filename
from verify_slip import preprocess_image, extract_text, parse_slip_data

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/verify', methods=['POST'])
def verify_slip():
    if 'slip_image' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['slip_image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            preprocessed_img, _ = preprocess_image(filepath)
            extracted_text = extract_text(preprocessed_img)
            parsed_data = parse_slip_data(extracted_text)
            
            return jsonify({
                "status": "success",
                "data": parsed_data,
                "raw_text": extracted_text
            })
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
        finally:
            if os.path.exists(filepath):
                try:
                    os.remove(filepath)
                except Exception as e:
                    pass

if __name__ == '__main__':
    app.run(debug=True, port=5000)
