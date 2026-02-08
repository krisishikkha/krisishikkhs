const params = new URLSearchParams(window.location.search);
const pdfUrl = params.get("pdf");

pdfjsLib.GlobalWorkerOptions.workerSrc =
"/krisishikkha/vendor/pdfjs/pdf.worker.min.js";

const container = document.getElementById("pdf-container");

pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
  for (let p = 1; p <= pdf.numPages; p++) {
    pdf.getPage(p).then(page => {
      const viewport = page.getViewport({ scale: 1.3 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.marginBottom = "20px";

      container.appendChild(canvas);
      page.render({ canvasContext: ctx, viewport });
    });
  }
});
