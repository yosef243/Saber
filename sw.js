/* sw.js */
const APP_VERSION = '2.2.0';
const CACHE_NAME = `saber-cache-${APP_VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './manifest.json',
  './data/content.js',
  './js/app.js',
  './js/masbaha.js',
  './js/duas-azkar.js',
  './js/storage.js',
  './js/utils/dom.js',
  './js/utils/toast.js',
  './js/utils/media.js',
  './js/utils/pwa.js',
  './js/utils/analytics.js',
  './js/utils/format.js',
  './js/utils/network.js',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())));
    await self.clients.claim();
  })());
});

// Cache-first للـ static + fallback للـ navigation
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // لا نكاشي analytics أو count endpoints
  const url = new URL(req.url);
  if (url.hostname.includes('google-analytics') || url.hostname.includes('googletagmanager')) return;

  // Navigation requests
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const net = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put('./index.html', net.clone());
        return net;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    if (cached) return cached;

    try {
      const res = await fetch(req);
      // كاش بس للـ same-origin GET
      if (req.method === 'GET' && url.origin === self.location.origin && res.ok) {
        cache.put(req, res.clone());
      }
      return res;
    } catch {
      return cached || Response.error();
    }
  })());
});

self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') self.skipWaiting();
});