// ============================================
// صدقة جارية - المرحوم صبري كامل سليم
// Service Worker - الإصدار 2.1.1
// الجزء 1 من 2
// التخزين المؤقت والعمل دون اتصال
// ============================================

// ============================================
// 1. إعدادات الكاش الأساسية
// ============================================
const CACHE_NAME = 'sabry-memorial-v2.1.1-cache';
const CACHE_VERSION = '2.1.1';
const APP_SHELL = '/Saber/';

// ============================================
// 2. الموارد الأساسية (تخزين فوري)
// ============================================
const STATIC_ASSETS = [
  APP_SHELL,
  APP_SHELL + 'index.html',
  APP_SHELL + 'css/style.css',
  APP_SHELL + 'js/app.js',
  APP_SHELL + 'js/masbaha.js',
  APP_SHELL + 'js/duas-azkar.js',
  APP_SHELL + 'js/storage.js',
  APP_SHELL + 'js/utils.js',
  APP_SHELL + 'data/content.js',
  APP_SHELL + 'manifest.json',
  APP_SHELL + 'assets/icons/icon-192x192.png',
  APP_SHELL + 'assets/icons/icon-512x512.png'
];

// ============================================
// 3. الموارد الخارجية (اختياري - قد تفشل بدون إنترنت)
// ============================================
const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Amiri:wght@400;700&display=swap',
  'https://fonts.gstatic.com/s/tajawal/v8/Iurf6YBj_oCad4k1l_6gLrZu.woff2',
  'https://www.googletagmanager.com/gtag/js?id=G-48LGD8FVRY'
];

// ============================================
// 4. الروابط التي لا نخزنها (دائماً من الشبكة)
// ============================================
const SKIP_CACHE_PATTERNS = [
  'google-analytics',
  'googletagmanager',
  'countapi',
  'analytics'
];

// ============================================
// 5. دالة التحقق من أن الرابط يجب تخطيه
// ============================================
function shouldSkipCache(url) {
  return SKIP_CACHE_PATTERNS.some(pattern => url.includes(pattern));
}

// ============================================
// 6. حدث التثبيت (Install)
// ============================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v' + CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache opened:', CACHE_NAME);
        
        // تخزين الموارد الأساسية
        return cache.addAll(STATIC_ASSETS)
          .then(() => {
            console.log('[SW] Static assets cached');
            
            // محاولة تخزين الموارد الخارجية (بدون إيقاف إذا فشلت)
            return Promise.all(
              EXTERNAL_ASSETS.map(url => 
                cache.add(url).catch(err => {
                  console.log('[SW] External asset failed (expected):', url);
                })
              )
            );
          });
      })
      .then(() => {
        console.log('[SW] Installation complete, skipping waiting');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Installation error:', err);
      })
  );
});// ============================================
// صدقة جارية - المرحوم صبري كامل سليم
// Service Worker - الإصدار 2.1.1
// الجزء 2 من 2
// التخزين المؤقت والعمل دون اتصال
// ============================================

// ============================================
// 7. حدث التفعيل (Activate)
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v' + CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // حذف جميع الكاشات القديمة
              return name !== CACHE_NAME && name.startsWith('sabry-memorial');
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete, claiming clients');
        return self.clients.claim();
      })
  );
});

// ============================================
// 8. حدث الاعتراض (Fetch)
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // تجاهل الطلبات غير GET
  if (request.method !== 'GET') {
    return;
  }
  
  // تخطي الروابط الخارجية (Analytics, CountAPI)
  if (shouldSkipCache(url.href)) {
    console.log('[SW] Skipping cache for:', url.href);    return;
  }
  
  // استراتيجية: Cache First ثم Network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', request.url);
          
          // تحديث في الخلفية (Stale While Revalidate)
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(request, networkResponse.clone()));
              }
            })
            .catch(() => {
              // لا نفعل شيئاً إذا فشل التحديث
            });
          
          return cachedResponse;
        }
        
        // إذا لم يكن في الكاش، نجلب من الشبكة
        console.log('[SW] Fetching from network:', request.url);
        return fetch(request)
          .then((networkResponse) => {
            // تخزين الاستجابات الجديدة
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed:', error);
            
            // إذا كان طلب صفحة، نرجع index.html
            if (request.mode === 'navigate') {
              return caches.match(APP_SHELL + 'index.html');
            }
            
            // إذا فشل كل شيء، نرجع استجابة فارغة
            return new Response('', { status: 404 });
          });
      })
  );});

// ============================================
// 9. التعامل مع رسائل من الصفحة الرئيسية
// ============================================
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  // تخطي الانتظار وتحديث فوري
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skipping waiting...');
    self.skipWaiting();
  }
  
  // إرسال إصدار الكاش
  if (event.data && event.data.type === 'GET_VERSION') {
    console.log('[SW] Sending version:', CACHE_VERSION);
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
  
  // مسح الكاش
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW] Clearing cache...');
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((name) => caches.delete(name))
          );
        })
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
    );
  }
});

// ============================================
// 10. معالجة الأخطاء العامة
// ============================================
self.addEventListener('error', (event) => {
  console.error('[SW] Error occurred:', event.message);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

// ============================================
// 11. رسالة ترحيب عند بدء التشغيل// ============================================
console.log('[SW] ====================================');
console.log('[SW] Service Worker Loaded Successfully!');
console.log('[SW] Cache Name:', CACHE_NAME);
console.log('[SW] Cache Version:', CACHE_VERSION);
console.log('[SW] App Shell:', APP_SHELL);
console.log('[SW] ====================================');

// ============================================
// نهاية ملف Service Worker
// ============================================