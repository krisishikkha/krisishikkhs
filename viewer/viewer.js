const urlParams = new URLSearchParams(window.location.search);
const pdfUrl = urlParams.get('pdf');

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "/krisishikkha/vendor/pdfjs/pdf.worker.min.js";

const container = document.getElementById("pdf-container");

if (!pdfUrl) {
  container.innerHTML = "<p>PDF not found</p>";
} else {
  pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      pdf.getPage(pageNum).then(function (page) {
        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.marginBottom = "20px";

        container.appendChild(canvas);

        page.render({
          canvasContext: context,
          viewport: viewport,
        });
      });
    }
  }).catch(function (error) {
    container.innerHTML = "PDF load error: " + error.message;
  });
}
