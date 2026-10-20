from pathlib import Path

import cv2
import numpy as np
import torch
import segmentation_models_pytorch as smp


# ========================================
# Project Paths
# ========================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

TEST_DATASET_DIR = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "geocrack"
    / "test"
)

TEST_IMAGES_DIR = TEST_DATASET_DIR / "images"
TEST_MASKS_DIR = TEST_DATASET_DIR / "masks"

MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "rockshield_crack_best.pth"
)

OUTPUT_DIR = (
    PROJECT_ROOT
    / "outputs"
    / "crack_predictions"
)

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ========================================
# Device
# ========================================

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("ROCKSHIELD AI - Crack Prediction Visualization")
print(f"Device: {DEVICE}")
print(f"Model: {MODEL_PATH}")
print(f"Output directory: {OUTPUT_DIR}")
# ========================================
# Load Trained Segmentation Model
# ========================================

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Trained model not found: {MODEL_PATH}"
    )

model = smp.Unet(
    encoder_name="resnet18",
    encoder_weights=None,
    in_channels=3,
    classes=1
).to(DEVICE)

model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location=DEVICE
    )
)

model.eval()

print("\nBest trained model loaded successfully.")


# ========================================
# Find Test Images
# ========================================

test_images = sorted(
    TEST_IMAGES_DIR.glob("*.png")
)

print(f"Test images available: {len(test_images)}")

if len(test_images) == 0:
    raise RuntimeError(
        f"No test images found in: {TEST_IMAGES_DIR}"
    )


# Select a small sample for visual inspection
NUM_SAMPLES = 10

selected_images = test_images[:NUM_SAMPLES]

print(
    f"Images selected for visualization: "
    f"{len(selected_images)}"
)
# ========================================
# Generate Visual Predictions
# ========================================

print("\nGenerating crack prediction visualizations...")

for sample_number, image_path in enumerate(
    selected_images,
    start=1
):

    # ------------------------------------
    # Load original image
    # ------------------------------------

    original_bgr = cv2.imread(
        str(image_path),
        cv2.IMREAD_COLOR
    )

    if original_bgr is None:
        print(f"Could not read: {image_path.name}")
        continue

    original_rgb = cv2.cvtColor(
        original_bgr,
        cv2.COLOR_BGR2RGB
    )


    # ------------------------------------
    # Load ground-truth mask
    # ------------------------------------

    mask_name = image_path.name.replace(
        "_original_patch",
        "_binarymask_patch"
    )

    mask_path = TEST_MASKS_DIR / mask_name

    ground_truth = cv2.imread(
        str(mask_path),
        cv2.IMREAD_GRAYSCALE
    )

    if ground_truth is None:
        print(f"Could not read mask: {mask_name}")
        continue


    # ------------------------------------
    # Prepare image for AI model
    # ------------------------------------

    image_normalized = (
        original_rgb.astype(np.float32) / 255.0
    )

    image_tensor = np.transpose(
        image_normalized,
        (2, 0, 1)
    )

    image_tensor = (
        torch.from_numpy(image_tensor)
        .unsqueeze(0)
        .to(DEVICE)
    )


    # ------------------------------------
    # AI Prediction
    # ------------------------------------

    with torch.no_grad():

        logits = model(image_tensor)

        probability_map = torch.sigmoid(
            logits
        )

        predicted_mask = (
            probability_map > 0.5
        ).float()


    predicted_mask = (
        predicted_mask
        .squeeze()
        .cpu()
        .numpy()
    )

    predicted_mask = (
        predicted_mask * 255
    ).astype(np.uint8)


    # ------------------------------------
    # Create prediction overlay
    # ------------------------------------

    overlay = original_bgr.copy()

    crack_pixels = predicted_mask > 0

    overlay[crack_pixels] = (
        0,
        0,
        255
    )


    # Blend original image and crack mask
    overlay = cv2.addWeighted(
        original_bgr,
        0.70,
        overlay,
        0.30,
        0
    )


    # ------------------------------------
    # Prepare comparison panels
    # ------------------------------------

    ground_truth_bgr = cv2.cvtColor(
        ground_truth,
        cv2.COLOR_GRAY2BGR
    )

    predicted_mask_bgr = cv2.cvtColor(
        predicted_mask,
        cv2.COLOR_GRAY2BGR
    )


    # Add labels
    cv2.putText(
        original_bgr,
        "Original",
        (10, 25),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (255, 255, 255),
        2
    )

    cv2.putText(
        ground_truth_bgr,
        "Ground Truth",
        (10, 25),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (0, 255, 0),
        2
    )

    cv2.putText(
        predicted_mask_bgr,
        "AI Prediction",
        (10, 25),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (0, 255, 255),
        2
    )

    cv2.putText(
        overlay,
        "Prediction Overlay",
        (10, 25),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (255, 255, 255),
        2
    )


    # ------------------------------------
    # Combine four views
    # ------------------------------------

    comparison = np.hstack(
        (
            original_bgr,
            ground_truth_bgr,
            predicted_mask_bgr,
            overlay
        )
    )


    # ------------------------------------
    # Save result
    # ------------------------------------

    output_path = (
        OUTPUT_DIR
        / f"prediction_{sample_number:02d}.png"
    )

    cv2.imwrite(
        str(output_path),
        comparison
    )

    print(
        f"Saved {sample_number}/{len(selected_images)}: "
        f"{output_path.name}"
    )


print("\nVisualization complete.")
print(f"Results saved in: {OUTPUT_DIR}")