from pathlib import Path

import torch
from torch.utils.data import Dataset, DataLoader

import cv2
import numpy as np

import segmentation_models_pytorch as smp


# ========================================
# Project Paths
# ========================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATASET_DIR = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "geocrack"
)

TRAIN_IMAGES_DIR = DATASET_DIR / "train" / "images"
TRAIN_MASKS_DIR = DATASET_DIR / "train" / "masks"

VAL_IMAGES_DIR = DATASET_DIR / "val" / "images"
VAL_MASKS_DIR = DATASET_DIR / "val" / "masks"

MODEL_OUTPUT_DIR = PROJECT_ROOT / "models"


# ========================================
# Training Device
# ========================================

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


print("ROCKSHIELD AI - Crack Segmentation Training")
print(f"Device: {DEVICE}")
print(f"Dataset: {DATASET_DIR}")
# ========================================
# GeoCrack Dataset
# ========================================

class GeoCrackDataset(Dataset):

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

        # Read rock image
        image = cv2.imread(
            str(image_path),
            cv2.IMREAD_COLOR
        )

        # Read binary crack mask
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

        # OpenCV uses BGR.
        # Convert it to RGB for the neural network.
        image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )

        # Convert image values from 0-255 to 0-1.
        image = image.astype(np.float32) / 255.0

        # Convert mask into binary values: 0 or 1.
        mask = (mask > 127).astype(np.float32)

        # HWC -> CHW
        image = np.transpose(
            image,
            (2, 0, 1)
        )

        # Add channel dimension to mask.
        mask = np.expand_dims(
            mask,
            axis=0
        )

        image = torch.from_numpy(image)
        mask = torch.from_numpy(mask)

        return image, mask
    # ========================================
# Dataset Test
# ========================================

train_dataset = GeoCrackDataset(
    TRAIN_IMAGES_DIR,
    TRAIN_MASKS_DIR
)

val_dataset = GeoCrackDataset(
    VAL_IMAGES_DIR,
    VAL_MASKS_DIR
)

print(f"Training samples: {len(train_dataset)}")
print(f"Validation samples: {len(val_dataset)}")

sample_image, sample_mask = train_dataset[0]

print(f"Image shape: {sample_image.shape}")
print(f"Mask shape: {sample_mask.shape}")
print(f"Image range: {sample_image.min():.2f} to {sample_image.max():.2f}")
print(f"Mask values: {torch.unique(sample_mask)}")
# ========================================
# Data Loaders
# ========================================

BATCH_SIZE = 8

train_loader = DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    shuffle=True,
    num_workers=0,
    pin_memory=True
)

val_loader = DataLoader(
    val_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0,
    pin_memory=True
)

print(f"\nBatch size: {BATCH_SIZE}")
print(f"Training batches: {len(train_loader)}")
print(f"Validation batches: {len(val_loader)}")
# ========================================
# Segmentation Model
# ========================================

model = smp.Unet(
    encoder_name="resnet18",
    encoder_weights="imagenet",
    in_channels=3,
    classes=1
)

model = model.to(DEVICE)

print("\nModel created successfully.")
print("Architecture: U-Net")
print("Encoder: ResNet18")
print(f"Model device: {next(model.parameters()).device}")
# ========================================
# Loss Function and Optimizer
# ========================================

dice_loss = smp.losses.DiceLoss(
    mode="binary",
    from_logits=True
)

bce_loss = torch.nn.BCEWithLogitsLoss()


def combined_loss(predictions, targets):
    return (
        dice_loss(predictions, targets)
        + bce_loss(predictions, targets)
    )


optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=1e-4,
    weight_decay=1e-4
)
# ========================================
# Learning Rate Scheduler
# ========================================

scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode="min",
    factor=0.5,
    patience=2
)

print("\nTraining configuration ready.")
print("Loss: Dice Loss + BCEWithLogitsLoss")
print("Optimizer: AdamW")
print("Learning rate: 0.0001")
# ========================================
# Segmentation Metrics
# ========================================

def calculate_metrics(predictions, targets):
    probabilities = torch.sigmoid(predictions)

    predicted_masks = (
        probabilities > 0.5
    ).float()

    intersection = (
        predicted_masks * targets
    ).sum()

    union = (
        predicted_masks
        + targets
        - predicted_masks * targets
    ).sum()

    predicted_sum = predicted_masks.sum()
    target_sum = targets.sum()

    smooth = 1e-7

    iou = (
        intersection + smooth
    ) / (
        union + smooth
    )

    dice = (
        2 * intersection + smooth
    ) / (
        predicted_sum
        + target_sum
        + smooth
    )

    return iou.item(), dice.item()


