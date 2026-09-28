/* ==========================================================
   RockShield AI - frontend logic
   Replace the ENTIRE contents of your old script.js with this.
   ========================================================== */

// ---- 1. SETTINGS: change these to match your app.py -------------------
const CONFIG = {
API_URL: "/predict",
FIELD_NAME: "file",      // the name used in request.files["file"] in app.py
  MAX_MB: 10,
  // Opening index.html directly from disk (no Flask) runs a demo result
  DEMO_MODE: location.protocol === "file:"
};

// ---- 2. Element references --------------------------------------------
const $ = (id) => document.getElementById(id);

const fileInput  = $("fileInput");
const dropzone   = $("dropzone");
const viewport   = $("viewport");
const previewImg = $("previewImg");
const analyzeBtn = $("analyzeBtn");
const clearBtn   = $("clearBtn");
const statusPill = $("statusPill");
const resultBox  = $("result");
const resultText = $("resultText");
const confVal    = $("confVal");
const confBar    = $("confBar");
const sevVal     = $("sevVal");
const sevScale   = $("sevScale");
const adviceText = $("adviceText");
const noteText   = $("noteText");

let selectedFile = null;

// ---- 3. Status helpers -------------------------------------------------
function setStatus(text, mode) {
  statusPill.textContent = text;
  statusPill.className = "pill" + (mode ? " is-" + mode : "");
}

// ---- 4. File selection (click, drag and drop) --------------------------
fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

["dragenter", "dragover"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("is-over");
  })
);
["dragleave", "drop"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("is-over");
  })
);
dropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  if (!file.type.startsWith("image/")) {
    showError("That file is not an image", "Choose a JPG, PNG or WebP photo.");
    return;
  }
  if (file.size > CONFIG.MAX_MB * 1024 * 1024) {
    showError("That image is too large", "Choose a photo under " + CONFIG.MAX_MB + " MB.");
    return;
  }

  selectedFile = file;
  if (previewImg.src.startsWith("blob:")) URL.revokeObjectURL(previewImg.src);
  previewImg.src = URL.createObjectURL(file);

  dropzone.hidden = true;
  viewport.hidden = false;
  clearBtn.hidden = false;
  analyzeBtn.disabled = false;
  resultBox.hidden = true;
  setStatus("Photo ready");
}

clearBtn.addEventListener("click", resetAll);

function resetAll() {
  selectedFile = null;
  fileInput.value = "";
  previewImg.removeAttribute("src");
  viewport.hidden = true;
  dropzone.hidden = false;
  clearBtn.hidden = true;
  analyzeBtn.disabled = true;
  resultBox.hidden = true;
  setStatus("Ready");
}

// ---- 5. Analyze --------------------------------------------------------
analyzeBtn.addEventListener("click", analyze);

async function analyze() {
  if (!selectedFile) return;

  analyzeBtn.disabled = true;
  analyzeBtn.classList.add("is-loading");
  analyzeBtn.textContent = "Analyzing";
  viewport.classList.add("is-scanning");
  resultBox.hidden = true;
  setStatus("Analyzing", "busy");

  try {
    const data = CONFIG.DEMO_MODE ? await demoResponse() : await callServer();
    renderResult(normalize(data), CONFIG.DEMO_MODE);
    setStatus("Done");
  } catch (err) {
    console.error(err);
    showError(
      "We could not analyze this image",
      "Check that app.py is running and that " + CONFIG.API_URL +
      " accepts a POST with a '" + CONFIG.FIELD_NAME + "' file field."
    );
  } finally {
    analyzeBtn.classList.remove("is-loading");
    analyzeBtn.textContent = "Analyze image";
    analyzeBtn.disabled = false;
    viewport.classList.remove("is-scanning");
  }
}

