pdfjsLib.GlobalWorkerOptions.workerSrc =
'/krisishikkha/vendor/pdfjs/pdf.worker.min.js';

const urlParams = new URLSearchParams(window.location.search);
const pdfFile = urlParams.get('pdf');

// ✅ Absolute path for GitHub Pages
const pdfPath = '/krisishikkha/pdf/' + pdfFile;

const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');

let pdfDoc = null;
let pageNum = 1;

pdfjsLib.getDocument(pdfPath).promise.then(pdf => {
  pdfDoc = pdf;
  renderPage(pageNum);
}).catch(err => {
  alert("PDF load error: " + err.message);
});

function renderPage(num) {
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale: 1.4 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    page.render({
      canvasContext: ctx,
      viewport: viewport
    });
  });
}

document.addEventListener('contextmenu', e => e.preventDefault());
