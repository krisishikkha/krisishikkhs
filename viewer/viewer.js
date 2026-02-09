const params = new URLSearchParams(window.location.search);
let pdfPath = params.get("pdf");

pdfPath = "/krisishikkha/" + pdfPath;

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "/krisishikkha/vendor/pdfjs/pdf.worker.min.js";

let pdfDoc = null;
let pageNum = 1;
let canvas = document.getElementById("pdfCanvas");
let ctx = canvas.getContext("2d");

const savedPage = localStorage.getItem(pdfPath);
if(savedPage){
  pageNum = parseInt(savedPage);
}

function renderPage(num){
  pdfDoc.getPage(num).then(page=>{
    const viewport = page.getViewport({scale:1.4});
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    page.render({
      canvasContext: ctx,
      viewport: viewport
    });

    document.getElementById("pageInfo").innerText =
      `Page ${num} / ${pdfDoc.numPages}`;

    localStorage.setItem(pdfPath, num);
  });
}

function nextPage(){
  if(pageNum < pdfDoc.numPages){
    pageNum++;
    renderPage(pageNum);
  }
}

function prevPage(){
  if(pageNum > 1){
    pageNum--;
    renderPage(pageNum);
  }
}

function goBack(){
  history.back();
}

pdfjsLib.getDocument(pdfPath).promise.then(pdf=>{
  pdfDoc = pdf;
  renderPage(pageNum);
});
