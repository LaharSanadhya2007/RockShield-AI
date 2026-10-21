from pathlib import Path

import cv2

from crack_detector import predict_cracks


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