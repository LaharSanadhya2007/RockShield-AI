document.getElementById("imageInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById("previewImg");

    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});
document.getElementById("uploadForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const fileInput = document.getElementById("imageInput");
    const resultText = document.getElementById("resultText");

    if (fileInput.files.length === 0) {
        resultText.innerHTML = "⚠️ Please upload an image first";
        return;
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    resultText.innerHTML = "⏳ Processing...";

    fetch("/analyze", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        resultText.innerHTML = data.result;
    })
    .catch(error => {
        resultText.innerHTML = "❌ Error processing image";
    });
});