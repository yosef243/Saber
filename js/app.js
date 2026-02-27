// ============================================
// صدقة جارية - المرحوم صبري كامل سليم
// Main App Module - الإصدار 2.1.0
// الجزء 1 من 2
// التهيئة الرئيسية للتطبيق
// ============================================

import Storage from './storage.js';
import { 
  toggleTheme, 
  applySavedTheme, 
  shareApp, 
  shareCurrentPage,
  fetchVisitorCount, 
  registerServiceWorker,
  checkAnniversary,
  showToast,
  trackEvent,
  trackPageView,
  formatNumberArabic
} from './utils.js';
import Masbaha from './masbaha.js';
import DuasAzkar from './duas-azkar.js';

// ============================================
// 1. ثوابت التطبيق
// ============================================
const APP_CONFIG = {
  VERSION: '2.1.0',
  NAME: 'صدقة جارية - المرحوم صبري كامل سليم',
  ANALYTICS_ID: 'G-48LGD8FVRY',
  STORAGE_PREFIX: 'sabry_memorial_'
};

// ============================================
// 2. حالة التطبيق العامة
// ============================================
const AppState = {
  initialized: false,
  theme: 'light',
  currentTab: 'masbaha',
  visitorCount: 0
};

// ============================================
// 3. التهيئة عند تحميل الصفحة
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[App] DOMContentLoaded - Starting initialization...');
    try {
    // عرض إصدار التطبيق
    displayAppVersion();
    
    // تسجيل Service Worker
    registerServiceWorker();
    
    // تهيئة الثيم
    initTheme();
    
    // تهيئة التبويبات
    initTabs();
    
    // تهيئة زر المشاركة
    initShare();
    
    // تهيئة زر الإعدادات
    initSettings();
    
    // تهيئة وضع الخشوع
    initKhushuMode();
    
    // تهيئة النوافذ المنبثقة
    initModals();
    
    // تهيئة عداد الزوار
    await initVisitorCounter();
    
    // التحقق من ذكرى الوفاة
    checkDeathAnniversary();
    
    // تهيئة شاشة الترحيب
    initOnboarding();
    
    // تهيئة الوحدات الرئيسية
    Masbaha.init();
    DuasAzkar.init();
    
    // تتبع عرض الصفحة في Analytics
    trackPageView(window.location.pathname, document.title);
    
    // تحديث حالة التطبيق
    AppState.initialized = true;
    
    // تتبع الحدث في Analytics
    trackEvent('App', 'init', 'App initialized', 1);
    
    console.log('[App] Initialization complete!');
  } catch (error) {
    console.error('[App] Initialization error:', error);    showToast('❌ حدث خطأ أثناء تحميل التطبيق', 3000, 'error');
  }
});

// ============================================
// 4. عرض إصدار التطبيق
// ============================================
function displayAppVersion() {
  try {
    const versionEl = document.getElementById('app-version');
    if (versionEl) {
      versionEl.textContent = APP_CONFIG.VERSION;
    }
    console.log('[App] Version:', APP_CONFIG.VERSION);
  } catch (error) {
    console.error('[App] Display version error:', error);
  }
}

// ============================================
// 5. تهيئة الوضع الليلي (Theme)
// ============================================
function initTheme() {
  try {
    const savedTheme = Storage.get(Storage.keys.THEME, 'light');
    AppState.theme = savedTheme;
    applySavedTheme(savedTheme);
    console.log('[App] Theme initialized:', savedTheme);
  } catch (error) {
    console.error('[App] Init theme error:', error);
  }
}

// ============================================
// 6. تهيئة نظام التبويبات
// ============================================
function initTabs() {
  try {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // التحقق من وجود بارامتر tab في URL (لـ PWA shortcuts)
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get('tab');
    
    if (tabFromUrl && document.getElementById(tabFromUrl)) {
      // تفعيل التبويب من URL
      activateTab(tabFromUrl, tabBtns, tabContents);
    }
        tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        activateTab(tabId, tabBtns, tabContents);
        
        // تتبع الحدث في Analytics
        trackEvent('Navigation', 'tab_change', tabId);
      });
    });
    
    console.log('[App] Tabs initialized');
  } catch (error) {
    console.error('[App] Init tabs error:', error);
  }
}

