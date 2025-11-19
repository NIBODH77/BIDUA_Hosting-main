// Service Worker disabled - no caching in development
// This prevents stale UI and fallback caching issues

self.addEventListener('install', (event) => {
  // Skip waiting and activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clear all caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      // Claim all clients immediately
      return self.clients.claim();
    })
  );
});

// Don't cache anything - just pass through to network
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

