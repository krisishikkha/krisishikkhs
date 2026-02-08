const params = new URLSearchParams(window.location.search);
const pdfUrl = params.get("pdf");

if (!pdfUrl) {
  alert("PDF path not found");
}

pdfjsLib.GlobalWorkerOptions.workerSrc =
"../vendor/pdfjs/pdf.worker.min.js";

const container = document.getElementById("pdf-container");

pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {

  for (let i = 1; i <= pdf.numPages; i++) {
    pdf.getPage(i).then(page => {

      const scale = 1.25;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.display = "block";
      canvas.style.margin = "0 auto 20px";

      container.appendChild(canvas);

      page.render({
        canvasContext: ctx,
        viewport: viewport
      });
    });
  }

}).catch(err => {
  alert("PDF load error: " + err.message);
});
