const CACHE_NAME = 'krisishikkha-v1';

const OFFLINE_URLS = [
  '/krisishikkha/',
  '/krisishikkha/index.html',
  '/krisishikkha/manifest.json',
  '/krisishikkha/ntrca.html',
  '/krisishikkha/privacy-policy.html',
  '/krisishikkha/terms.html',
  '/krisishikkha/assets/icons/icon-192.png',
  '/krisishikkha/assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
