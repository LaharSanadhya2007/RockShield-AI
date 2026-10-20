from pathlib import Path

import cv2
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
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


# ========================================
# Device
# ========================================

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("ROCKSHIELD AI - Final Test Evaluation")
print(f"Device: {DEVICE}")
print(f"Test dataset: {TEST_DATASET_DIR}")
print(f"Model: {MODEL_PATH}")
# ========================================
# GeoCrack Test Dataset
# ========================================

class GeoCrackTestDataset(Dataset):

    def __init__(self, images_dir, masks_dir):
        self.images_dir = Path(images_dir)
        self.masks_dir = Path(masks_dir)

        self.image_files = sorted(
            self.images_dir.glob("*.png")
        )

    def __len__(self):
        return len(self.image_files)

    def __getitem__(self, index):

        image_path = self.image_files[index]

        mask_name = image_path.name.replace(
            "_original_patch",
            "_binarymask_patch"
        )

        mask_path = self.masks_dir / mask_name

        # Read image
        image = cv2.imread(
            str(image_path),
            cv2.IMREAD_COLOR
        )

        # Read ground-truth mask
        mask = cv2.imread(
            str(mask_path),
            cv2.IMREAD_GRAYSCALE
        )

        if image is None:
            raise RuntimeError(
                f"Could not read image: {image_path}"
            )

        if mask is None:
            raise RuntimeError(
                f"Could not read mask: {mask_path}"
            )

        # BGR -> RGB
        image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )

        # Normalize image to 0-1
        image = image.astype(
            np.float32
        ) / 255.0

        # Convert mask to binary 0/1
        mask = (
            mask > 127
        ).astype(np.float32)

        # HWC -> CHW
        image = np.transpose(
            image,
            (2, 0, 1)
        )

        # Add mask channel
        mask = np.expand_dims(
            mask,
            axis=0
        )

        return (
            torch.from_numpy(image),
            torch.from_numpy(mask)
        )


# ========================================
# Test DataLoader
# ========================================

test_dataset = GeoCrackTestDataset(
    TEST_IMAGES_DIR,
    TEST_MASKS_DIR
)

test_loader = DataLoader(
    test_dataset,
    batch_size=8,
    shuffle=False,
    num_workers=0,
    pin_memory=True
)

print(
    f"Test samples: {len(test_dataset)}"
)

print(
    f"Test batches: {len(test_loader)}"
)
# ========================================
# Create Segmentation Model
# ========================================

model = smp.Unet(
    encoder_name="resnet18",
    encoder_weights=None,
    in_channels=3,
    classes=1
)

model = model.to(DEVICE)


# ========================================
# Load Best Trained Weights
# ========================================

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Best model not found: {MODEL_PATH}"
    )

model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location=DEVICE
    )
)

model.eval()

print("\nBest trained model loaded successfully.")
print("Architecture: U-Net")
print("Encoder: ResNet18")
print(f"Model device: {next(model.parameters()).device}")
# ========================================
# Final Test Evaluation
# ========================================

total_intersection = 0.0
total_union = 0.0
total_predicted = 0.0
total_target = 0.0

print("\nStarting final test evaluation...")


with torch.no_grad():

    for batch_number, (images, masks) in enumerate(
        test_loader,
        start=1
    ):

        images = images.to(
            DEVICE,
            non_blocking=True
        )

        masks = masks.to(
            DEVICE,
            non_blocking=True
        )

        predictions = model(images)

        probabilities = torch.sigmoid(
            predictions
        )

        predicted_masks = (
            probabilities > 0.5
        ).float()


        # --------------------------------
        # Accumulate segmentation values
        # --------------------------------

        intersection = (
            predicted_masks * masks
        ).sum()

        union = (
            predicted_masks
            + masks
            - predicted_masks * masks
        ).sum()

        total_intersection += intersection.item()
        total_union += union.item()

        total_predicted += (
            predicted_masks.sum().item()
        )

        total_target += (
            masks.sum().item()
        )


        if batch_number % 50 == 0:
            print(
                f"Evaluated batch "
                f"{batch_number}/{len(test_loader)}"
            )


# ========================================
# Calculate Final Metrics
# ========================================

smooth = 1e-7

test_iou = (
    total_intersection + smooth
) / (
    total_union + smooth
)

test_dice = (
    2 * total_intersection + smooth
) / (
    total_predicted
    + total_target
    + smooth
)


# ========================================
# Final Results
# ========================================

print(
    "\n========================================"
)

print(
    "ROCKSHIELD AI - FINAL TEST RESULTS"
)

print(
    "========================================"
)

print(
    f"Test Images: {len(test_dataset)}"
)

print(
    f"Test IoU: {test_iou:.4f}"
)

print(
    f"Test Dice: {test_dice:.4f}"
)

print(
    "========================================"
)