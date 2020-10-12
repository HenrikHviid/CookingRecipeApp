var cacheName = 'pwa-cookingrecipeapp';
var dataCacheName = 'pwa-cookingrecipeapp';

var filesToCache = ['index.html', './css/style.css'];

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== cacheName && key !== dataCacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Cache, falling back to network
// self.addEventListener('fetch', function (e) {
//   //console.log(e.request.url);
//   e.respondWith(
//     caches.match(e.request).then(function (response) {
//       return response || fetch(e.request) ;
//     })
//   );
// });

// Cache, falling back to network with frequent updates
self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.open(cacheName).then(function (cache) {
      return cache.match(e.request).then(function (cachedResponse) {
        var fetchPromise =
          fetch(e.request).then(function (networkResponse) {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        return cachedResponse || fetchPromise;
      })
    })
  );
});
