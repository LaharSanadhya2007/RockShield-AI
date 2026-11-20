
document.addEventListener("DOMContentLoaded", function () {

    /* ========================================
       Elements
    ======================================== */

    const splashScreen = document.querySelector(".splash-screen");
    const welcomeScreen = document.querySelector(".welcome-screen");
    const dashboardScreen = document.querySelector(".dashboard-screen");
    const inspectionScreen = document.querySelector(".inspection-screen");

    const newInspectionButton =
        document.querySelector(".new-inspection-btn");

    const backDashboardButton =
        document.querySelector(".back-dashboard-btn");

    const cancelInspectionButton =
        document.querySelector(".cancel-inspection-btn");

    const closeInspectionButton =
        document.querySelector(".inspection-close-btn");

    const siteDetailsForm =
        document.querySelector("#siteDetailsForm");

    const captureScreen =
        document.querySelector(".capture-screen");

    const backSiteDetailsButton =
        document.querySelector(".back-site-details-btn");

    const captureBackButton =
        document.querySelector(".capture-back-btn");

    const captureCloseButton =
        document.querySelector(".capture-close-btn");

    const rockImageInput =
        document.querySelector("#rockImageInput");

    const uploadOption =
        document.querySelector(".upload-option");

    const imageDropzone =
        document.querySelector(".image-dropzone");

    const imagePreviewArea =
        document.querySelector(".image-preview-area");

    const rockImagePreview =
        document.querySelector("#rockImagePreview");

    const previewFileName =
        document.querySelector("#previewFileName");

    const previewFileInfo =
        document.querySelector("#previewFileInfo");

    const replaceImageButton =
        document.querySelector(".replace-image-btn");

    const removeImageButton =
        document.querySelector(".remove-image-btn");

    const continueAnalysisButton =
        document.querySelector(".continue-analysis-btn");

    let selectedRockImage = null;
    let analysisImageURL = null;
    let latestAnalysisData = null;
    let latestOverlayImage = null;

    const cameraOption =
        document.querySelector(".camera-option");

    const cameraWorkspace =
        document.querySelector(".camera-workspace");

    const cameraVideo =
        document.querySelector("#cameraVideo");

    const cameraCanvas =
        document.querySelector("#cameraCanvas");

    const capturedPhotoPreview =
        document.querySelector("#capturedPhotoPreview");

    const cameraStatus =
        document.querySelector("#cameraStatus");

    const capturePhotoButton =
        document.querySelector(".capture-photo-btn");

    const retakePhotoButton =
        document.querySelector(".retake-photo-btn");

    const usePhotoButton =
        document.querySelector(".use-photo-btn");

    const closeCameraButton =
        document.querySelector(".close-camera-btn");

    const cameraLiveActions =
        document.querySelector(".camera-live-actions");

    const cameraReviewActions =
        document.querySelector(".camera-review-actions");


    /* ========================================
       Image Quality Screen Elements
    ======================================== */

    const qualityScreen =
        document.querySelector(".quality-screen");

    const qualityOverview =
        document.querySelector(".quality-overview");

    const qualityStatus =
        document.querySelector("#qualityStatus");

    const qualityStatusMessage =
        document.querySelector("#qualityStatusMessage");

    const qualityStatusIcon =
        document.querySelector(".quality-status-icon");

    const resolutionCheck =
        document.querySelector("#resolutionCheck");

    const brightnessCheck =
        document.querySelector("#brightnessCheck");

    const sharpnessCheck =
        document.querySelector("#sharpnessCheck");

    const resolutionMetric =
        document.querySelector("#resolutionMetric");

    const brightnessMetric =
        document.querySelector("#brightnessMetric");

    const sharpnessMetric =
        document.querySelector("#sharpnessMetric");

    const resolutionDescription =
        document.querySelector("#resolutionDescription");

    const brightnessDescription =
        document.querySelector("#brightnessDescription");

    const sharpnessDescription =
        document.querySelector("#sharpnessDescription");

    const qualityAdviceText =
        document.querySelector("#qualityAdviceText");

    const backCaptureButton =
        document.querySelector(".back-capture-btn");

    const chooseAnotherImageButton =
        document.querySelector(".choose-another-image-btn");

    const startAnalysisButton =
        document.querySelector(".start-analysis-btn");

    const qualityCloseButton =
        document.querySelector(".quality-close-btn");

    let cameraStream = null;
    let capturedImageBlob = null;


    /* ========================================
       Language Selection Elements
    ======================================== */

  const languageButtons = document.querySelectorAll(
    ".welcome-language-btn, .dashboard-language-btn"
);

let currentLanguage = "en";

    /* ========================================
       AI Analysis Screen Elements
    ======================================== */

    const analysisScreen =
        document.querySelector(".analysis-screen");

    const analysisImagePreview =
        document.querySelector("#analysisImagePreview");

    const analysisCloseButton =
        document.querySelector(".analysis-close-btn");

    const analysisImageStatus =
        document.querySelector(".analysis-image-status");

    const analysisStatusTitle =
        document.querySelector("#analysisStatusTitle");

    const analysisStatusMessage =
        document.querySelector("#analysisStatusMessage");

    const analysisProgressBar =
        document.querySelector("#analysisProgressBar");

    const analysisProgressValue =
        document.querySelector("#analysisProgressValue");

    const analysisStagePreprocess =
        document.querySelector("#analysisStagePreprocess");

    const analysisStageDetection =
        document.querySelector("#analysisStageDetection");

    const analysisStageAssessment =
        document.querySelector("#analysisStageAssessment");


    /* ========================================
       AI Fracture Assessment Results
    ======================================== */

    const resultsScreen =
        document.querySelector(".results-screen");

    const fractureSeverity =
        document.querySelector("#fractureSeverity");

    const fractureCoverage =
        document.querySelector("#fractureCoverage");

    const fractureRegions =
        document.querySelector("#fractureRegions");

    const maximumProbability =
        document.querySelector("#maximumProbability");
        // Results Screen Image Elements

    const resultsOriginalImage =
    document.querySelector("#resultsOriginalImage");

    const resultsOverlayImage =
    document.querySelector("#resultsOverlayImage");

    const resultsDashboardButton =
    document.querySelector("#resultsDashboardButton");

    const resultsNewInspectionButton =
    document.querySelector("#resultsNewInspectionButton");

    const downloadReportButton =
    document.querySelector("#downloadReportButton");

    const continueButton =
        document.querySelector(".continue-btn");


    /* ========================================
       Splash → Welcome
    ======================================== */

    setTimeout(function () {

        splashScreen.classList.add("splash-exit");

        setTimeout(function () {

            splashScreen.style.display = "none";

            welcomeScreen.classList.add("welcome-visible");

        }, 500);

    }, 2600);


   
/* ========================================
   Language Selection + Translations
======================================== */

const translations = {
    en: {
        help: "Help",
        newInspection: "New Inspection",
        language: "Language",
        english: "English",
        hindi: "Hindi",
        welcome: "Welcome to ROCKSHIELD AI",
        continue: "Continue",
        siteDetails: "Site Details",
        inspectionName: "Inspection Name",
        siteLocation: "Site Location",
        inspectorName: "Inspector Name",
        captureImage: "Capture Rock Image",
        uploadImage: "Upload Image",
        camera: "Use Camera",
        qualityCheck: "Image Quality Check",
        startAnalysis: "Start AI Analysis",
        analysis: "AI Crack Analysis",
        results: "Inspection Results",
        downloadReport: "Download PDF Report",
        dashboard: "Dashboard"
    },

    hi: {
        help: "सहायता",
        newInspection: "नया निरीक्षण",
        language: "भाषा",
        english: "अंग्रेज़ी",
        hindi: "हिन्दी",
        welcome: "ROCKSHIELD AI में आपका स्वागत है",
        continue: "आगे बढ़ें",
        siteDetails: "स्थल का विवरण",
        inspectionName: "निरीक्षण का नाम",
        siteLocation: "स्थल का स्थान",
        inspectorName: "निरीक्षक का नाम",
        captureImage: "चट्टान की तस्वीर लें",
        uploadImage: "तस्वीर अपलोड करें",
        camera: "कैमरे का उपयोग करें",
        qualityCheck: "तस्वीर की गुणवत्ता जाँच",
        startAnalysis: "AI विश्लेषण शुरू करें",
        analysis: "AI दरार विश्लेषण",
        results: "निरीक्षण के परिणाम",
        downloadReport: "PDF रिपोर्ट डाउनलोड करें",
        dashboard: "डैशबोर्ड"
    }
};

function applyTranslations() {

    const selectedTranslations =
        translations[currentLanguage];

    document.querySelectorAll("[data-i18n]").forEach(function (element) {

        const key = element.getAttribute("data-i18n");

        if (selectedTranslations[key]) {
            element.textContent = selectedTranslations[key];
        }

    });

    document.documentElement.lang = currentLanguage;

}

languageButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentLanguage =
            button.getAttribute("data-language") || "en";

        languageButtons.forEach(function (btn) {
            btn.classList.toggle(
                "selected",
                btn.getAttribute("data-language") === currentLanguage
            );

            btn.classList.toggle(
                "active",
                btn.getAttribute("data-language") === currentLanguage
            );
        });

        console.log("Selected language:", currentLanguage);
        applyTranslations();

    });

});
applyTranslations();

    /* ========================================
       Continue → Dashboard
    ======================================== */

    continueButton.addEventListener("click", function () {

        const selectedLanguage = document.querySelector(
            ".welcome-language-btn.selected"
        );

        let language = "en";

        if (selectedLanguage) {
            language =
                selectedLanguage.getAttribute("data-language");
        }

        console.log("Selected language:", language);

        welcomeScreen.classList.remove("welcome-visible");
        welcomeScreen.style.display = "none";

        dashboardScreen.classList.add("dashboard-visible");

    });


    /* ========================================
       Dashboard → New Inspection
    ======================================== */

    newInspectionButton.addEventListener("click", function () {

        dashboardScreen.classList.remove("dashboard-visible");
        dashboardScreen.style.display = "none";

        inspectionScreen.classList.add("inspection-visible");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* ========================================
       Return to Dashboard
    ======================================== */

    function returnToDashboard() {

        inspectionScreen.classList.remove("inspection-visible");
        inspectionScreen.style.display = "none";

        dashboardScreen.style.display = "";
        dashboardScreen.classList.add("dashboard-visible");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    backDashboardButton.addEventListener(
        "click",
        returnToDashboard
    );

    cancelInspectionButton.addEventListener(
        "click",
        returnToDashboard
    );

    closeInspectionButton.addEventListener(
        "click",
        returnToDashboard
    );
/* ========================================
   Results Screen Navigation
======================================== */

// Results → Dashboard
resultsDashboardButton.addEventListener("click", function () {

    returnToDashboard();

});

// Results → New Inspection
// Results → New Inspection
resultsNewInspectionButton.addEventListener("click", function () {

    // Hide Results Screen
    resultsScreen.classList.remove("results-visible");
    resultsScreen.style.display = "none";

    // Hide Dashboard
    dashboardScreen.classList.remove("dashboard-visible");
    dashboardScreen.style.display = "none";

    // Show Inspection Screen
    inspectionScreen.style.display = "";
    inspectionScreen.classList.add("inspection-visible");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
/* ========================================
   Download PDF Inspection Report
======================================== */

downloadReportButton.addEventListener("click", async function () {

    // Check whether analysis is available
    if (!latestAnalysisData || !selectedRockImage) {

        alert("Please complete AI analysis before downloading the report.");

        return;
    }

    const originalButtonText = downloadReportButton.textContent;

    downloadReportButton.disabled = true;
    downloadReportButton.textContent = "Generating PDF...";

    const formData = new FormData();

    formData.append("original_image", selectedRockImage);

    formData.append(
        "analysis",
        JSON.stringify(latestAnalysisData)
    );

    formData.append(
        "overlay_image",
        latestOverlayImage || ""
    );

    // Collect inspection details
    const siteDetails = {
        site_name: document.querySelector("#inspectionName")?.value || "",
        location: document.querySelector("#siteLocation")?.value || "",
        inspector: document.querySelector("#inspectorName")?.value || ""
    };

    formData.append(
        "site_details",
        JSON.stringify(siteDetails)
    );

    try {

        const response = await fetch("/generate-report", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {

            let errorMessage = "PDF generation failed.";

            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (error) {
                console.error("Could not read server error:", error);
            }

            throw new Error(errorMessage);
        }

        const pdfBlob = await response.blob();

        const downloadURL = URL.createObjectURL(pdfBlob);

        const downloadLink = document.createElement("a");

        downloadLink.href = downloadURL;

        downloadLink.download = "ROCKSHIELD_Inspection_Report.pdf";

        document.body.appendChild(downloadLink);

        downloadLink.click();

        downloadLink.remove();

        URL.revokeObjectURL(downloadURL);

        console.log("ROCKSHIELD PDF report downloaded successfully.");

    }

    catch (error) {

        console.error("PDF download error:", error);

        alert(error.message || "Could not download the inspection report.");

    }

    finally {

        downloadReportButton.disabled = false;

        downloadReportButton.textContent = originalButtonText;

    }

});

    /* ========================================
       Site Details → Image Capture
    ======================================== */

    siteDetailsForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!siteDetailsForm.checkValidity()) {
            siteDetailsForm.reportValidity();
            return;
        }

        inspectionScreen.classList.remove("inspection-visible");
        inspectionScreen.style.display = "none";

        captureScreen.classList.add("capture-visible");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* ========================================
       Image Capture → Site Details
    ======================================== */

    function returnToSiteDetails() {

        stopCamera();

        captureScreen.classList.remove("capture-visible");
        captureScreen.style.display = "none";

        inspectionScreen.style.display = "";
        inspectionScreen.classList.add("inspection-visible");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    backSiteDetailsButton.addEventListener(
        "click",
        returnToSiteDetails
    );

    captureBackButton.addEventListener(
        "click",
        returnToSiteDetails
    );


    /* ========================================
       Close Image Capture → Dashboard
    ======================================== */

    captureCloseButton.addEventListener("click", function () {

        stopCamera();

        captureScreen.classList.remove("capture-visible");
        captureScreen.style.display = "none";

        dashboardScreen.style.display = "";
        dashboardScreen.classList.add("dashboard-visible");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* ========================================
       Rock Image Upload
    ======================================== */

    const allowedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    const maximumImageSize = 10 * 1024 * 1024;


    function openImagePicker() {
        rockImageInput.click();
    }


    uploadOption.addEventListener(
        "click",
        openImagePicker
    );

    replaceImageButton.addEventListener(
        "click",
        openImagePicker
    );


    /* ========================================
       File Input
    ======================================== */

    rockImageInput.addEventListener("change", function () {

        const file = rockImageInput.files[0];

        if (!file) {
            return;
        }

        processRockImage(file);

    });


    /* ========================================
       Validate + Process Image
    ======================================== */

    function processRockImage(file) {

        if (!allowedImageTypes.includes(file.type)) {

            alert(
                "Unsupported image format. Please select a JPG, JPEG, PNG or WEBP image."
            );

            rockImageInput.value = "";
            return;
        }

        if (file.size > maximumImageSize) {

            alert(
                "Image is too large. Please select an image smaller than 10 MB."
            );

            rockImageInput.value = "";
            return;
        }

        selectedRockImage = file;

        const imageURL = URL.createObjectURL(file);

        rockImagePreview.src = imageURL;

        previewFileName.textContent = file.name;

        previewFileInfo.textContent =
            formatFileSize(file.size) +
            " · Ready for quality check";

        imageDropzone.style.display = "none";

        imagePreviewArea.classList.add("preview-visible");

        continueAnalysisButton.disabled = false;

    }


    /* ========================================
       File Size Formatter
    ======================================== */

    function formatFileSize(bytes) {

        if (bytes < 1024) {
            return bytes + " B";
        }

        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + " KB";
        }

        return (bytes / (1024 * 1024)).toFixed(1) + " MB";

    }


    /* ========================================
       Remove Selected Image
    ======================================== */

    removeImageButton.addEventListener("click", function () {

        selectedRockImage = null;

        rockImageInput.value = "";
        rockImagePreview.src = "";

        previewFileName.textContent = "";
        previewFileInfo.textContent = "";

        imagePreviewArea.classList.remove("preview-visible");

        imageDropzone.style.display = "";

        continueAnalysisButton.disabled = true;

    });


    /* ========================================
       Drag & Drop
    ======================================== */

    imageDropzone.addEventListener("dragover", function (event) {

        event.preventDefault();

        imageDropzone.classList.add("drag-active");

    });


    imageDropzone.addEventListener("dragleave", function () {

        imageDropzone.classList.remove("drag-active");

    });


    imageDropzone.addEventListener("drop", function (event) {

        event.preventDefault();

        imageDropzone.classList.remove("drag-active");

        const file = event.dataTransfer.files[0];

        if (!file) {
            return;
        }

        processRockImage(file);

    });


    imageDropzone.addEventListener(
        "click",
        openImagePicker
    );


    /* ========================================
       Start Camera
    ======================================== */

    cameraOption.addEventListener(
        "click",
        async function () {

            try {

                cameraStatus.classList.remove("camera-error");

                cameraStatus.textContent =
                    "Requesting camera access...";

                cameraStream =
                    await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: {
                                ideal: "environment"
                            }
                        },
                        audio: false
                    });

                cameraVideo.srcObject = cameraStream;

                cameraWorkspace.classList.add("camera-visible");

                imageDropzone.style.display = "none";

                imagePreviewArea.classList.remove("preview-visible");

                cameraVideo.style.display = "block";
                capturedPhotoPreview.style.display = "none";

                cameraLiveActions.style.display = "flex";
                cameraReviewActions.style.display = "none";

                cameraStatus.textContent =
                    "Position the rock surface clearly inside the frame.";

            }

            catch (error) {

                console.error(
                    "Camera access error:",
                    error
                );

                cameraWorkspace.classList.add("camera-visible");

                cameraStatus.classList.add("camera-error");

                cameraStatus.textContent =
                    "Camera access could not be started. Check browser camera permission or upload an image instead.";

            }

        }
    );


    /* ========================================
       Capture Camera Frame
    ======================================== */

    capturePhotoButton.addEventListener("click", function () {

        if (!cameraStream) {
            return;
        }

        const width = cameraVideo.videoWidth;
        const height = cameraVideo.videoHeight;

        if (!width || !height) {

            cameraStatus.textContent =
                "Camera is still loading. Please try again.";

            return;
        }

        cameraCanvas.width = width;
        cameraCanvas.height = height;

        const context = cameraCanvas.getContext("2d");

        context.drawImage(
            cameraVideo,
            0,
            0,
            width,
            height
        );

        cameraCanvas.toBlob(
            function (blob) {

                if (!blob) {
                    return;
                }

                capturedImageBlob = blob;

                const capturedURL =
                    URL.createObjectURL(blob);

                capturedPhotoPreview.src = capturedURL;

                cameraVideo.style.display = "none";
                capturedPhotoPreview.style.display = "block";

                cameraLiveActions.style.display = "none";
                cameraReviewActions.style.display = "flex";

                cameraStatus.textContent =
                    "Review the captured image before using it.";

            },
            "image/jpeg",
            0.92
        );

    });


    /* ========================================
       Retake Photo
    ======================================== */

    retakePhotoButton.addEventListener("click", function () {

        capturedImageBlob = null;

        capturedPhotoPreview.src = "";
        capturedPhotoPreview.style.display = "none";

        cameraVideo.style.display = "block";

        cameraReviewActions.style.display = "none";
        cameraLiveActions.style.display = "flex";

        cameraStatus.textContent =
            "Position the rock surface clearly inside the frame.";

    });


    /* ========================================
       Use Captured Photo
    ======================================== */

    usePhotoButton.addEventListener("click", function () {

        if (!capturedImageBlob) {
            return;
        }

        const capturedFile = new File(
            [capturedImageBlob],
            "rockshield-camera-capture.jpg",
            {
                type: "image/jpeg"
            }
        );

        processRockImage(capturedFile);

        stopCamera();

        cameraWorkspace.classList.remove("camera-visible");

    });


    /* ========================================
       Stop Camera
    ======================================== */

    function stopCamera() {

        if (cameraStream) {

            cameraStream
                .getTracks()
                .forEach(function (track) {
                    track.stop();
                });

            cameraStream = null;

        }

        cameraVideo.srcObject = null;
        capturedImageBlob = null;

    }


    /* ========================================
       Close Camera
    ======================================== */

    closeCameraButton.addEventListener("click", function () {

        stopCamera();

        cameraWorkspace.classList.remove("camera-visible");

        if (!selectedRockImage) {
            imageDropzone.style.display = "";
        }

    });


    /* ========================================
       Continue to Analysis
       Send Image for Quality Check
    ======================================== */

    continueAnalysisButton.addEventListener(
        "click",
        async function () {

            if (!selectedRockImage) {

                alert(
                    "Please capture or upload an image before continuing."
                );

                return;
            }

            continueAnalysisButton.disabled = true;

            const originalButtonContent =
                continueAnalysisButton.innerHTML;

            continueAnalysisButton.textContent =
                "Checking Image...";

            const formData = new FormData();

            formData.append(
                "image",
                selectedRockImage
            );

            try {

                const response = await fetch(
                    "/check-image-quality",
                    {
                        method: "POST",
                        body: formData
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {

                    throw new Error(
                        result.message ||
                        "Image quality check failed."
                    );

                }

                console.log(
                    "ROCKSHIELD Image Quality Result:",
                    result
                );

                console.log(
                    "Overall Quality:",
                    result.quality
                );

                console.log(
                    "Quality Checks:",
                    result.checks
                );

                console.log(
                    "Image Metrics:",
                    result.metrics
                );

                displayQualityResult(result);

            }

            catch (error) {

                console.error(
                    "Quality check error:",
                    error
                );

                alert(
                    "ROCKSHIELD could not check the image quality. Please try again."
                );

            }

            finally {

                continueAnalysisButton.innerHTML =
                    originalButtonContent;

                continueAnalysisButton.disabled = false;

            }

        }
    );


    /* ========================================
       Display Image Quality Result
    ======================================== */

    function displayQualityResult(result) {

        const quality = result.quality;
        const metrics = result.metrics;
        const checks = result.checks;

        // Real OpenCV Metrics

        resolutionMetric.textContent =
            metrics.width + " × " + metrics.height;

        brightnessMetric.textContent =
            "Brightness: " + Number(metrics.brightness).toFixed(2);

        sharpnessMetric.textContent =
            "Sharpness score: " + Number(metrics.sharpness).toFixed(2);


        // Reset Previous States

        qualityOverview.classList.remove(
            "quality-acceptable",
            "quality-poor"
        );

        resetQualityCheck(resolutionCheck);
        resetQualityCheck(brightnessCheck);
        resetQualityCheck(sharpnessCheck);


        // Resolution

        updateQualityCheck(
            resolutionCheck,
            checks.resolution,
            resolutionDescription,
            "Image resolution is sufficient for analysis.",
            "Image resolution is below the recommended minimum."
        );


        // Brightness

        updateQualityCheck(
            brightnessCheck,
            checks.brightness,
            brightnessDescription,
            "Lighting level is suitable for surface inspection.",
            getBrightnessWarning(metrics.brightness)
        );


        // Sharpness

        updateQualityCheck(
            sharpnessCheck,
            checks.sharpness,
            sharpnessDescription,
            "Surface details are sufficiently clear for analysis.",
            "The image may be excessively blurred or lack clear surface detail."
        );


        // Overall Quality

        if (quality === "GOOD") {

            qualityStatus.textContent = "GOOD";

            qualityStatusMessage.textContent =
                "This image is suitable for further analysis.";

            qualityStatusIcon.textContent = "✓";

            qualityAdviceText.textContent =
                "All preliminary image-quality checks passed. You can continue to crack analysis.";

            startAnalysisButton.disabled = false;

        }

        else if (quality === "ACCEPTABLE") {

            qualityOverview.classList.add("quality-acceptable");

            qualityStatus.textContent = "ACCEPTABLE";

            qualityStatusMessage.textContent =
                "The image can be analyzed, but one quality check needs attention.";

            qualityStatusIcon.textContent = "!";

            qualityAdviceText.textContent =
                "For more reliable crack analysis, consider replacing or recapturing the image. You may still continue.";

            startAnalysisButton.disabled = false;

        }

        else {

            qualityOverview.classList.add("quality-poor");

            qualityStatus.textContent = "POOR";

            qualityStatusMessage.textContent =
                "The image does not meet enough recommended quality checks.";

            qualityStatusIcon.textContent = "!";

            qualityAdviceText.textContent =
                "Replace or recapture the image before AI analysis. Poor image quality may produce unreliable crack-detection results.";

            startAnalysisButton.disabled = true;

        }


        // Open Quality Screen

        captureScreen.classList.remove("capture-visible");
        captureScreen.style.display = "none";

        qualityScreen.style.display = "";

        qualityScreen.classList.add("quality-visible");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* ========================================
       Individual Quality Check
    ======================================== */

    function updateQualityCheck(
        element,
        passed,
        descriptionElement,
        passedMessage,
        failedMessage
    ) {

        const icon =
            element.querySelector(".quality-check-icon");

        const state =
            element.querySelector(".quality-check-state");

        if (passed) {

            icon.textContent = "✓";
            state.textContent = "Passed";

            descriptionElement.textContent =
                passedMessage;

        }

        else {

            element.classList.add("check-failed");

            icon.textContent = "!";
            state.textContent = "Needs Attention";

            descriptionElement.textContent =
                failedMessage;

        }

    }


    /* ========================================
       Reset Quality Check
    ======================================== */

    function resetQualityCheck(element) {

        element.classList.remove(
            "check-warning",
            "check-failed"
        );

    }


    /* ========================================
       Brightness Message
    ======================================== */

    function getBrightnessWarning(brightness) {

        if (brightness < 45) {

            return "The image appears too dark. Improve lighting or recapture the rock surface.";

        }

        if (brightness > 210) {

            return "The image appears too bright or overexposed. Reduce glare or recapture the image.";

        }

        return "Lighting needs attention.";

    }


    /* ========================================
       Quality Screen → Image Capture
    ======================================== */

    function returnToImageCapture() {

        qualityScreen.classList.remove("quality-visible");
        qualityScreen.style.display = "none";

        captureScreen.style.display = "";
        captureScreen.classList.add("capture-visible");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    backCaptureButton.addEventListener(
        "click",
        returnToImageCapture
    );

    chooseAnotherImageButton.addEventListener(
        "click",
        returnToImageCapture
    );


    /* ========================================
       Close Quality Screen → Dashboard
    ======================================== */

    qualityCloseButton.addEventListener("click", function () {

        qualityScreen.classList.remove("quality-visible");
        qualityScreen.style.display = "none";

        dashboardScreen.style.display = "";
        dashboardScreen.classList.add("dashboard-visible");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* ========================================
       Quality Check → AI Analysis
    ======================================== */

    startAnalysisButton.addEventListener(
        "click",
        async function () {

            if (!selectedRockImage) {

                alert(
                    "No rock-surface image is available for analysis."
                );

                return;
            }

            // Remove previous temporary URL

            if (analysisImageURL) {

                URL.revokeObjectURL(analysisImageURL);

            }

            // Create preview from selected image

            analysisImageURL =
                URL.createObjectURL(selectedRockImage);

            analysisImagePreview.src = analysisImageURL;


            // Reset Results Screen

            resultsScreen.style.display = "none";


            // Reset Analysis UI

            analysisScreen.classList.remove("analysis-complete");

            analysisImageStatus.classList.remove("analysis-complete");

            analysisImageStatus.textContent = "Ready";

            analysisStatusTitle.textContent =
                "Ready for Crack Analysis";

            analysisStatusMessage.textContent =
                "The image has passed preliminary quality checks and is ready for the crack-detection model.";

            analysisProgressBar.style.width = "0%";
            analysisProgressValue.textContent = "0%";


            // Reset stages

            analysisStagePreprocess.classList.remove("completed");

            analysisStageDetection.classList.remove(
                "active",
                "completed"
            );

            analysisStageAssessment.classList.remove(
                "active",
                "completed"
            );

            analysisStagePreprocess.classList.add("active");


            // Hide Quality Screen

            qualityScreen.classList.remove("quality-visible");
            qualityScreen.style.display = "none";


            // Show Analysis Screen

            analysisScreen.style.display = "";
            analysisScreen.classList.add("analysis-visible");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            // Prepare image for AI model

            const formData = new FormData();

            formData.append(
                "image",
                selectedRockImage
            );


            try {

                analysisImageStatus.textContent = "Analyzing";

                analysisStatusTitle.textContent =
                    "Detecting Rock Fractures";

                analysisStatusMessage.textContent =
                    "ROCKSHIELD AI is analyzing the rock surface for visible fracture patterns.";

                analysisProgressBar.style.width = "45%";
                analysisProgressValue.textContent = "45%";


                // Send image to Flask backend

                const response = await fetch(
                    "/analyze-image",
                    {
                        method: "POST",
                        body: formData
                    }
                );

                const result = await response.json();


                if (!response.ok || !result.success || !result.analysis) {

                    throw new Error(
                        result.message ||
                        "AI crack analysis failed."
                    );

                }


                console.log(
                    "ROCKSHIELD AI Analysis Result:",
                    result
                );


                // Update preprocessing stage

                analysisStagePreprocess.classList.remove("active");

                analysisStagePreprocess.classList.add("completed");

                analysisStageDetection.classList.add("active");

                analysisProgressBar.style.width = "75%";
                analysisProgressValue.textContent = "75%";


                // Get actual AI analysis data

                const analysisData = result.analysis;
                latestAnalysisData = analysisData;
                latestOverlayImage = analysisData.overlay_image;
                // Display Original Rock Image

resultsOriginalImage.src = analysisImageURL;

resultsOriginalImage.alt =
    "Original rock surface uploaded for AI analysis";


                console.log(
                    "Fracture Pixels:",
                    analysisData.fracture_pixels
                );

                console.log(
                    "Fracture Percentage:",
                    analysisData.fracture_percentage
                );

                console.log(
                    "Fracture Severity:",
                    analysisData.severity
                );

                console.log(
                    "Fracture Coverage:",
                    analysisData.fracture_coverage_percentage
                );

                console.log(
                    "Fracture Regions:",
                    analysisData.fracture_region_count
                );

                console.log(
                    "Maximum Pixel Probability:",
                    analysisData.maximum_probability
                );


             // Display AI Fracture Overlay

if (analysisData.overlay_image) {

    // Analysis Screen
    analysisImagePreview.src =
        analysisData.overlay_image;

    analysisImagePreview.alt =
        "Rock surface with AI-detected fracture overlay";

    // Results Screen
    resultsOverlayImage.src =
        analysisData.overlay_image;

    resultsOverlayImage.alt =
        "AI-detected fracture regions on rock surface";

} else {

    resultsOverlayImage.removeAttribute("src");

}


                // Complete detection stage

                analysisStageDetection.classList.remove("active");

                analysisStageDetection.classList.add("completed");

                analysisStageAssessment.classList.add("active");


                // Complete assessment stage

                analysisProgressBar.style.width = "100%";

                analysisProgressValue.textContent = "100%";

                analysisStageAssessment.classList.remove("active");

                analysisStageAssessment.classList.add("completed");


                // Update analysis status

                analysisImageStatus.textContent = "Complete";

                analysisStatusTitle.textContent =
                    "Crack Analysis Complete";

                analysisStatusMessage.textContent =
                    "ROCKSHIELD AI successfully analyzed the rock surface using the trained fracture-segmentation model.";


                /* ========================================
                   Display AI Fracture Assessment Results
                ======================================== */

                // Severity

                fractureSeverity.textContent =
                    analysisData.severity ?? "Unavailable";


                // Fracture Coverage

                const coverageValue =
                    analysisData.fracture_coverage_percentage;

                const coverage = Number(coverageValue);

                fractureCoverage.textContent =
                    coverageValue !== null &&
                    coverageValue !== undefined &&
                    Number.isFinite(coverage)
                        ? `${coverage.toFixed(2)}%`
                        : "--";


                // Fracture Regions

                fractureRegions.textContent =
                    analysisData.fracture_region_count ?? "--";


                // Maximum Probability

                const probabilityValue =
                    analysisData.maximum_probability;

                const probability = Number(probabilityValue);

                maximumProbability.textContent =
                    probabilityValue !== null &&
                    probabilityValue !== undefined &&
                    Number.isFinite(probability)
                        ? `${(probability <= 1 ? probability * 100 : probability).toFixed(2)}%`
                        : "--";


                console.log(
                    "Final Fracture Assessment:",
                    {
                        severity: analysisData.severity,
                        coverage: analysisData.fracture_coverage_percentage,
                        regions: analysisData.fracture_region_count,
                        maximumProbability: analysisData.maximum_probability
                    }
                );


                /* ========================================
                   Switch to Results Screen
                ======================================== */

                analysisScreen.classList.remove("analysis-visible");

                analysisScreen.style.display = "none";

                resultsScreen.style.display = "block";

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

            catch (error) {

                console.error(
                    "ROCKSHIELD AI analysis error:",
                    error
                );

                analysisImageStatus.textContent = "Failed";

                analysisStatusTitle.textContent =
                    "Analysis Could Not Be Completed";

                analysisStatusMessage.textContent =
                    "ROCKSHIELD AI could not analyze this image. Please try again.";

            }

        }
    );


    /* ========================================
       Close Analysis → Dashboard
    ======================================== */

    analysisCloseButton.addEventListener("click", function () {

        analysisScreen.classList.remove("analysis-visible");

        analysisScreen.style.display = "none";


        if (analysisImageURL) {

            URL.revokeObjectURL(analysisImageURL);

            analysisImageURL = null;

        }

        analysisImagePreview.src = "";

        dashboardScreen.style.display = "";

        dashboardScreen.classList.add("dashboard-visible");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});
