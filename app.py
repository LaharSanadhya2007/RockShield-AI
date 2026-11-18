
from flask import Flask, render_template, request, jsonify, send_file
import cv2
import numpy as np
import base64
import json

from ai.report_generator import generate_inspection_report

from ai.crack_detector import (
    predict_cracks,
    extract_fracture_features,
    assess_fracture_severity
)


app = Flask(__name__)

# ==========================================
# Upload and Form Data Limits
# ==========================================

app.config["MAX_CONTENT_LENGTH"] = 30 * 1024 * 1024
app.config["MAX_FORM_MEMORY_SIZE"] = 20 * 1024 * 1024

# ==========================================
# Home
# ==========================================

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

        # Convert uploaded file into NumPy data
        image_bytes = image_file.read()

        numpy_array = np.frombuffer(
            image_bytes,
            np.uint8
        )

        # Decode image using OpenCV
        image = cv2.imdecode(
            numpy_array,
            cv2.IMREAD_COLOR
        )

        if image is None:
            return jsonify({
                "success": False,
                "message": "The image could not be decoded."
            }), 400

        # Image dimensions
        height, width = image.shape[:2]

        # Convert to grayscale
        gray = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY
        )

        # Brightness
        brightness = float(
            np.mean(gray)
        )

        # Blur / Sharpness
        sharpness = float(
            cv2.Laplacian(
                gray,
                cv2.CV_64F
            ).var()
        )

        # Basic quality checks
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

        # Overall quality
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

        # Send result back to frontend
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

    # Check whether an image was sent
    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "No image was received."
        }), 400

    image_file = request.files["image"]

    # Check whether a file was selected
    if image_file.filename == "":
        return jsonify({
            "success": False,
            "message": "No image was selected."
        }), 400

    try:

        # Convert uploaded file into NumPy data
        image_bytes = image_file.read()

        numpy_array = np.frombuffer(
            image_bytes,
            np.uint8
        )

        # Decode image using OpenCV
        image = cv2.imdecode(
            numpy_array,
            cv2.IMREAD_COLOR
        )

        if image is None:
            return jsonify({
                "success": False,
                "message": "The image could not be decoded."
            }), 400

        # Run trained crack segmentation model
        result = predict_cracks(image)

        # Extract fracture features
        features = extract_fracture_features(
            result["mask"]
        )

        # Assess image-based fracture severity
        severity_assessment = assess_fracture_severity(
            features
        )

        mask = result["mask"]
        probability_map = result["probability_map"]
        overlay = result["overlay"]

        # Calculate image-derived statistics
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

        # Encode AI overlay as PNG
        encode_success, encoded_overlay = cv2.imencode(
            ".png",
            overlay
        )

        if not encode_success:
            raise RuntimeError(
                "Could not encode fracture overlay."
            )

        # Convert PNG into Base64
        overlay_base64 = base64.b64encode(
            encoded_overlay
        ).decode("utf-8")

        # Browser-readable image URL
        overlay_data_url = (
            "data:image/png;base64,"
            + overlay_base64
        )

        # Return AI analysis to frontend
        return jsonify({

            "success": True,

            "analysis": {

                "fracture_pixels": fracture_pixels,

                "fracture_percentage": round(
                    fracture_percentage,
                    2
                ),

                "fracture_coverage_percentage": features[
                    "fracture_coverage_percentage"
                ],

                "fracture_region_count": features[
                    "fracture_region_count"
                ],

                "severity": severity_assessment["severity"],

                "maximum_probability": round(
                    maximum_probability,
                    4
                ),

                "threshold": result["threshold"],

                "overlay_image": overlay_data_url
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
# ROCKSHIELD AI PDF Inspection Report API
# ==========================================

@app.route("/generate-report", methods=["POST"])
def generate_report():

    try:

        # Check original image
        if "original_image" not in request.files:
            return jsonify({
                "success": False,
                "message": "Original image is missing."
            }), 400

        original_file = request.files["original_image"]

        if original_file.filename == "":
            return jsonify({
                "success": False,
                "message": "No original image was selected."
            }), 400

        # Read and encode original image
        original_bytes = original_file.read()

        if not original_bytes:
            return jsonify({
                "success": False,
                "message": "Original image is empty."
            }), 400

        original_image = base64.b64encode(
            original_bytes
        ).decode("utf-8")

        # Get AI analysis data
        analysis = json.loads(
            request.form.get("analysis", "{}")
        )

        if not analysis:
            return jsonify({
                "success": False,
                "message": "AI analysis data is missing."
            }), 400

        # Get AI overlay
        overlay_image = request.form.get(
            "overlay_image",
            ""
        )

        if not overlay_image:
            return jsonify({
                "success": False,
                "message": "AI fracture overlay is missing."
            }), 400

        # Get site details
        site_details = json.loads(
            request.form.get("site_details", "{}")
        )

        # Generate PDF
        pdf_buffer = generate_inspection_report(
            analysis=analysis,
            original_image=original_image,
            overlay_image=overlay_image,
            site_details=site_details
        )

        pdf_buffer.seek(0)

        # Send PDF to browser
        return send_file(
            pdf_buffer,
            mimetype="application/pdf",
            as_attachment=True,
            download_name="ROCKSHIELD_Inspection_Report.pdf"
        )

    except Exception as error:

        print(
            "PDF report generation error:",
            error
        )

        return jsonify({
            "success": False,
            "message": "Could not generate the inspection report."
        }), 500
# ==========================================
# Run Flask Application
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)