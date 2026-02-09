const params = new URLSearchParams(window.location.search);
let pdfPath = "/krisishikkha/" + params.get("pdf");

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "/krisishikkha/vendor/pdfjs/pdf.worker.min.js";

const container = document.getElementById("pdfContainer");
const progressBar = document.getElementById("progress");

let pdfDoc = null;
let totalHeight = 0;

/* 🔒 Security blocks */
document.addEventListener("contextmenu", e=>e.preventDefault());
document.addEventListener("keydown", e=>{
  if(
    (e.ctrlKey && ["p","s","c"].includes(e.key.toLowerCase())) ||
    e.key === "PrintScreen"
  ){
    e.preventDefault();
    alert("❌ Action disabled");
  }
});

/* Load PDF */
pdfjsLib.getDocument(pdfPath).promise.then(pdf=>{
  pdfDoc = pdf;

  const savedScroll = localStorage.getItem(pdfPath + "_scroll");

  for(let i=1;i<=pdf.numPages;i++){
    pdf.getPage(i).then(page=>{
      const viewport = page.getViewport({scale:1.4});
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width  = viewport.width;

      page.render({canvasContext:ctx,viewport});
      container.appendChild(canvas);

      totalHeight += viewport.height;

      /* Restore last scroll */
      if(savedScroll){
        setTimeout(()=>{
          window.scrollTo(0, parseInt(savedScroll));
        },300);
      }
    });
  }
});

/* 📊 Progress + remember scroll */
window.addEventListener("scroll", ()=>{
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const percent = Math.min(100, Math.round((scrollTop/docHeight)*100));

  progressBar.style.width = percent + "%";
  localStorage.setItem(pdfPath + "_scroll", scrollTop);
});================================ */

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