async function callServer() {
  const body = new FormData();
  body.append(CONFIG.FIELD_NAME, selectedFile);

  const res = await fetch(CONFIG.API_URL, { method: "POST", body });
  if (!res.ok) throw new Error("Server returned " + res.status);

  const type = res.headers.get("content-type") || "";
  if (type.includes("json")) return res.json();
  return { result: await res.text() };
}

function demoResponse() {
  return new Promise((resolve) =>
    setTimeout(() => {
      const found = Math.random() > 0.35;
      resolve({
        result: found ? "Crack detected" : "No crack detected",
        confidence: 0.78 + Math.random() * 0.2
      });
    }, 1800)
  );
}

// ---- 6. Turn ANY reasonable server reply into one shape ----------------
// Works with JSON like {"result": "Crack", "confidence": 0.93}
// or {"prediction": "...", "probability": ...} or plain text.
function normalize(data) {
  if (typeof data === "string") data = { result: data };

  const raw = String(
    data.result ?? data.prediction ?? data.label ?? data.class ?? data.message ?? ""
  ).trim();

  let conf = data.confidence ?? data.probability ?? data.score ?? null;
  if (conf !== null && !isNaN(Number(conf))) {
    conf = Number(conf);
    if (conf <= 1) conf *= 100;
    conf = Math.min(100, Math.max(0, conf));
  } else {
    conf = null;
  }

  const noCrack = /(no|non|without)[\s_-]*crack|healthy|intact|negative|safe/i.test(raw);
  const crack = !noCrack && /crack|positive|damage|defect|fracture/i.test(raw);

  let level = 0; // 0 none, 1 low, 2 moderate, 3 severe
  if (crack) {
    const given = String(data.severity ?? "").toLowerCase();
    if (given.includes("sever") || given.includes("high")) level = 3;
    else if (given.includes("mod") || given.includes("med")) level = 2;
    else if (given.includes("low") || given.includes("minor")) level = 1;
    else if (conf === null) level = 2;
    else level = conf >= 90 ? 3 : conf >= 70 ? 2 : 1;
  }

  return { raw, conf, crack, noCrack, level };
}

// ---- 7. Show the result ------------------------------------------------
const SEVERITY = [
  { label: "None",     tone: "",          advice: "No cracks found in this photo. Keep up routine inspections." },
  { label: "Low",      tone: "",          advice: "A minor crack. Log it, photograph it again in a few weeks and watch for growth." },
  { label: "Moderate", tone: "is-warn",   advice: "Schedule an inspection soon. Seal or monitor the crack and check for widening." },
  { label: "Severe",   tone: "is-danger", advice: "Limit access to this area and get an engineer to inspect it as soon as possible." }
];

function renderResult({ raw, conf, crack, noCrack, level }, isDemo) {
  const info = SEVERITY[level];

  resultBox.className = "result " + info.tone;
  resultBox.hidden = false;

  // #resultText keeps the same id as your old code
  resultText.textContent = crack
    ? "Crack detected"
    : noCrack
      ? "No crack detected"
      : (raw || "Analysis complete");

  confVal.textContent = conf === null ? "n/a" : conf.toFixed(1) + "%";
  confBar.style.width = "0%";
  requestAnimationFrame(() => {
    confBar.style.width = (conf === null ? 0 : conf) + "%";
  });

  sevVal.textContent = crack || noCrack ? info.label : "n/a";
  sevScale.className = "scale lv-" + level;

  adviceText.textContent = crack || noCrack ? info.advice : "";

  noteText.hidden = !isDemo;
  noteText.textContent = isDemo
    ? "Demo result. Run the Flask app to see real predictions from your model."
    : "";

  resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showError(title, detail) {
  resultBox.className = "result is-danger";
  resultBox.hidden = false;
  resultText.textContent = title;
  confVal.textContent = "--";
  confBar.style.width = "0%";
  sevVal.textContent = "--";
  sevScale.className = "scale";
  adviceText.textContent = detail;
  noteText.hidden = true;
  setStatus("Error", "error");
}