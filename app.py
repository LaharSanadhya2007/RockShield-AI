from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np

from ai.crack_detector import predict_cracks


app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


# ==========================================
# Image Quality Check API
# ==========================================

@app.route("/check-image-quality", methods=["POST"])
def check_image_quality():

    # Check whether an image was sent
    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "No image was received."
        }), 400


    image_file = request.files["image"]


    # Check whether a file was actually selected
    if image_file.filename == "":
        return jsonify({
            "success": False,
            "message": "No image was selected."
        }), 400


    try:

        # ------------------------------------------
        # Convert uploaded file into NumPy data
        # ------------------------------------------

        image_bytes = image_file.read()

        numpy_array = np.frombuffer(
            image_bytes,
            np.uint8
        )


        # ------------------------------------------
        # Decode image using OpenCV
        # ------------------------------------------

        image = cv2.imdecode(
            numpy_array,
            cv2.IMREAD_COLOR
        )


        if image is None:
            return jsonify({
                "success": False,
                "message": "The image could not be decoded."
            }), 400


        # ------------------------------------------
        # Image dimensions
        # ------------------------------------------

        height, width = image.shape[:2]


        # ------------------------------------------
        # Convert to grayscale
        # ------------------------------------------

        gray = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY
        )


        # ------------------------------------------
        # Brightness
        # ------------------------------------------

        brightness = float(
            np.mean(gray)
        )


        # ------------------------------------------
        # Blur / Sharpness
        #
        # Higher variance generally means
        # more visible edge/detail information.
        # ------------------------------------------

        sharpness = float(
            cv2.Laplacian(
                gray,
                cv2.CV_64F
            ).var()
        )


        # ------------------------------------------
        # Basic quality checks
        # These are initial engineering thresholds.
        # We can tune them later using real
        # rock-surface images.
        # ------------------------------------------

        resolution_ok = (
            width >= 640 and
            height >= 480
        )

        brightness_ok = (
            45 <= brightness <= 210
        )

        sharpness_ok = (
            sharpness >= 80
        )


        # ------------------------------------------
        # Overall Quality
        # ------------------------------------------

        passed_checks = sum([
            resolution_ok,
            brightness_ok,
            sharpness_ok
        ])


        if passed_checks == 3:
            quality = "GOOD"

        elif passed_checks == 2:
            quality = "ACCEPTABLE"

        else:
            quality = "POOR"


        # ------------------------------------------
        # Send result back to frontend
        # ------------------------------------------

        return jsonify({

            "success": True,

            "quality": quality,

            "metrics": {
                "width": width,
                "height": height,
                "brightness": round(
                    brightness,
                    2
                ),
                "sharpness": round(
                    sharpness,
                    2
                )
            },

            "checks": {
                "resolution": resolution_ok,
                "brightness": brightness_ok,
                "sharpness": sharpness_ok
            }

        })


    except Exception as error:

        print(
            "Image quality check error:",
            error
        )

        return jsonify({
            "success": False,
            "message": "Image quality analysis failed."
        }), 500



    # ==========================================
# RockShield AI Crack Analysis API
# ==========================================

@app.route("/analyze-image", methods=["POST"])
def analyze_image():

    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "No image was received."
        }), 400

    image_file = request.files["image"]

    if image_file.filename == "":
        return jsonify({
            "success": False,
            "message": "No image was selected."
        }), 400

    try:

        # Convert uploaded file to NumPy data
        image_bytes = image_file.read()

        numpy_array = np.frombuffer(
            image_bytes,
            np.uint8
        )

        # Decode with OpenCV
        image = cv2.imdecode(
            numpy_array,
            cv2.IMREAD_COLOR
        )

        if image is None:
            return jsonify({
                "success": False,
                "message": "The image could not be decoded."
            }), 400

        # Run the trained segmentation model
        result = predict_cracks(image)

        mask = result["mask"]
        probability_map = result["probability_map"]

        # Basic image-derived statistics
        total_pixels = mask.size

        fracture_pixels = int(
            mask.sum()
        )

        fracture_percentage = (
            fracture_pixels / total_pixels
        ) * 100

        maximum_probability = float(
            probability_map.max()
        )

        return jsonify({
            "success": True,

            "analysis": {
                "fracture_pixels": fracture_pixels,

                "fracture_percentage": round(
                    fracture_percentage,
                    2
                ),

                "maximum_probability": round(
                    maximum_probability,
                    4
                ),

                "threshold": result["threshold"]
            }
        })

    except Exception as error:

        print(
            "AI crack analysis error:",
            error
        )

        return jsonify({
            "success": False,
            "message": "AI crack analysis failed."
        }), 500
# ==========================================
# Run Flask Application
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)