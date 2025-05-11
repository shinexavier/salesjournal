const CACHE_NAME = 'sales-journal-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
];

// Install event - cache assets
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app assets');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activated.');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise try the network
        return fetch(event.request)
          .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Add to cache for future use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // If both cache and network fail, show a fallback
            if (event.request.url.indexOf('.html') > -1) {
              return caches.match('/index.html');
            }
          });
      })
  );
});