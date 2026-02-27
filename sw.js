/**
 * Service Worker - V2 (للمشروع الجديد)
 */

const CACHE_NAME = 'sabry-memorial-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/app.js',
  './js/masbaha.js',
  './js/duas-azkar.js',
  './js/storage.js',
  './js/utils.js',
  './data/content.js',
  './assets/icons/icon-72x72.png',
  './assets/icons/icon-96x96.png',
  './assets/icons/icon-128x128.png',
  './assets/icons/icon-144x144.png',
  './assets/icons/icon-152x152.png',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-384x384.png',
  './assets/icons/icon-512x512.png'
];

const DYNAMIC_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Amiri:wght@400;700&display=swap',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // تخزين الملفات الثابتة أولاً
      return cache.addAll(STATIC_ASSETS).then(() => {
        // تخزين الموارد الديناميكية (بشكل منفصل)
        return Promise.all(
          DYNAMIC_ASSETS.map(url => 
            fetch(url).then(res => {
              if (res.ok) cache.put(url, res);
            }).catch(() => {})
          )
        );
      });
    })
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
  const url = new URL(event.request.url);
  
  // استثناء طلبات العداد
  if (url.hostname.includes('countapi') || event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      
      return fetch(event.request).then((response) => {
        // تخزين نسخة من الاستجابة إذا كانت ناجحة ومن نوع GET
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      }).catch(() => {
        // في حالة الفشل (بدون نت) نعيد صفحة بسيطة (اختياري)
        if (event.request.headers.get('accept').includes('text/html')) {
          return new Response('أنت غير متصل بالإنترنت', {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        }
        return new Response('غير متصل', { status: 503 });
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'SKIP_WAITING') self.skipWaiting();
});