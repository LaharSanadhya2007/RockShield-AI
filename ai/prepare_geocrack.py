from pathlib import Path
import csv
import shutil


# ========================================
# Project Paths
# ========================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

GEOCRACK_DIR = PROJECT_ROOT / "datasets" / "geocrack"

SOURCE_IMAGES_DIR = GEOCRACK_DIR / "patched_images"

OUTPUT_DIR = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "geocrack"
)


# ========================================
# Official GeoCrack Splits
# ========================================

SPLITS = {
    "train": GEOCRACK_DIR / "train.tab",
    "val": GEOCRACK_DIR / "validation.tab",
    "test": GEOCRACK_DIR / "test.tab",
}


def extract_filename(path_text):
    """
    Extract only the filename from the paths stored
    inside the original GeoCrack .tab files.
    """

    cleaned_path = (
        path_text
        .strip()
        .strip('"')
        .replace("\\", "/")
    )

    return cleaned_path.split("/")[-1]


def prepare_split(split_name, tab_file):
    """
    Read one official GeoCrack split and copy its
    image/mask pairs into ROCKSHIELD's processed
    dataset structure.
    """

    images_output = (
        OUTPUT_DIR
        / split_name
        / "images"
    )

    masks_output = (
        OUTPUT_DIR
        / split_name
        / "masks"
    )

    images_output.mkdir(
        parents=True,
        exist_ok=True
    )

    masks_output.mkdir(
        parents=True,
        exist_ok=True
    )

    copied_pairs = 0
    missing_pairs = 0


    with open(
        tab_file,
        "r",
        encoding="utf-8-sig",
        newline=""
    ) as file:

        reader = csv.DictReader(
            file,
            delimiter="\t"
        )

        for row in reader:

            original_name = extract_filename(
                row["Original Image Patch"]
            )

            mask_name = extract_filename(
                row["Binary Mask Image Patch"]
            )


            original_source = (
                SOURCE_IMAGES_DIR
                / original_name
            )

            mask_source = (
                SOURCE_IMAGES_DIR
                / mask_name
            )


            if (
                not original_source.exists()
                or not mask_source.exists()
            ):

                missing_pairs += 1

                print(
                    "Missing pair:",
                    original_name,
                    mask_name
                )

                continue


            shutil.copy2(
                original_source,
                images_output / original_name
            )

            shutil.copy2(
                mask_source,
                masks_output / mask_name
            )

            copied_pairs += 1


    print(
        f"{split_name}: "
        f"{copied_pairs} pairs copied, "
        f"{missing_pairs} missing."
    )

    return copied_pairs, missing_pairs

def validate_source_dataset():
    """
    Validate the extracted GeoCrack source dataset
    before creating processed training folders.
    """

    print("Validating GeoCrack source dataset...")

    png_files = list(
        SOURCE_IMAGES_DIR.glob("*.png")
    )

    original_files = [
        file
        for file in png_files
        if "_original_patch" in file.name
    ]

    mask_files = [
        file
        for file in png_files
        if "_binarymask_patch" in file.name
    ]

    print(
        f"Original image patches found: "
        f"{len(original_files)}"
    )

    print(
        f"Binary mask patches found: "
        f"{len(mask_files)}"
    )


    if len(original_files) == 0:
        raise RuntimeError(
            "No original GeoCrack image patches were found."
        )

    if len(mask_files) == 0:
        raise RuntimeError(
            "No GeoCrack binary masks were found."
        )

    if len(original_files) != len(mask_files):
        raise RuntimeError(
            "The number of original images and masks "
            "does not match."
        )


    print(
        "GeoCrack source dataset validation passed.\n"
    )
def main():

    print(
        "\nPreparing GeoCrack dataset "
        "for ROCKSHIELD AI...\n"
    )


    if not SOURCE_IMAGES_DIR.exists():

        raise FileNotFoundError(
            "GeoCrack patched_images folder "
            "was not found."
        )

    validate_source_dataset()
    total_copied = 0
    total_missing = 0


    for split_name, tab_file in SPLITS.items():

        if not tab_file.exists():

            raise FileNotFoundError(
                f"Split file not found: "
                f"{tab_file}"
            )


        copied, missing = prepare_split(
            split_name,
            tab_file
        )

        total_copied += copied
        total_missing += missing


    print("\nPreparation complete.")

    print(
        f"Total pairs copied: "
        f"{total_copied}"
    )

    print(
        f"Total missing pairs: "
        f"{total_missing}"
    )

    print(
        f"\nProcessed dataset:\n"
        f"{OUTPUT_DIR}"
    )


if __name__ == "__main__":
    main()