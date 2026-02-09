pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

/* GET PDF */
const params = new URLSearchParams(location.search);
let pdfUrl = params.get("pdf");

if(!pdfUrl){
  document.getElementById("viewer").innerHTML =
    "<p style='text-align:center'>PDF not found</p>";
  throw "";
}

if(!pdfUrl.startsWith("/")){
  pdfUrl = "/" + pdfUrl;
}

/* ELEMENTS */
const viewer = document.getElementById("viewer");
const progressBar = document.getElementById("progress");
const searchInput = document.getElementById("search");

/* STATE */
let pdfDoc = null;
let totalPages = 0;
let renderedPages = 0;
let pageText = [];

/* STORAGE KEY */
const scrollKey = "scroll_" + pdfUrl;

/* BLOCK COPY / SAVE / RIGHT CLICK */
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("keydown", e=>{
  if(
    (e.ctrlKey || e.metaKey) &&
    ["s","p","u","c"].includes(e.key.toLowerCase())
  ){
    e.preventDefault();
  }
});

/* LOAD PDF */
pdfjsLib.getDocument(pdfUrl).promise.then(pdf=>{
  pdfDoc = pdf;
  totalPages = pdf.numPages;

  for(let i=1;i<=totalPages;i++){
    renderPage(i);
  }

  restoreScroll();
});

/* RENDER PAGE */
function renderPage(num){
  pdfDoc.getPage(num).then(page=>{
    const viewport = page.getViewport({ scale:1.4 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    viewer.appendChild(canvas);

    page.render({ canvasContext:ctx, viewport }).promise.then(()=>{
      renderedPages++;
      updateProgress();
    });

    page.getTextContent().then(tc=>{
      pageText[num] = tc.items.map(i=>i.str).join(" ").toLowerCase();
    });
  });
}

/* PROGRESS */
function updateProgress(){
  const percent = Math.floor((renderedPages/totalPages)*100);
  progressBar.style.width = percent + "%";
}

/* SEARCH */
searchInput.oninput = ()=>{
  const q = searchInput.value.toLowerCase();
  const canvases = viewer.querySelectorAll("canvas");

  canvases.forEach((c,i)=>{
    const match = pageText[i+1]?.includes(q);
    c.style.display = !q || match ? "block" : "none";
  });
};

/* SAVE SCROLL */
window.addEventListener("scroll", ()=>{
  localStorage.setItem(scrollKey, window.scrollY);
});

/* RESTORE SCROLL */
function restoreScroll(){
  const y = localStorage.getItem(scrollKey);
  if(y){
    setTimeout(()=>window.scrollTo(0, parseInt(y)), 1200);
  }
}
