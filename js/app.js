// ============================================
// صدقة جارية - المرحوم صبري كامل سليم
// Main App - نسخة مبسطة
// ============================================

console.log('[App] Starting...');

// انتظر حتى تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] DOM Loaded');
  
  try {
    // تحقق من وجود الوحدات
    if (typeof Masbaha === 'undefined') {
      console.error('[App] Masbaha module not found!');
      return;
    }
    
    if (typeof DuasAzkar === 'undefined') {
      console.error('[App] DuasAzkar module not found!');
      return;
    }
    
    // تهيئة التبويبات
    initTabs();
    
    // تهيئة الوحدات
    Masbaha.init();
    DuasAzkar.init();
    
    console.log('[App] Initialized successfully!');
  } catch (error) {
    console.error('[App] Error:', error);
  }
});

// ============================================
// نظام التبويبات المبسط
// ============================================
function initTabs() {
  console.log('[App] Initializing tabs...');
  
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('[App] Tab clicked:', btn.dataset.tab);
      
      const tabId = btn.dataset.tab;
      
      // إخفاء جميع التبويبات
      tabContents.forEach(content => {
        content.hidden = true;
        content.classList.remove('active');
      });
      
      // إزالة النشاط من جميع الأزرار
      tabBtns.forEach(b => {
        b.classList.remove('active');
      });
      
      // إظهار التبويب المطلوب
      const activeTab = document.getElementById(tabId);
      if (activeTab) {
        activeTab.hidden = false;
        activeTab.classList.add('active');
        btn.classList.add('active');
        console.log('[App] Tab activated:', tabId);
      }
    });
  });
  
  console.log('[App] Tabs initialized');
}