const params = new URLSearchParams(window.location.search);
let pdfPath = params.get("pdf");

if (!pdfPath) {
  alert("PDF not specified");
  throw new Error("PDF missing");
}

/* GitHub User Page base path */
pdfPath = "/krisishikkha/" + pdfPath;

/* pdf.js worker */
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "/krisishikkha/vendor/pdfjs/pdf.worker.min.js";

/* progress key (per PDF) */
const progressKey = "pdf-progress-" + pdfPath;

const container = document.body;

let totalHeight = 0;   // full PDF height
let viewedPercent = 0;

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

      /* accumulate total height */
      totalHeight += viewport.height;

      page.render({
        canvasContext: ctx,
        viewport: viewport,
      });

    });
  }

  /* show previous progress (if any) */
  const saved = localStorage.getItem(progressKey);
  if (saved) {
    console.log("Previously read: " + saved + "%");
  }

}).catch(err => {
  alert("PDF load error: " + err.message);
});

/* scroll-based reading progress */
window.addEventListener("scroll", () => {

  if (!totalHeight) return;

  const scrollTop = window.scrollY;
  const winHeight = window.innerHeight;

  const viewedHeight = scrollTop + winHeight;

  viewedPercent = Math.min(
    100,
    Math.round((viewedHeight / totalHeight) * 100)
  );

  localStorage.setItem(progressKey, viewedPercent);
});

/* save progress when user leaves page */
window.addEventListener("beforeunload", () => {
  localStorage.setItem(progressKey, viewedPercent);
});
