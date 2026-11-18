
import base64
from io import BytesIO
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
)


def decode_image(image_data):
    """Decode a Base64 image data URL into a file-like object."""

    if not image_data:
        return None

    if "," in image_data:
        image_data = image_data.split(",", 1)[1]

    image_bytes = base64.b64decode(image_data)

    return BytesIO(image_bytes)


def generate_inspection_report(
    analysis,
    original_image,
    overlay_image,
    site_details=None
):
    """Generate a ROCKSHIELD AI inspection report in PDF format."""

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontSize=22,
        textColor=colors.HexColor("#174B3A"),
        alignment=TA_CENTER,
        spaceAfter=8,
    )

    heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontSize=13,
        textColor=colors.HexColor("#174B3A"),
        spaceBefore=12,
        spaceAfter=8,
    )

    normal_style = styles["BodyText"]

    story = []

    # Report title
    story.append(
        Paragraph("ROCKSHIELD AI", title_style)
    )

    story.append(
        Paragraph(
            "AI-Based Rockfall Prediction and Crack Detection System",
            ParagraphStyle(
                "Subtitle",
                parent=normal_style,
                alignment=TA_CENTER,
                fontSize=10,
            )
        )
    )

    story.append(Spacer(1, 8 * mm))

    # Report information
    story.append(
        Paragraph("Inspection Information", heading_style)
    )

    site_details = site_details or {}

    info_data = [
        ["Report Date", datetime.now().strftime("%d-%m-%Y %H:%M")],
        ["Site Name", str(site_details.get("site_name", "Not provided"))],
        ["Location", str(site_details.get("location", "Not provided"))],
        ["Inspector", str(site_details.get("inspector", "Not provided"))],
    ]

    info_table = Table(info_data, colWidths=[45 * mm, 115 * mm])

    info_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#EAF2ED")),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#24352D")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D5DED8")),
        ("PADDING", (0, 0), (-1, -1), 8),
    ]))

    story.append(info_table)

    # AI results
    story.append(
        Paragraph("AI Fracture Assessment", heading_style)
    )

    metrics = [
        ["Parameter", "AI Assessment"],
        ["Fracture Severity", str(analysis.get("severity", "N/A"))],
        ["Fracture Coverage", f'{analysis.get("fracture_coverage_percentage", "N/A")}%'],
        ["Fracture Regions", str(analysis.get("fracture_region_count", "N/A"))],
        [
    "Maximum Probability",
    f'{float(analysis["maximum_probability"]) * 100:.2f}%'
    if analysis.get("maximum_probability") is not None
    else "N/A"
],
        ["Fracture Pixels", str(analysis.get("fracture_pixels", "N/A"))],
        ["Fracture Percentage", f'{analysis.get("fracture_percentage", "N/A")}%'],
    ]

    metrics_table = Table(
        metrics,
        colWidths=[75 * mm, 85 * mm]
    )

    metrics_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#174B3A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#F5F8F6")),
        ("TEXTCOLOR", (0, 1), (-1, -1), colors.HexColor("#24352D")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D5DED8")),
        ("PADDING", (0, 0), (-1, -1), 8),
    ]))

    story.append(metrics_table)

    # Images
    story.append(
        Paragraph("Visual Inspection", heading_style)
    )

    image_cells = []

    for image_data in (original_image, overlay_image):
        image_buffer = decode_image(image_data)

        if image_buffer:
            image = Image(
                image_buffer,
                width=75 * mm,
                height=55 * mm,
                kind="proportional",
            )
            image.hAlign = "CENTER"
            image_cells.append(image)
        else:
            image_cells.append(
                Paragraph("Image not available", normal_style)
            )

    image_table = Table(
        [[
            Paragraph("<b>Original Image</b>", normal_style),
            Paragraph("<b>AI Fracture Overlay</b>", normal_style),
        ], image_cells],
        colWidths=[80 * mm, 80 * mm],
    )

    image_table.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))

    story.append(image_table)

    # Disclaimer
    story.append(Spacer(1, 10 * mm))

    story.append(
        Paragraph("Important Disclaimer", heading_style)
    )

    story.append(
        Paragraph(
            "This report contains image-based AI fracture segmentation "
            "and assessment results. It is intended to support preliminary "
            "inspection and does not constitute a certified geotechnical "
            "assessment or guarantee of rockfall prediction. "
            "Professional site inspection is recommended.",
            normal_style,
        )
    )

    document.build(story)

    buffer.seek(0)

    return buffer
