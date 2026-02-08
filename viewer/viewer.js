pdfjsLib.GlobalWorkerOptions.workerSrc =
'../vendor/pdfjs/pdf.worker.min.js';

const urlParams = new URLSearchParams(window.location.search);
const pdfPath = '../pdf/' + urlParams.get('pdf');

let pdfDoc = null;
let pageNum = 1;
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');

pdfjsLib.getDocument(pdfPath).promise.then(pdf => {
  pdfDoc = pdf;
  renderPage(pageNum);
});

function renderPage(num) {
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    page.render({
      canvasContext: ctx,
      viewport: viewport
    });
  });
}

document.addEventListener('contextmenu', e => e.preventDefault());
