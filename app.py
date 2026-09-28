"""
RockShield AI - Flask backend

Folder layout (all four files in the SAME folder):
    app.py
    index.html
    style.css
    script.js
    model.h5        <- optional, only if you have a trained Keras model

Install:
    pip install flask opencv-python numpy
    pip install tensorflow          # only if you use model.h5

Run:
    python app.py
Then open http://127.0.0.1:5000
"""

import os

import cv2
import numpy as np
from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.h5")   # optional trained model
MODEL_INPUT_SIZE = (224, 224)                      # change to your model's input size

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10 MB, same as the website


# ----------------------------------------------------------------------
# Serve the website (only these files, so app.py is never exposed)
# ----------------------------------------------------------------------
from flask import Flask, render_template, request, jsonify
@app.route("/")
def home():
    return render_template("index.html")

# ----------------------------------------------------------------------
# Optional: load a trained Keras model if model.h5 exists
# ----------------------------------------------------------------------
model = None
if os.path.exists(MODEL_PATH):
    try:
        from tensorflow.keras.models import load_model  # noqa: E402

        model = load_model(MODEL_PATH)
        print("Loaded model:", MODEL_PATH)
    except Exception as exc:  # TensorFlow missing or bad file
        print("Could not load model.h5, using OpenCV method instead:", exc)


def predict_with_model(img_bgr):
    """Assumes ONE sigmoid output = probability that the image has a crack.
    If your model is different (2 softmax outputs, other class order,
    other preprocessing), edit this function only."""
    rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    rgb = cv2.resize(rgb, MODEL_INPUT_SIZE).astype("float32") / 255.0
    prob = float(np.ravel(model.predict(rgb[None, ...], verbose=0))[0])

    crack = prob >= 0.5
    confidence = prob if crack else 1 - prob
    if not crack:
        severity = "none"
    elif prob >= 0.9:
        severity = "severe"
    elif prob >= 0.7:
        severity = "moderate"
    else:
        severity = "low"
    return crack, confidence, severity


# ----------------------------------------------------------------------
# Default method: OpenCV crack finder (works with no training)
# Cracks are thin, dark and long, so we look for dark thin lines
# and keep only the long, stretched-out ones.
# ----------------------------------------------------------------------
def predict_with_opencv(img_bgr):
    h, w = img_bgr.shape[:2]
    longest_side = max(h, w)
    if longest_side > 800:
        scale = 800.0 / longest_side
        img_bgr = cv2.resize(img_bgr, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
        h, w = img_bgr.shape[:2]

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    gray = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(gray)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    # Black-hat highlights dark, thin structures on a lighter surface
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)

    otsu, _ = cv2.threshold(blackhat, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    _, mask = cv2.threshold(blackhat, max(otsu, 25), 255, cv2.THRESH_BINARY)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))

    total_area = h * w
    diagonal = float(np.hypot(h, w))
    count, _, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)

    crack_pixels = 0
    longest = 0.0
    for i in range(1, count):
        x, y, bw, bh, area = stats[i]
        span = float(np.hypot(bw, bh))
        elongated = max(bw, bh) / max(1, min(bw, bh)) >= 2.5 or span >= 0.25 * diagonal
        if area >= 0.0004 * total_area and span >= 0.12 * diagonal and elongated:
            crack_pixels += int(area)
            longest = max(longest, span / diagonal)

    coverage = crack_pixels / total_area
    crack = longest >= 0.15 and coverage >= 0.002

    if not crack:
        return False, float(min(0.95, 0.75 + (0.15 - longest))), "none"

    confidence = float(min(0.97, 0.60 + longest * 0.6 + coverage * 8))
    if coverage >= 0.03 or longest >= 0.7:
        severity = "severe"
    elif coverage >= 0.01 or longest >= 0.4:
        severity = "moderate"
    else:
        severity = "low"
    return True, confidence, severity


# ----------------------------------------------------------------------
# The route the website calls
# ----------------------------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    upload = request.files.get("file")
    if upload is None or upload.filename == "":
        return jsonify(error="No image received. Send it in the 'file' field."), 400

    data = np.frombuffer(upload.read(), np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_COLOR)
    if img is None:
        return jsonify(error="That file could not be read as an image."), 400

    if model is not None:
        crack, confidence, severity = predict_with_model(img)
        engine = "keras-model"
    else:
        crack, confidence, severity = predict_with_opencv(img)
        engine = "opencv"
        print("Prediction:", crack, confidence, severity)

    return jsonify(
        result="Crack detected" if crack else "No crack detected",
        confidence=round(confidence, 4),   # 0 to 1, the website turns it into %
        severity=severity,                 # none, low, moderate or severe
        engine=engine,
    )


@app.errorhandler(413)
def too_large(_):
    return jsonify(error="Image is larger than 10 MB."), 413


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)