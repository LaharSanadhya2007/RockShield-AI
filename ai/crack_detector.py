from pathlib import Path

import cv2
import numpy as np
import torch
import segmentation_models_pytorch as smp


# ========================================
# Project Paths
# ========================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "rockshield_crack_best.pth"
)


# ========================================
# AI Configuration
# ========================================

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

PREDICTION_THRESHOLD = 0.5


# ========================================
# Load Crack Segmentation Model
# ========================================

def load_crack_model():

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"RockShield crack model not found: {MODEL_PATH}"
        )

    model = smp.Unet(
        encoder_name="resnet18",
        encoder_weights=None,
        in_channels=3,
        classes=1
    )

    state_dict = torch.load(
        MODEL_PATH,
        map_location=DEVICE
    )

    model.load_state_dict(state_dict)

    model = model.to(DEVICE)

    model.eval()

    return model


# Load once when this module starts
crack_model = load_crack_model()

print(
    f"RockShield crack detector loaded on: {DEVICE}"
)
# ========================================
# Crack Segmentation Inference
# ========================================

def predict_cracks(image_bgr):

    if image_bgr is None:
        raise ValueError(
            "Input image cannot be None."
        )

    # Keep original image size
    original_height, original_width = image_bgr.shape[:2]

    # Convert OpenCV BGR image to RGB
    image_rgb = cv2.cvtColor(
        image_bgr,
        cv2.COLOR_BGR2RGB
    )

    # GeoCrack model was trained on 224x224 patches
    model_image = cv2.resize(
        image_rgb,
        (224, 224),
        interpolation=cv2.INTER_AREA
    )

    # Normalize exactly as during training
    model_image = (
        model_image.astype(np.float32) / 255.0
    )

    # HWC -> CHW
    image_tensor = np.transpose(
        model_image,
        (2, 0, 1)
    )

    # NumPy -> PyTorch tensor
    image_tensor = (
        torch.from_numpy(image_tensor)
        .unsqueeze(0)
        .to(DEVICE)
    )

    # ------------------------------------
    # Model Inference
    # ------------------------------------

    with torch.no_grad():

        logits = crack_model(
            image_tensor
        )

        probability_map = torch.sigmoid(
            logits
        )

    probability_map = (
        probability_map
        .squeeze()
        .cpu()
        .numpy()
    )

    # Binary fracture mask
    binary_mask = (
        probability_map >= PREDICTION_THRESHOLD
    ).astype(np.uint8)

    # Restore mask to original image size
    binary_mask = cv2.resize(
        binary_mask,
        (original_width, original_height),
        interpolation=cv2.INTER_NEAREST
    )
    # ------------------------------------
    # Create Fracture Overlay
    # ------------------------------------

    overlay_image = image_bgr.copy()

    # Highlight predicted fracture pixels
    # in red (BGR format for OpenCV)
    fracture_color = np.array(
        [0, 0, 255],
        dtype=np.uint8
    )

    # Create a colored fracture layer
    fracture_layer = np.zeros_like(
        overlay_image
    )

    fracture_layer[
        binary_mask == 1
    ] = fracture_color

    # Blend fracture markings with
    # the original rock image
    overlay_image = cv2.addWeighted(
        overlay_image,
        1.0,
        fracture_layer,
        0.65,
        0
    )

    return {
        "mask": binary_mask,
        "probability_map": probability_map,
        "overlay": overlay_image,
        "threshold": PREDICTION_THRESHOLD
    }


# ========================================
# Fracture Feature Extraction
# ========================================

def extract_fracture_features(binary_mask):

    if binary_mask is None:
        raise ValueError(
            "Binary fracture mask cannot be None."
        )

    # Ensure mask contains only 0 and 1
    mask = (
        binary_mask > 0
    ).astype(np.uint8)

    total_pixels = mask.size

    fracture_pixels = int(
        mask.sum()
    )

    # Percentage of image covered by
    # predicted fracture regions
    fracture_coverage = (
        fracture_pixels / total_pixels
    ) * 100

    # Find separate connected
    # fracture regions
    number_of_labels, labels, stats, _ = (
        cv2.connectedComponentsWithStats(
            mask,
            connectivity=8
        )
    )

    # Label 0 is the background
    component_areas = []

    for label_index in range(
        1,
        number_of_labels
    ):

        area = int(
            stats[
                label_index,
                cv2.CC_STAT_AREA
            ]
        )

        component_areas.append(area)

    fracture_region_count = len(
        component_areas
    )

    if component_areas:
        largest_region_pixels = max(
            component_areas
        )
    else:
        largest_region_pixels = 0

    largest_region_percentage = (
        largest_region_pixels / total_pixels
    ) * 100

    return {
        "fracture_pixels": fracture_pixels,
        "fracture_coverage_percentage": round(
            fracture_coverage,
            2
        ),
        "fracture_region_count":
            fracture_region_count,
        "largest_region_pixels":
            largest_region_pixels,
        "largest_region_percentage": round(
            largest_region_percentage,
            2
        )
    }

# ========================================
# Image-Based Severity Assessment
# ========================================

def assess_fracture_severity(features):

    if not features:
        raise ValueError(
            "Fracture features cannot be empty."
        )

    fracture_coverage = features[
        "fracture_coverage_percentage"
    ]

    largest_region = features[
        "largest_region_percentage"
    ]

    fracture_regions = features[
        "fracture_region_count"
    ]

    # Initial prototype thresholds.
    # These are not validated geological limits.

    if (
        fracture_coverage >= 5.0
        or largest_region >= 3.0
    ):
        severity = "Severe"

    elif (
        fracture_coverage >= 2.0
        or largest_region >= 1.0
        or fracture_regions >= 10
    ):
        severity = "Moderate"

    else:
        severity = "Minor"

    return {
        "severity": severity,
        "assessment_type": "Image-based indicator",
        "disclaimer": (
            "This is an image-based estimate, "
            "not a confirmed geological assessment."
        )
    }
