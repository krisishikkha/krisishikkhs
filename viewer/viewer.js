const urlParams = new URLSearchParams(window.location.search);
let pdfPath = urlParams.get("pdf");

if (!pdfPath) {
  alert("PDF not specified");
  throw new Error("PDF missing");
}

/* 🔥 ABSOLUTE PATH FIX */
pdfPath = "/krisishikkha/" + pdfPath.replace(/^(\.\.\/)+/, "");

pdfjsLib.GlobalWorkerOptions.workerSrc =
"/krisishikkha/vendor/pdfjs/pdf.worker.min.js";

const canvas = document.getElementById("pdf-canvas");
const ctx = canvas.getContext("2d");

pdfjsLib.getDocument(pdfPath).promise.then(pdf => {
  return pdf.getPage(1);
}).then(page => {
  const viewport = page.getViewport({ scale: 1.4 });
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  page.render({
    canvasContext: ctx,
    viewport: viewport
  });
}).catch(err => {
  alert("PDF load error: " + err.message);
});
