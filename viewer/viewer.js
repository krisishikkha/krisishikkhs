const params = new URLSearchParams(window.location.search);
let pdfPath = params.get("pdf");

if(!pdfPath){
  alert("PDF not found");
}

pdfPath = "../" + pdfPath;

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "../vendor/pdfjs/pdf.worker.min.js";

const container = document.getElementById("pdfContainer");
const topbar = document.getElementById("topbar");

let scale = 1.25;
let savedScroll = localStorage.getItem(pdfPath + "_scroll");

pdfjsLib.getDocument(pdfPath).promise.then(pdf=>{
  topbar.innerText = "Total Pages: " + pdf.numPages;

  for(let i = 1; i <= pdf.numPages; i++){
    pdf.getPage(i).then(page=>{
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      container.appendChild(canvas);

      page.render({
        canvasContext: ctx,
        viewport: viewport
      });
    });
  }

  // restore scroll position
  setTimeout(()=>{
    if(savedScroll){
      window.scrollTo(0, savedScroll);
    }
  }, 800);
});

// save reading progress
window.addEventListener("scroll", ()=>{
  localStorage.setItem(pdfPath + "_scroll", window.scrollY);
});

// block shortcuts
document.addEventListener("keydown", e=>{
  if(
    e.ctrlKey &&
    (e.key === "s" || e.key === "p" || e.key === "u")
  ){
    e.preventDefault();
  }
});
