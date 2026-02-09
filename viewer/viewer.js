// worker path (LOCAL)
pdfjsLib.GlobalWorkerOptions.workerSrc =
"/krisishikkha/vendor/pdfjs/pdf.worker.min.js";

// get pdf param
const params = new URLSearchParams(window.location.search);
let pdfPath = params.get("pdf");

if(!pdfPath){
  alert("PDF not found");
  throw "";
}

// IMPORTANT FIX for GitHub Pages
pdfPath = decodeURIComponent(pdfPath);

// pdf vars
let pdfDoc = null;
let pageNum = 1;
let canvas = document.getElementById("pdfCanvas");
let ctx = canvas.getContext("2d");

// restore last page
const savedPage = localStorage.getItem(pdfPath);
if(savedPage){
  pageNum = parseInt(savedPage);
}

// render page
function renderPage(num){
  pdfDoc.getPage(num).then(page=>{
    const viewport = page.getViewport({ scale: 1.4 });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    page.render({
      canvasContext: ctx,
      viewport: viewport
    });

    document.getElementById("pageInfo").innerText =
      "Page " + num + " / " + pdfDoc.numPages;

    localStorage.setItem(pdfPath, num);
  });
}

// navigation
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

// load pdf
pdfjsLib.getDocument(pdfPath).promise.then(pdf=>{
  pdfDoc = pdf;
  renderPage(pageNum);
});