// ============================================
// 7. تفعيل تبويب محدد
// ============================================
function activateTab(tabId, tabBtns, tabContents) {
  try {
    // تحديث الأزرار
    tabBtns.forEach(btn => {
      const isActive = btn.dataset.tab === tabId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    
    // تحديث المحتوى
    tabContents.forEach(content => {
      const isActive = content.id === tabId;
      content.hidden = !isActive;
      content.classList.toggle('active', isActive);
    });
    
    // تحديث حالة التطبيق
    AppState.currentTab = tabId;
    
    console.log('[App] Tab activated:', tabId);
  } catch (error) {
    console.error('[App] Activate tab error:', error);
  }
}

// ============================================
// 8. تهيئة زر المشاركة
// ============================================
function initShare() {
  try {
    const shareBtn = document.getElementById('share-btn');    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const success = await shareCurrentPage();
        if (success) {
          trackEvent('Share', 'click', 'Page shared');
        }
      });
    }
    console.log('[App] Share button initialized');
  } catch (error) {
    console.error('[App] Init share error:', error);
  }
}// ============================================
// 9. تهيئة زر الإعدادات
// ============================================
function initSettings() {
  try {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtn = document.getElementById('close-settings');
    const fontSizeSelect = document.getElementById('font-size-select');
    const soundSelect = document.getElementById('sound-select');
    const bgSelect = document.getElementById('bg-select');
    const anniversaryInput = document.getElementById('anniversary-date');
    
    // فتح نافذة الإعدادات
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        settingsModal?.classList.remove('hidden');
        loadSettingsToForm();
        trackEvent('Settings', 'open', 'Settings opened');
      });
    }
    
    // إغلاق نافذة الإعدادات وحفظ التغييرات
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        saveSettingsFromForm();
        settingsModal?.classList.add('hidden');
        trackEvent('Settings', 'save', 'Settings saved');
      });
    }
    
    // إغلاق النافذة عند النقر خارجها
    if (settingsModal) {
      settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
          saveSettingsFromForm();
          settingsModal.classList.add('hidden');
        }
      });
    }
    
    console.log('[App] Settings initialized');
  } catch (error) {
    console.error('[App] Init settings error:', error);
  }
}

// ============================================
// 10. تحميل الإعدادات إلى النموذج
// ============================================function loadSettingsToForm() {
  try {
    const fontSize = Storage.get(Storage.keys.FONT_SIZE, 'medium');
    const sound = Storage.get(Storage.keys.SOUND, 'on');
    const bg = Storage.get(Storage.keys.BG_PATTERN, 'plain');
    const anniversary = Storage.get(Storage.keys.ANNIVERSARY, '');
    
    const fontSizeSelect = document.getElementById('font-size-select');
    const soundSelect = document.getElementById('sound-select');
    const bgSelect = document.getElementById('bg-select');
    const anniversaryInput = document.getElementById('anniversary-date');
    
    if (fontSizeSelect) fontSizeSelect.value = fontSize;
    if (soundSelect) soundSelect.value = sound;
    if (bgSelect) bgSelect.value = bg;
    if (anniversaryInput) anniversaryInput.value = anniversary;
    
    console.log('[App] Settings loaded to form');
  } catch (error) {
    console.error('[App] Load settings error:', error);
  }
}

// ============================================
// 11. حفظ الإعدادات من النموذج
// ============================================
function saveSettingsFromForm() {
  try {
    const fontSizeSelect = document.getElementById('font-size-select');
    const soundSelect = document.getElementById('sound-select');
    const bgSelect = document.getElementById('bg-select');
    const anniversaryInput = document.getElementById('anniversary-date');
    
    const fontSize = fontSizeSelect?.value || 'medium';
    const sound = soundSelect?.value || 'on';
    const bg = bgSelect?.value || 'plain';
    const anniversary = anniversaryInput?.value || '';
    
    // حفظ الإعدادات
    Storage.set(Storage.keys.FONT_SIZE, fontSize);
    Storage.set(Storage.keys.SOUND, sound);
    Storage.set(Storage.keys.BG_PATTERN, bg);
    Storage.set(Storage.keys.ANNIVERSARY, anniversary);
    
    // تطبيق الإعدادات فوراً
    applySettings();
    
    console.log('[App] Settings saved from form');
  } catch (error) {
    console.error('[App] Save settings error:', error);  }
}

