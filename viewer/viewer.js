/* ===============================
   PDF PATH & PDFJS CONFIG
================================ */

const params = new URLSearchParams(window.location.search);
let pdfPath = params.get("pdf");

/* Full absolute path (your style) */
pdfPath = "/krisishikkha/" + pdfPath;

/* PDF.js worker */
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "/krisishikkha/vendor/pdfjs/pdf.worker.min.js";

/* ===============================
   BASIC SETUP
================================ */

let pdfDoc = null;
let pageNum = 1;

const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");

/* ===============================
   🧠 LAST PAGE REMEMBER
================================ */

/* Use full pdfPath as unique key */
const savedPage = localStorage.getItem(pdfPath);
if(savedPage){
  pageNum = parseInt(savedPage);
}

/* ===============================
   RENDER PAGE
================================ */

function renderPage(num){
  pdfDoc.getPage(num).then(page=>{

    const viewport = page.getViewport({ scale: 1.4 });
    canvas.height = viewport.height;
    canvas.width  = viewport.width;

    page.render({
      canvasContext: ctx,
      viewport: viewport
    });

    document.getElementById("pageInfo").innerText =
      `Page ${num} / ${pdfDoc.numPages}`;

    /* Save current page */
    localStorage.setItem(pdfPath, num);
  });
}

/* ===============================
   NAVIGATION
================================ */

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

/* ===============================
   LOAD PDF
================================ */

pdfjsLib.getDocument(pdfPath).promise.then(pdf=>{
  pdfDoc = pdf;
  renderPage(pageNum);
});

/* ===============================
   🔒 SECURITY BLOCKS
================================ */

/* Block print, save, screenshot key */
document.addEventListener("keydown", e=>{
  if(
    (e.ctrlKey && (e.key === "p" || e.key === "s")) ||
    e.key === "PrintScreen"
  ){
    e.preventDefault();
    alert("❌ Print & Download disabled");
  }
});

/* Disable right click */
document.addEventListener("contextmenu", e=>{
  e.preventDefault();
});

/* ===============================
   📱 ANDROID-LIKE SWIPE BACK
================================ */

let touchStartX = 0;

document.addEventListener("touchstart", e=>{
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", e=>{
  const touchEndX = e.changedTouches[0].screenX;

  /* Swipe right → back */
  if(touchEndX - touchStartX > 120){
    goBack();
  }
});
