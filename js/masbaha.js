// ============================================
// صدقة جارية - المرحوم صبري كامل سليم
// Masbaha Module - الإصدار 2.1.0
// الجزء 1 من 2
// منطق المسبحة الإلكترونية
// ============================================

import Storage from './storage.js';
import { playClickSound, vibrate, triggerConfetti, trackEvent } from './utils.js';
import { dhikrVirtues } from '../data/content.js';

// ============================================
// 1. كائن المسبحة الرئيسي
// ============================================
const Masbaha = {
  // حالة العداد الحالي (للدورة)
  counter: 0,
  
  // الإجمالي الكلي (لا يصفر إلا بحذف البيانات)
  totalCount: 0,
  
  // عدد الدورات المكتملة (كل 33 تسبيحة)
  cycle: 0,
  
  // مؤشر الذكر الحالي في القائمة
  dhikrIndex: 0,
  
  // قائمة الأذكار (تتغير كل 33 تسبيحة)
  dhikrList: [
    'سُبْحَانَ اللَّهِ',
    'الْحَمْدُ لِلَّهِ',
    'اللَّهُ أَكْبَرُ',
    'لَا إِلَهَ إِلَّا اللَّهُ'
  ],
  
  // ============================================
  // 2. تهيئة المسبحة
  // ============================================
  init() {
    console.log('[Masbaha] Initializing...');
    
    // تحميل القيم المحفوظة
    this.loadSavedData();
    
    // تحديث الواجهة
    this.updateDisplay();
    
    // ربط الأحداث
    this.bindEvents();
        // تتبع الحدث في Analytics
    trackEvent('Masbaha', 'init', 'Masbaha loaded');
    
    console.log('[Masbaha] Initialized successfully');
  },
  
  // ============================================
  // 3. تحميل البيانات المحفوظة
  // ============================================
  loadSavedData() {
    try {
      this.counter = Storage.get(Storage.keys.COUNTER, 0);
      this.totalCount = Storage.get(Storage.keys.TOTAL_COUNT, 0);
      this.cycle = Storage.get(Storage.keys.CYCLE, 0);
      this.dhikrIndex = Storage.get(Storage.keys.CURRENT_DHIKR, 0);
      
      console.log('[Masbaha] Loaded data:', {
        counter: this.counter,
        totalCount: this.totalCount,
        cycle: this.cycle,
        dhikrIndex: this.dhikrIndex
      });
    } catch (error) {
      console.error('[Masbaha] Load data error:', error);
      // قيم افتراضية في حالة الخطأ
      this.counter = 0;
      this.totalCount = 0;
      this.cycle = 0;
      this.dhikrIndex = 0;
    }
  },
  
  // ============================================
  // 4. حفظ البيانات
  // ============================================
  saveData() {
    try {
      Storage.set(Storage.keys.COUNTER, this.counter);
      Storage.set(Storage.keys.TOTAL_COUNT, this.totalCount);
      Storage.set(Storage.keys.CYCLE, this.cycle);
      Storage.set(Storage.keys.CURRENT_DHIKR, this.dhikrIndex);
      console.log('[Masbaha] Data saved');
    } catch (error) {
      console.error('[Masbaha] Save data error:', error);
    }
  },
  
  // ============================================
  // 5. ربط الأحداث (Event Listeners)
  // ============================================  bindEvents() {
    const counterCircle = document.getElementById('counter-circle');
    const resetBtn = document.getElementById('reset-counter');
    const dedicateBtn = document.getElementById('dedicate-btn');
    const virtueBtn = document.getElementById('virtue-btn');
    const virtueModal = document.getElementById('virtue-modal');
    const virtueCloseBtn = virtueModal?.querySelector('.close-modal');
    
    // النقر على دائرة التسبيح
    if (counterCircle) {
      counterCircle.addEventListener('click', () => this.increment());
      
      // دعم لوحة المفاتيح (Enter و Space)
      counterCircle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.increment();
        }
      });
      
      // دعم اللمس المتعدد
      counterCircle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.increment();
      }, { passive: false });
    }
    
    // زر تصفير العداد
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }
    
    // زر إهداء الثواب
    if (dedicateBtn) {
      dedicateBtn.addEventListener('click', () => this.dedicateReward());
    }
    
    // زر فضل الذكر
    if (virtueBtn) {
      virtueBtn.addEventListener('click', () => this.showVirtue());
    }
    
    // زر إغلاق نافذة الفضل
    if (virtueCloseBtn) {
      virtueCloseBtn.addEventListener('click', () => {
        virtueModal.classList.add('hidden');
      });
    }
    
    // إغلاق النافذة عند النقر خارجها    if (virtueModal) {
      virtueModal.addEventListener('click', (e) => {
        if (e.target === virtueModal) {
          virtueModal.classList.add('hidden');
        }
      });
    }
    
    // دعم لوحة المفاتيح (Space) في أي مكان بالصفحة
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' && document.activeElement === document.body) {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab?.id === 'masbaha') {
          e.preventDefault();
          this.increment();
        }
      }
    });
  },// ============================================
  // 6. زيادة العداد (التسبيح)
  // ============================================
  increment() {
    try {
      // التحقق من إعدادات الصوت
      const soundEnabled = Storage.get(Storage.keys.SOUND, 'on') === 'on';
      
      // زيادة العداد
      this.counter++;
      this.totalCount++;
      
      // المؤثرات (صوت + اهتزاز)
      if (soundEnabled) {
        playClickSound();
        vibrate([10]);
      }
      
      // التحقق من اكتمال الدورة (33 تسبيحة)
      if (this.counter % 33 === 0) {
        this.cycle++;
        this.dhikrIndex = (this.dhikrIndex + 1) % this.dhikrList.length;
        triggerConfetti();
        
        // تتبع الحدث في Analytics
        trackEvent('Masbaha', 'cycle_complete', 'Completed 33 counts', this.cycle);
      }
      
      // الحفظ والتحديث
      this.saveData();
      this.updateDisplay();
      
      console.log('[Masbaha] Incremented:', this.counter);
    } catch (error) {
      console.error('[Masbaha] Increment error:', error);
    }
  },
  
  // ============================================
  // 7. تصفير العداد (إعادة تعيين الدورة)
  // ============================================
  reset() {
    try {
      const confirmed = confirm('هل تريد تصفير عداد الدورة الحالية؟\n\nالإجمالي الكلي لن يتأثر.');
      
      if (confirmed) {
        this.counter = 0;
        this.cycle = 0;
        this.saveData();
        this.updateDisplay();        
        // تتبع الحدث في Analytics
        trackEvent('Masbaha', 'reset', 'Counter reset');
        
        console.log('[Masbaha] Reset successfully');
      }
    } catch (error) {
      console.error('[Masbaha] Reset error:', error);
    }
  },
  
  // ============================================
  // 8. إهداء الثواب
  // ============================================
  dedicateReward() {
    try {
      const message = `🤲 تم نية إهداء ثواب هذه التسبيحات عن روح المرحوم صبري كامل سليم\n\nاللهم تقبل منه واجعله في ميزان حسناته\n\nالإجمالي: ${this.totalCount} تسبيحة`;
      
      alert(message);
      
      // تتبع الحدث في Analytics
      trackEvent('Masbaha', 'dedicate', 'Reward dedicated', this.totalCount);
      
      console.log('[Masbaha] Reward dedicated');
    } catch (error) {
      console.error('[Masbaha] Dedicate error:', error);
    }
  },
  
  // ============================================
  // 9. عرض فضل الذكر
  // ============================================
  showVirtue() {
    try {
      const modal = document.getElementById('virtue-modal');
      const textEl = document.getElementById('virtue-text');
      
      if (!modal || !textEl) {
        console.log('[Masbaha] Virtue modal not found');
        return;
      }
      
      const virtue = dhikrVirtues[this.dhikrIndex] || 'فضل عظيم';
      textEl.textContent = virtue;
      modal.classList.remove('hidden');
      
      // تتبع الحدث في Analytics
      trackEvent('Masbaha', 'view_virtue', 'Viewed virtue', this.dhikrIndex);
      
      console.log('[Masbaha] Virtue displayed');    } catch (error) {
      console.error('[Masbaha] Show virtue error:', error);
    }
  },
  
  // ============================================
  // 10. تحديث الواجهة (Display)
  // ============================================
  updateDisplay() {
    try {
      const counterEl = document.getElementById('counter-number');
      const totalEl = document.getElementById('totalCounter');
      const grandTotalEl = document.getElementById('grand-total');
      const cycleEl = document.getElementById('cycle-count');
      const batchEl = document.getElementById('batchCounter');
      const dhikrEl = document.getElementById('dhikrText');
      
      // تحديث العناصر
      if (counterEl) counterEl.textContent = this.counter;
      if (totalEl) totalEl.textContent = this.counter;
      if (grandTotalEl) grandTotalEl.textContent = this.totalCount.toLocaleString('ar-EG');
      if (cycleEl) cycleEl.textContent = this.cycle;
      if (batchEl) batchEl.textContent = `الدورة: ${(this.counter % 33) + 1} / 33`;
      if (dhikrEl) dhikrEl.textContent = this.dhikrList[this.dhikrIndex];
      
      console.log('[Masbaha] Display updated');
    } catch (error) {
      console.error('[Masbaha] Update display error:', error);
    }
  },
  
  // ============================================
  // 11. الحصول على الإحصائيات
  // ============================================
  getStats() {
    return {
      counter: this.counter,
      totalCount: this.totalCount,
      cycle: this.cycle,
      dhikrIndex: this.dhikrIndex,
      currentDhikr: this.dhikrList[this.dhikrIndex],
      progressInCycle: (this.counter % 33) + 1
    };
  }
};

// ============================================
// تصدير الكائن للاستخدام في الملفات الأخرى
// ============================================
export default Masbaha;
// ============================================
// نهاية ملف Masbaha
// ============================================
console.log('[Masbaha] Module loaded successfully');