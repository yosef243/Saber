/**
 * Service Worker - V5.1 (Dedicated Version)
 * Optimized for Sabry Kamel Selim Memorial
 */

const CACHE_NAME = 'masbaha-sabry-v5.1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Amiri:wght@400;700&display=swap',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // استثناء روابط العداد من الكاش
  if (url.hostname.includes('countapi')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((resp) => {
        if (resp.ok) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resp.clone()));
        }
        return resp;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
