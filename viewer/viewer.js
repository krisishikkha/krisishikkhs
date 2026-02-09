pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const urlParams = new URLSearchParams(location.search);
const pdfUrl = urlParams.get("pdf");

const viewer = document.getElementById("viewer");
const progressBar = document.getElementById("progress");
const searchInput = document.getElementById("search");

let pdfDoc = null;
let totalPages = 0;
let renderedPages = 0;
let pageText = [];

if(!pdfUrl){
  viewer.innerHTML="<p style='text-align:center'>PDF not found</p>";
  throw "";
}

const storageKey = "scroll-"+pdfUrl;

// 🔒 BLOCK COPY / SAVE / RIGHT CLICK
document.addEventListener("contextmenu",e=>e.preventDefault());
document.addEventListener("keydown",e=>{
  if(e.ctrlKey && ["s","p","c","u"].includes(e.key.toLowerCase()))
    e.preventDefault();
});

// LOAD PDF
pdfjsLib.getDocument(pdfUrl).promise.then(pdf=>{
  pdfDoc = pdf;
  totalPages = pdf.numPages;

  for(let i=1;i<=totalPages;i++){
    renderPage(i);
  }
});

// RENDER PAGE
function renderPage(num){
  pdfDoc.getPage(num).then(page=>{
    const viewport = page.getViewport({scale:1.4});
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    viewer.appendChild(canvas);

    page.render({canvasContext:ctx,viewport}).promise.then(()=>{
      renderedPages++;
      updateProgress();
    });

    // TEXT FOR SEARCH
    page.getTextContent().then(txt=>{
      pageText[num]=txt.items.map(i=>i.str).join(" ");
    });
  });
}

// PROGRESS BAR
function updateProgress(){
  const percent = Math.floor((renderedPages/totalPages)*100);
  progressBar.style.width = percent+"%";
}

// SEARCH
searchInput.oninput = ()=>{
  const q = searchInput.value.toLowerCase();
  const canvases = viewer.querySelectorAll("canvas");

  canvases.forEach((c,i)=>{
    const match = pageText[i+1]?.toLowerCase().includes(q);
    c.style.display = (!q || match) ? "block" : "none";
  });
};

// 💾 SCROLL POSITION SAVE
window.addEventListener("scroll",()=>{
  localStorage.setItem(storageKey,window.scrollY);
});

// 🔁 RESTORE LAST READ POSITION
window.onload = ()=>{
  const y = localStorage.getItem(storageKey);
  if(y) setTimeout(()=>window.scrollTo(0,y),600);
};
