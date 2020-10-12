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

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.open("cache-name").then(function (cache) {
      //Look at cache else look in network
      //"Cache, falling back to network"
      return cache.match(event.request).then(function (cachedResponse) {
        return cachedResponse || fetch(event.request).then(
          function (networkResponse) {
            //if response have a 404 status we will return a our 404 page
            //"Generic fallback part 1".
            if (response.status === 404) {
              return caches.match('pages/404.html');
            }
            //If the cache.put is succesful in updating the cache then return the respone else we go down to the catch
            //"Cache on demand updating part"
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
      }).catch(function () {
        // If both fail, show a generic fallback:
        // "Generic fallback part 2"
        return caches.match('/offline.html');
      })
    })
  );
});