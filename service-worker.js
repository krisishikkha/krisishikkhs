const CACHE_VERSION = "krisishikkha-v9.1";   // 🔥 প্রতি আপডেটে শুধু এটা বাড়াবে
const STATIC_CACHE = CACHE_VERSION + "-static";
const DYNAMIC_CACHE = CACHE_VERSION + "-dynamic";

/* Static core files */
const STATIC_FILES = [
  "./",
  "./index.html",
  "./exam.html",
  "/exam-corner.html",
  "./manifest.json",
  "./assets/css/style.css",
  "./exam.js",
  "./exam-status.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

/* INSTALL */
self.addEventListener("install", event => {
  self.skipWaiting(); // 🔥 নতুন SW সাথে সাথে activate হবে

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_FILES))
  );
});

/* ACTIVATE */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  return self.clients.claim();
});
/* FETCH */
self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  const requestURL = new URL(event.request.url);

  // PDF cache করবে না
  if (requestURL.pathname.endsWith(".pdf")) {
    return;
  }

  // 🔥 EVERYTHING → Network First (instant update)
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
