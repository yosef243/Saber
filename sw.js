// رفعنا الإصدار إلى v0.0.4 لإجبار المتصفحات على مسح الكاش القديم فوراً
const CACHE_NAME = 'sabry-sadaqa-v0.0.4';

const ASSETS = [
    './',
    './index.html',
    './css/main.css',
    './css/themes.css',
    './js/core.js',
    './js/ui.js',
    './js/pwa.js',
    './data/azkar.js',
    './data/duas.js',
    './data/tasks.js',
    './data/names.js',
    './data/stories.js',
    './manifest.json',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(ASSETS))
        .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('Deleting old cache:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
