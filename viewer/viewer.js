const params = new URLSearchParams(window.location.search);
let pdfPath = params.get("pdf");

if (!pdfPath) {
  alert("PDF not specified");
  throw new Error("PDF missing");
}

pdfPath = "/krisishikkha/" + pdfPath;

pdfjsLib.GlobalWorkerOptions.workerSrc =
"/krisishikkha/vendor/pdfjs/pdf.worker.min.js";

const container = document.body;

pdfjsLib.getDocument(pdfPath).promise.then(pdf => {

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

    pdf.getPage(pageNum).then(page => {

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const viewport = page.getViewport({ scale: 1.3 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.display = "block";
      canvas.style.margin = "20px auto";

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
