var cacheName = 'pwa-cookingrecipeapp';
var dataCacheName = 'pwa-cookingrecipeapp';

var filesToCache = ['index.html', './css/style.css', '404.html', 'offline.html'];

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

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).then(function () {
      if (response.status === 404) {
        return caches.match('/404.html');
      } else {
        caches.put(event.request, networkResponse.clone());
      }     
    }).catch(function() {
      return caches.match(event.request);
      //return caches.match('/offline.html');
    })
  );
});