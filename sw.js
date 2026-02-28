const CACHE_NAME = 'sadaqa-app-v7';

// قائمة الملفات التي سيتم حفظها لتعمل بدون إنترنت (تم إضافة data.js هنا)
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './data.js',
    './manifest.json',
    './icon-72x72.png',
    './icon-96x96.png',
    './icon-128x128.png',
    './icon-144x144.png',
    './icon-152x152.png',
    './icon-192x192.png',
    './icon-384x384.png',
    './icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Amiri:wght@400;700&display=swap',
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('تم الكاش بنجاح للتحديث الجديد');
            return cache.addAll(ASSETS_TO_CACHE);
        }).catch((err) => console.log('خطأ في الكاش:', err))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // مسح أي كاش قديم لا يطابق الإصدار الحالي لإجبار التحديث
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // نتجاهل طلبات الروابط المخصصة (التي تحتوي على اسم المتوفى) لكي يتم فتحها بشكل صحيح من السيرفر
    if (event.request.url.includes('?name=')) {
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                console.log('التطبيق يعمل في وضع عدم الاتصال (Offline)');
            });
        })
    );
});