print("Metrics: IoU + Dice Score")
# ========================================
# Training Configuration
# ========================================

# ========================================
# Training Configuration
# ========================================

EPOCHS = 10

MODEL_OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)

best_validation_dice = 0.0
early_stopping_patience = 4
epochs_without_improvement = 0

best_model_path = (
    MODEL_OUTPUT_DIR
    / "rockshield_crack_best.pth"
)


# ========================================
# Training Loop
# ========================================

for epoch in range(EPOCHS):

    print(
        f"\n{'=' * 50}"
    )

    print(
        f"Epoch {epoch + 1}/{EPOCHS}"
    )

    print(
        f"{'=' * 50}"
    )



    # ------------------------------------
    # Training
    # ------------------------------------

    model.train()

    training_loss = 0.0

    for batch_number, (images, masks) in enumerate(
        train_loader,
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

        optimizer.zero_grad()

        predictions = model(images)

        loss = combined_loss(
            predictions,
            masks
        )

        loss.backward()

        optimizer.step()

        training_loss += loss.item()

        if batch_number % 100 == 0:
            print(
                f"Training batch "
                f"{batch_number}/{len(train_loader)} "
                f"- Loss: {loss.item():.4f}"
            )


    average_training_loss = (
        training_loss / len(train_loader)
    )


    # ------------------------------------
    # Validation
    # ------------------------------------

    model.eval()

    validation_loss = 0.0
    total_iou = 0.0
    total_dice = 0.0


    with torch.no_grad():

        for images, masks in val_loader:

            images = images.to(
                DEVICE,
                non_blocking=True
            )

            masks = masks.to(
                DEVICE,
                non_blocking=True
            )

            predictions = model(images)

            loss = combined_loss(
                predictions,
                masks
            )

            validation_loss += loss.item()

            iou, dice = calculate_metrics(
                predictions,
                masks
            )

            total_iou += iou
            total_dice += dice


    average_validation_loss = (
        validation_loss / len(val_loader)
    )

    average_iou = (
        total_iou / len(val_loader)
    )

    average_dice = (
        total_dice / len(val_loader)
    )


    # ------------------------------------
    # Epoch Results
    # ------------------------------------

    print(
        f"\nEpoch {epoch + 1} Results"
    )

    print(
        f"Training Loss: "
        f"{average_training_loss:.4f}"
    )

    print(
        f"Validation Loss: "
        f"{average_validation_loss:.4f}"
    )

    print(
        f"Validation IoU: "
        f"{average_iou:.4f}"
    )

    print(
        f"Validation Dice: "
        f"{average_dice:.4f}"
    )


    # ------------------------------------
    # Learning Rate Scheduler
    # ------------------------------------

    scheduler.step(average_validation_loss)


    # ------------------------------------
    # Save Best Model + Early Stopping
    # ------------------------------------

    if average_dice > best_validation_dice:

        best_validation_dice = average_dice
        epochs_without_improvement = 0

        torch.save(
            model.state_dict(),
            best_model_path
        )

        print(
            "\nNew best model saved!"
        )

        print(
            f"Best Validation Dice: "
            f"{best_validation_dice:.4f}"
        )

        print(
            f"Model path: "
            f"{best_model_path}"
        )

    else:

        epochs_without_improvement += 1

        print(
            f"\nNo Dice improvement for "
            f"{epochs_without_improvement} epoch(s)."
        )


    # ------------------------------------
    # Current Learning Rate
    # ------------------------------------

    current_learning_rate = (
        optimizer.param_groups[0]["lr"]
    )

    print(
        f"Learning Rate: "
        f"{current_learning_rate:.6f}"
    )


    # ------------------------------------
    # Early Stopping
    # ------------------------------------

    if (
        epochs_without_improvement
        >= early_stopping_patience
    ):

        print(
            "\nEarly stopping triggered."
        )

        print(
            f"No validation Dice improvement for "
            f"{early_stopping_patience} "
            f"consecutive epochs."
        )

        break


# ========================================
# Training Complete
# ========================================

print(
    "\n========================================"
)

print(
    "ROCKSHIELD AI - Training Complete"
)

print(
    "========================================"
)

print(
    f"Best Validation Dice: "
    f"{best_validation_dice:.4f}"
)

print(
    f"Best model saved at:\n"
    f"{best_model_path}"
)