// public/service-worker.js

const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/offline.html',  // A fallback page when offline
];

// Install event: Cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Respond with cached content if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Return cached content
      }
      
      return fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone()); // Cache new response
          return response;
        });
      });
    })
  );
});

// Handle message from the client (when the app becomes active)
self.addEventListener('message', (event) => {
  if (event.data.type === 'APP_ACTIVE') {
    console.log('The app is now active!');
    
    // Here you can perform tasks, such as sending a push notification,
    // syncing background data, etc.
  }
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
