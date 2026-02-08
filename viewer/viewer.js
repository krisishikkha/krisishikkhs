const urlParams = new URLSearchParams(window.location.search);
const pdfUrl = urlParams.get('pdf');

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "/krisishikkha/vendor/pdfjs/pdf.worker.min.js";
// ===== PDF.js worker (ABSOLUTE PATH) =====
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "/krisishikkha/vendor/pdfjs/pdf.worker.min.js";

// ===== Get PDF file from URL =====
const params = new URLSearchParams(window.location.search);
const pdfFile = params.get("pdf");

if (!pdfFile) {
  alert("PDF file not specified!");
  throw new Error("No PDF file provided");
}

// ===== Build absolute PDF path =====
const pdfPath = "/krisishikkha/pdf/" + pdfFile;

// ===== Canvas setup =====
const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");

let pdfDoc = null;
let pageNum = 1;
let scale = 1.4;

// ===== Load PDF =====
pdfjsLib.getDocument(pdfPath).promise
  .then(pdf => {
    pdfDoc = pdf;
    renderPage(pageNum);
  })
  .catch(err => {
    alert("Failed to load PDF. Check file path.");
    console.error(err);
  });

// ===== Render page =====
function renderPage(num) {
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale: scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    page.render(renderContext);
  });
}

// ===== Disable right click =====
document.addEventListener("contextmenu", e => e.preventDefault());