// ============================================
// 12. تطبيق الإعدادات
// ============================================
function applySettings() {
  try {
    const fontSize = Storage.get(Storage.keys.FONT_SIZE, 'medium');
    const bg = Storage.get(Storage.keys.BG_PATTERN, 'plain');
    
    // تطبيق حجم الخط
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${fontSize}`);
    
    // تطبيق الخلفية
    if (bg === 'pattern') {
      document.body.classList.add('body-pattern');
    } else {
      document.body.classList.remove('body-pattern');
    }
    
    console.log('[App] Settings applied');
  } catch (error) {
    console.error('[App] Apply settings error:', error);
  }
}

// ============================================
// 13. تهيئة وضع الخشوع
// ============================================
function initKhushuMode() {
  try {
    const khushuBtn = document.getElementById('khushu-btn');
    
    if (khushuBtn) {
      khushuBtn.addEventListener('click', () => {
        document.body.classList.toggle('khushu-mode');
        
        // تغيير أيقونة الزر
        const isKhushu = document.body.classList.contains('khushu-mode');
        khushuBtn.textContent = isKhushu ? '🔍' : '🤲';
        khushuBtn.setAttribute('aria-label', isKhushu ? 'خروج من وضع الخشوع' : 'وضع الخشوع');
        
        // تتبع الحدث في Analytics
        trackEvent('Khushu', 'toggle', isKhushu ? 'enabled' : 'disabled');
        
        // إظهار رسالة
        showToast(
          isKhushu ? '🤲 دخلت وضع الخشوع' : '🔍 خرجت من وضع الخشوع',          2000,
          'info'
        );
        
        console.log('[App] Khushu mode:', isKhushu ? 'enabled' : 'disabled');
      });
    }
    
    console.log('[App] Khushu mode initialized');
  } catch (error) {
    console.error('[App] Init khushu error:', error);
  }
}

// ============================================
// 14. تهيئة النوافذ المنبثقة (Modals)
// ============================================
function initModals() {
  try {
    // نافذة فضل الذكر
    const virtueModal = document.getElementById('virtue-modal');
    const virtueCloseBtn = virtueModal?.querySelector('.close-modal');
    
    if (virtueCloseBtn) {
      virtueCloseBtn.addEventListener('click', () => {
        virtueModal?.classList.add('hidden');
      });
    }
    
    if (virtueModal) {
      virtueModal.addEventListener('click', (e) => {
        if (e.target === virtueModal) {
          virtueModal.classList.add('hidden');
        }
      });
    }
    
    // نافذة المصادر
    const sourcesBtn = document.getElementById('sources-btn');
    const sourcesModal = document.getElementById('sources-modal');
    const sourcesCloseBtn = sourcesModal?.querySelector('.close-modal');
    
    if (sourcesBtn) {
      sourcesBtn.addEventListener('click', () => {
        sourcesModal?.classList.remove('hidden');
        trackEvent('Sources', 'open', 'Sources opened');
      });
    }
    
    if (sourcesCloseBtn) {      sourcesCloseBtn.addEventListener('click', () => {
        sourcesModal?.classList.add('hidden');
      });
    }
    
    if (sourcesModal) {
      sourcesModal.addEventListener('click', (e) => {
        if (e.target === sourcesModal) {
          sourcesModal.classList.add('hidden');
        }
      });
    }
    
    // زر تحديث التطبيق
    const updateBtn = document.getElementById('update-btn');
    if (updateBtn) {
      updateBtn.addEventListener('click', () => {
        window.location.reload();
        trackEvent('Update', 'click', 'App update triggered');
      });
    }
    
    console.log('[App] Modals initialized');
  } catch (error) {
    console.error('[App] Init modals error:', error);
  }
}

// ============================================
// 15. تهيئة عداد الزوار
// ============================================
async function initVisitorCounter() {
  try {
    const counterEl = document.getElementById('visits');
    if (!counterEl) {
      console.log('[App] Visitor counter element not found');
      return;
    }
    
    const count = await fetchVisitorCount();
    
    if (count !== null) {
      AppState.visitorCount = count;
      counterEl.textContent = formatNumberArabic(count);
      console.log('[App] Visitor count:', count);
    } else {
      counterEl.textContent = 'غير متاح';
      console.log('[App] Visitor count unavailable');
    }
  } catch (error) {    console.error('[App] Init visitor counter error:', error);
    const counterEl = document.getElementById('visits');
    if (counterEl) {
      counterEl.textContent = '---';
    }
  }
}

// ============================================
// 16. التحقق من ذكرى الوفاة
// ============================================
function checkDeathAnniversary() {
  try {
    const anniversary = Storage.get(Storage.keys.ANNIVERSARY, '');
    
    if (!anniversary) {
      return;
    }
    
    if (checkAnniversary(anniversary)) {
      // عرض رسالة خاصة في الذكرى
      setTimeout(() => {
        showToast('🤲 اليوم ذكرى رحيل المرحوم صبري كامل سليم', 5000, 'info');
        trackEvent('Anniversary', 'reminder', 'Death anniversary today');
      }, 2000);
    }
  } catch (error) {
    console.error('[App] Check anniversary error:', error);
  }
}

// ============================================
// 17. تهيئة شاشة الترحيب (Onboarding)
// ============================================
function initOnboarding() {
  try {
    const onboardingModal = document.getElementById('onboarding-modal');
    const onboardingOkBtn = document.getElementById('onboarding-ok');
    
    // التحقق مما إذا كان المستخدم قد شاهد الشاشة من قبل
    const hasSeenOnboarding = Storage.get(Storage.keys.ONBOARDED, false);
    
    if (!hasSeenOnboarding && onboardingModal) {
      // عرض شاشة الترحيب
      onboardingModal.classList.remove('hidden');
      
      trackEvent('Onboarding', 'show', 'Onboarding shown');
    }
    
    // زر المتابعة    if (onboardingOkBtn) {
      onboardingOkBtn.addEventListener('click', () => {
        Storage.set(Storage.keys.ONBOARDED, true);
        onboardingModal?.classList.add('hidden');
        trackEvent('Onboarding', 'complete', 'Onboarding completed');
      });
    }
    
    console.log('[App] Onboarding initialized');
  } catch (error) {
    console.error('[App] Init onboarding error:', error);
  }
}

// ============================================
// 18. دعم تثبيت PWA (Android)
// ============================================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('[App] PWA install prompt available');
  
  // تتبع الحدث في Analytics
  trackEvent('PWA', 'install_available', 'Install prompt shown');
  
  // يمكن هنا إظهار زر "تثبيت التطبيق" مخصص
  // showInstallButton();
});

// دالة لتثبيت التطبيق (يمكن استدعاؤها من زر مخصص)
export async function installApp() {
  try {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[App] Install outcome:', outcome);
      
      // تتبع الحدث في Analytics
      trackEvent('PWA', 'install', outcome);
      
      deferredPrompt = null;
      return outcome === 'accepted';
    }
    return false;
  } catch (error) {
    console.error('[App] Install app error:', error);
    return false;
  }}

// ============================================
// 19. معالجة الأخطاء العامة
// ============================================
window.addEventListener('error', (e) => {
  console.error('[App] Global error:', e.error);
  trackEvent('Error', 'global', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('[App] Unhandled promise rejection:', e.reason);
  trackEvent('Error', 'unhandled_promise', e.reason?.message || 'Unknown');
});

// ============================================
// 20. تتبع التغيرات في الاتصال بالإنترنت
// ============================================
window.addEventListener('online', () => {
  console.log('[App] Back online');
  trackEvent('Connection', 'online', 'Back online');
  showToast('✅ عدت للاتصال بالإنترنت', 2000, 'success');
});

window.addEventListener('offline', () => {
  console.log('[App] Gone offline');
  trackEvent('Connection', 'offline', 'Gone offline');
  showToast('📴 تعمل دون اتصال بالإنترنت', 3000, 'warning');
});

// ============================================
// نهاية ملف App
// ============================================
console.log('[App] Module loaded successfully');
console.log('[App] Version:', APP_CONFIG.VERSION);
console.log('[App] Ready to use! 🚀');