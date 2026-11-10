from pathlib import Path

import cv2
import numpy as np

from crack_detector import (
    predict_cracks,
    extract_fracture_features
)


# ========================================
# Project Paths
# ========================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

TEST_IMAGES_DIR = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "geocrack"
    / "test"
    / "images"
)


# ========================================
# Select One Test Image
# ========================================

test_images = sorted(
    TEST_IMAGES_DIR.glob("*.png")
)

if not test_images:
    raise FileNotFoundError(
        f"No test images found in: {TEST_IMAGES_DIR}"
    )

image_path = test_images[0]

print(f"\nTesting image: {image_path.name}")


# ========================================
# Load Image
# ========================================

image = cv2.imread(
    str(image_path),
    cv2.IMREAD_COLOR
)

if image is None:
    raise RuntimeError(
        f"Could not read image: {image_path}"
    )

print(f"Original image shape: {image.shape}")


# ========================================
# Run RockShield AI
# ========================================

result = predict_cracks(image)
features = extract_fracture_features(
    result["mask"]
)

print("\nFracture Features:")
print(
    "Fracture Coverage:",
    features["fracture_coverage_percentage"],
    "%"
)

print(
    "Fracture Regions:",
    features["fracture_region_count"]
)

print(
    "Largest Region:",
    features["largest_region_percentage"],
    "%"
)

mask = result["mask"]
probability_map = result["probability_map"]
overlay = result["overlay"]

print("\nPrediction successful.")
print(f"Mask shape: {mask.shape}")
print(f"Probability map shape: {probability_map.shape}")
print(f"Threshold: {result['threshold']}")

print(
    f"Detected fracture pixels: {int(mask.sum())}"
)

print(
    f"Maximum fracture probability: "
    f"{float(probability_map.max()):.4f}"
)
# ========================================
# Save Fracture Overlay
# ========================================

OUTPUT_DIR = (
    PROJECT_ROOT
    / "outputs"
    / "inference_test"
)

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)

overlay_path = (
    OUTPUT_DIR
    / "fracture_overlay.png"
)

cv2.imwrite(
    str(overlay_path),
    overlay
)

print(
    f"Overlay saved to: {overlay_path}"
)

print("\nROCKSHIELD crack detector test passed.")
# Test empty fracture mask
empty_mask = np.zeros((224, 224), dtype=np.uint8)

empty_features = extract_fracture_features(empty_mask)

print("\nEmpty Mask Test:")
print(empty_features)

assert empty_features["fracture_pixels"] == 0
assert empty_features["fracture_coverage_percentage"] == 0.0
assert empty_features["fracture_region_count"] == 0
assert empty_features["largest_region_percentage"] == 0.0

print("Empty mask test passed.")