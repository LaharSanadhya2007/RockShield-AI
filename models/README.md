# ROCKSHIELD AI Models

This directory stores trained computer-vision model weights used by ROCKSHIELD AI.

## Primary Computer Vision Task

Task: Rock fracture / crack semantic segmentation

Primary Dataset: GeoCrack

Framework: Ultralytics YOLO Semantic Segmentation

Initial Architecture: YOLO26n-sem

Planned trained model:

rockshield_crack_sem.pt

## Model Input

Rock-surface image

## Model Output

Pixel-level semantic mask identifying visible fracture / crack regions.

## Purpose

The model is intended to identify visible fracture traces in rock-surface images for AI-assisted geological inspection.

The segmentation output may later be used to derive image-based characteristics such as:

- detected crack area
- crack distribution
- crack extent
- connected fracture regions

These characteristics may contribute to a separate severity and estimated rockfall-risk assessment.

## Scientific Limitation

ROCKSHIELD must not infer physical crack dimensions such as width in millimetres directly from image pixels unless an appropriate scale or calibration reference is available.

The segmentation model is a decision-support component and does not independently determine geological stability or guarantee rockfall prediction.