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

let cameraStream = null;

let capturedImageBlob = null;

    const languageButtons = document.querySelectorAll(
        ".welcome-language-btn"
        
    );

    const continueButton = document.querySelector(".continue-btn");


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
       Language Selection
    ======================================== */

    languageButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            languageButtons.forEach(function (btn) {
                btn.classList.remove("selected");
            });

            button.classList.add("selected");

        });

    });


    /* ========================================
       Continue
       Dashboard will be connected next
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


    /* Hide Welcome */

    welcomeScreen.classList.remove("welcome-visible");

    welcomeScreen.style.display = "none";


    /* Show Dashboard */

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
   Site Details → Image Capture
======================================== */

siteDetailsForm.addEventListener("submit", function (event) {

    event.preventDefault();


    /* Let browser check required fields */

    if (!siteDetailsForm.checkValidity()) {

        siteDetailsForm.reportValidity();

        return;

    }


    /* Hide Site Details */

    inspectionScreen.classList.remove("inspection-visible");
    inspectionScreen.style.display = "none";


    /* Show Image Capture */

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


/* Open File Picker */

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

    /* Check file type */

    if (!allowedImageTypes.includes(file.type)) {

        alert(
            "Unsupported image format. Please select a JPG, JPEG, PNG or WEBP image."
        );

        rockImageInput.value = "";

        return;
    }


    /* Check file size */

    if (file.size > maximumImageSize) {

        alert(
            "Image is too large. Please select an image smaller than 10 MB."
        );

        rockImageInput.value = "";

        return;
    }


    selectedRockImage = file;


    /* Create preview */

    const imageURL = URL.createObjectURL(file);

    rockImagePreview.src = imageURL;


    /* File information */

    previewFileName.textContent = file.name;

    previewFileInfo.textContent =
        formatFileSize(file.size) +
        " · Ready for quality check";


    /* Switch from dropzone to preview */

    imageDropzone.style.display = "none";

    imagePreviewArea.classList.add(
        "preview-visible"
    );


    /* Enable next step */

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

        return (
            bytes / 1024
        ).toFixed(1) + " KB";

    }

    return (
        bytes / (1024 * 1024)
    ).toFixed(1) + " MB";

}


/* ========================================
   Remove Selected Image
======================================== */

removeImageButton.addEventListener(
    "click",
    function () {

        selectedRockImage = null;

        rockImageInput.value = "";

        rockImagePreview.src = "";

        previewFileName.textContent = "";

        previewFileInfo.textContent = "";

        imagePreviewArea.classList.remove(
            "preview-visible"
        );

        imageDropzone.style.display = "";

        continueAnalysisButton.disabled = true;

    }
);
/* ========================================
   Drag & Drop
======================================== */

imageDropzone.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        imageDropzone.classList.add(
            "drag-active"
        );

    }
);


imageDropzone.addEventListener(
    "dragleave",
    function () {

        imageDropzone.classList.remove(
            "drag-active"
        );

    }
);


imageDropzone.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        imageDropzone.classList.remove(
            "drag-active"
        );


        const file =
            event.dataTransfer.files[0];


        if (!file) {
            return;
        }


        processRockImage(file);

    }
);
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

        /* Ask permission only now */

        try {

            cameraStatus.classList.remove(
                "camera-error"
            );

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


            cameraWorkspace.classList.add(
                "camera-visible"
            );


            imageDropzone.style.display = "none";

            imagePreviewArea.classList.remove(
                "preview-visible"
            );


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


            cameraWorkspace.classList.add(
                "camera-visible"
            );


            cameraStatus.classList.add(
                "camera-error"
            );


            cameraStatus.textContent =
                "Camera access could not be started. Check browser camera permission or upload an image instead.";

        }

    }
);
/* ========================================
   Capture Camera Frame
======================================== */

capturePhotoButton.addEventListener(
    "click",
    function () {

        if (!cameraStream) {
            return;
        }


        const width =
            cameraVideo.videoWidth;

        const height =
            cameraVideo.videoHeight;


        if (!width || !height) {

            cameraStatus.textContent =
                "Camera is still loading. Please try again.";

            return;
        }


        cameraCanvas.width = width;
        cameraCanvas.height = height;


        const context =
            cameraCanvas.getContext("2d");


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


                capturedPhotoPreview.src =
                    capturedURL;


                cameraVideo.style.display =
                    "none";


                capturedPhotoPreview.style.display =
                    "block";


                cameraLiveActions.style.display =
                    "none";


                cameraReviewActions.style.display =
                    "flex";


                cameraStatus.textContent =
                    "Review the captured image before using it.";

            },
            "image/jpeg",
            0.92
        );

    }
);
/* ========================================
   Retake Photo
======================================== */

retakePhotoButton.addEventListener(
    "click",
    function () {

        capturedImageBlob = null;

        capturedPhotoPreview.src = "";

        capturedPhotoPreview.style.display =
            "none";

        cameraVideo.style.display =
            "block";

        cameraReviewActions.style.display =
            "none";

        cameraLiveActions.style.display =
            "flex";

        cameraStatus.textContent =
            "Position the rock surface clearly inside the frame.";

    }
);
/* ========================================
   Use Captured Photo
======================================== */

usePhotoButton.addEventListener(
    "click",
    function () {

        if (!capturedImageBlob) {
            return;
        }


        const capturedFile =
            new File(
                [capturedImageBlob],
                "rockshield-camera-capture.jpg",
                {
                    type: "image/jpeg"
                }
            );


        processRockImage(
            capturedFile
        );


        stopCamera();


        cameraWorkspace.classList.remove(
            "camera-visible"
        );

    }
);
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


/* Close Camera */

closeCameraButton.addEventListener(
    "click",
    function () {

        stopCamera();

        cameraWorkspace.classList.remove(
            "camera-visible"
        );


        if (!selectedRockImage) {

            imageDropzone.style.display = "";

        }

    }
);
/* ========================================
   Continue to Analysis
   Send Image for Quality Check
======================================== */

continueAnalysisButton.addEventListener(
    "click",
    async function () {

        /* Make sure an image exists */

        if (!selectedRockImage) {

            alert(
                "Please capture or upload an image before continuing."
            );

            return;
        }


        /* Prevent multiple clicks */

        continueAnalysisButton.disabled = true;

        const originalButtonContent =
            continueAnalysisButton.innerHTML;

        continueAnalysisButton.textContent =
            "Checking Image...";


        /* Prepare image for Flask */

        const formData =
            new FormData();

        formData.append(
            "image",
            selectedRockImage
        );


        try {

            /* Send image to backend */

            const response =
                await fetch(
                    "/check-image-quality",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const result =
                await response.json();


            /* Check backend response */

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    "Image quality check failed."
                );

            }


            /* For now, inspect result in console */

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


            alert(
                "Image quality check completed: " +
                result.quality
            );

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

            continueAnalysisButton.disabled =
                false;

        }

    }
);
});