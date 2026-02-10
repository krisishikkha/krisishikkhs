const CACHE_NAME = "krisishikkha-v1";

const ASSETS_TO_CACHE = [
  "/krisishikkha/",
  "/krisishikkha/index.html",
  "/krisishikkha/ntrca.html",
  "/krisishikkha/manifest.json",

  "/krisishikkha/assets/css/style.css",

  "/krisishikkha/assets/icons/icon-192.png",
  "/krisishikkha/assets/icons/icon-512.png",

  "/krisishikkha/vendor/pdfjs/pdf.min.js",
  "/krisishikkha/vendor/pdfjs/pdf.worker.min.js",

  "/krisishikkha/viewer/index.html",
  "/krisishikkha/viewer/viewer.js",

  "/krisishikkha/pages/categories/bcs.html",
  "/krisishikkha/pages/categories/research.html",
  "/krisishikkha/pages/categories/others.html"
];

/* 🔹 INSTALL */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

/* 🔹 ACTIVATE */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

/* 🔹 FETCH */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
