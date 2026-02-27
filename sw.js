// sw.js - Service Worker للتخزين المؤقت والعمل دون اتصال
// الإصدار: 2.1.0

const CACHE_NAME = 'sabry-memorial-v2.1.0-cache';
const CACHE_VERSION = '2.1.0';

// الموارد الأساسية التي يجب تخزينها فوراً
const STATIC_ASSETS = [
  '/Saber/',
  '/Saber/index.html',
  '/Saber/css/style.css',
  '/Saber/js/app.js',
  '/Saber/js/masbaha.js',
  '/Saber/js/duas-azkar.js',
  '/Saber/js/storage.js',
  '/Saber/js/utils.js',
  '/Saber/data/content.js',
  '/Saber/manifest.json',
  '/Saber/assets/icons/icon-192x192.png',
  '/Saber/assets/icons/icon-512x512.png'
];

// الموارد الخارجية التي نخزنها (اختياري)
const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Amiri:wght@400;700&display=swap',
  'https://www.googletagmanager.com/gtag/js?id=G-48LGD8FVRY'
];

// ============================================
// 1. تثبيت Service Worker وتخزين الملفات الأساسية
// ============================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Opening cache:', CACHE_NAME);
        
        // تخزين الموارد الأساسية
        return cache.addAll(STATIC_ASSETS)
          .then(() => {
            console.log('[SW] Static assets cached successfully');
            
            // محاولة تخزين الموارد الخارجية (قد تفشل بدون إنترنت)
            return Promise.all(
              EXTERNAL_ASSETS.map(url => 
                cache.add(url).catch(err => {
                  console.log('[SW] Failed to cache external asset:', url, err);
                  // لا نفشل التثبيت إذا فشلت الموارد الخارجية                })
              )
            );
          });
      })
      .then(() => {
        console.log('[SW] Installation complete, skipping waiting');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Installation failed:', err);
      })
  );
});

// ============================================
// 2. تفعيل Service Worker وحذف الذاكرة القديمة
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // حذف جميع الكاشات القديمة إلا الحالية
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
// 3. اعتراض طلبات الشبكة والرد من الكاش أولاً
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
    // تجاهل الطلبات غير GET
  if (request.method !== 'GET') {
    return;
  }
  
  // تجاهل طلبات Google Analytics و CountAPI (دائماً من الشبكة)
  if (url.hostname.includes('google-analytics') || 
      url.hostname.includes('googletagmanager') ||
      url.hostname.includes('countapi')) {
    return;
  }
  
  // استراتيجية: Cache First ثم Network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', request.url);
          
          // تحديث الكاش في الخلفية (Stale While Revalidate)
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(request, networkResponse.clone()));
              }
            })
            .catch(() => {
              // لا نفعل شيئاً إذا فشل التحديث في الخلفية
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
            
            // إذا كان طلب صفحة، نرجع صفحة أساسية            if (request.mode === 'navigate') {
              return caches.match('/Saber/index.html');
            }
            
            // إذا فشل كل شيء، نرجع استجابة فارغة
            return new Response('', { status: 404 });
          });
      })
  );
});

// ============================================
// 4. التعامل مع رسائل من الصفحة الرئيسية
// ============================================
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skipping waiting...');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    console.log('[SW] Sending version:', CACHE_VERSION);
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
  
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
// 5. التعامل مع خلفية التحديثات
// ============================================
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sync-content') {
    console.log('[SW] Periodic sync triggered');
    event.waitUntil(      // هنا يمكن إضافة منطق لتحديث المحتوى دورياً
      Promise.resolve()
    );
  }
});

// ============================================
// 6. معالجة الأخطاء العامة
// ============================================
self.addEventListener('error', (event) => {
  console.error('[SW] Error occurred:', event.message);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

// ============================================
// 7. رسالة ترحيب عند بدء التشغيل
// ============================================
console.log('[SW] Service Worker loaded successfully!');
console.log('[SW] Cache Name:', CACHE_NAME);
console.log('[SW] Cache Version:', CACHE_VERSION);