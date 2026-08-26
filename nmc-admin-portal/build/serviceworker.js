const CACHE_NAME = 'version-1';
const urlsToCache = ['index.html', 'offline.html'];

const self = this;

// Install SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');

      return cache.addAll(urlsToCache);
    })
  );
});

// Listen for requests
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then(() => {
//       return fetch(event.request).catch(() => caches.match('offline.html'));
//     })
//   );
// });

// REMOVE API CALL FROM SEVICE WORKER 
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // 🚫 Disable Service Worker for API calls
  if (url.includes("/api/")) {
    return; // SW will NOT intercept these requests
  }

});

// Activate the SW
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
