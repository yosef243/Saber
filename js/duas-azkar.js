// ============================================
// صدقة جارية - المرحوم صبري كامل سليم
// Duas & Azkar Module - الإصدار 2.1.0
// الجزء 1 من 2
// إدارة الأدعية والأذكار
// ============================================

import Storage from './storage.js';
import { copyToClipboard, showToast, trackEvent } from './utils.js';
import { duas, azkar } from '../data/content.js';

// ============================================
// 1. كائن إدارة الأدعية والأذكار
// ============================================
const DuasAzkar = {
  // حالة الأدعية
  currentDuaType: 'deceased',
  currentDuaIndex: {
    deceased: 0,
    general: 0
  },
  
  // حالة الأذكار
  currentAzkarType: 'morning',
  
  // ============================================
  // 2. تهيئة الوحدة
  // ============================================
  init() {
    console.log('[DuasAzkar] Initializing...');
    
    // تحميل التفضيلات المحفوظة
    this.loadSavedPreferences();
    
    // تهيئة واجهة الأدعية
    this.initDuas();
    
    // تهيئة واجهة الأذكار
    this.initAzkar();
    
    // تتبع الحدث في Analytics
    trackEvent('DuasAzkar', 'init', 'Module loaded');
    
    console.log('[DuasAzkar] Initialized successfully');
  },
  
  // ============================================
  // 3. تحميل التفضيلات المحفوظة
  // ============================================
  loadSavedPreferences() {    try {
      this.currentDuaType = Storage.get(Storage.keys.DUA_TYPE, 'deceased');
      this.currentDuaIndex.deceased = Storage.get(Storage.keys.DUA_INDEX_DECEASED, 0);
      this.currentDuaIndex.general = Storage.get(Storage.keys.DUA_INDEX_GENERAL, 0);
      this.currentAzkarType = Storage.get(Storage.keys.AZKAR_TYPE, 'morning');
      
      console.log('[DuasAzkar] Loaded preferences:', {
        duaType: this.currentDuaType,
        duaIndex: this.currentDuaIndex,
        azkarType: this.currentAzkarType
      });
    } catch (error) {
      console.error('[DuasAzkar] Load preferences error:', error);
      // قيم افتراضية
      this.currentDuaType = 'deceased';
      this.currentDuaIndex = { deceased: 0, general: 0 };
      this.currentAzkarType = 'morning';
    }
  },
  
  // ============================================
  // 4. حفظ التفضيلات
  // ============================================
  savePreferences() {
    try {
      Storage.set(Storage.keys.DUA_TYPE, this.currentDuaType);
      Storage.set(Storage.keys.DUA_INDEX_DECEASED, this.currentDuaIndex.deceased);
      Storage.set(Storage.keys.DUA_INDEX_GENERAL, this.currentDuaIndex.general);
      Storage.set(Storage.keys.AZKAR_TYPE, this.currentAzkarType);
      console.log('[DuasAzkar] Preferences saved');
    } catch (error) {
      console.error('[DuasAzkar] Save preferences error:', error);
    }
  },
  
  // ============================================
  // 5. تهيئة واجهة الأدعية
  // ============================================
  initDuas() {
    try {
      const typeBtns = document.querySelectorAll('.dua-type-btn');
      const prevBtn = document.getElementById('prev-dua');
      const nextBtn = document.getElementById('next-dua');
      const copyBtn = document.getElementById('copy-dua');
      const copyHint = document.getElementById('copy-hint');
      
      // تحديث الأزرار النشطة
      this.updateDuaTypeButtons();
      
      // عرض الدعاء الحالي      this.updateDuaDisplay();
      
      // ربط أحداث أزرار نوع الدعاء
      typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.switchDuaType(btn.dataset.type);
        });
      });
      
      // ربط حدث زر السابق
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          this.navigateDua(-1);
        });
      }
      
      // ربط حدث زر التالي
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.navigateDua(1);
        });
      }
      
      // ربط حدث زر النسخ
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          await this.copyDua(copyHint);
        });
      }
      
      console.log('[DuasAzkar] Duas initialized');
    } catch (error) {
      console.error('[DuasAzkar] Init duas error:', error);
    }
  },
  
  // ============================================
  // 6. تحديث أزرار نوع الدعاء
  // ============================================
  updateDuaTypeButtons() {
    try {
      const typeBtns = document.querySelectorAll('.dua-type-btn');
      typeBtns.forEach(btn => {
        if (btn.dataset.type === this.currentDuaType) {
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        }      });
    } catch (error) {
      console.error('[DuasAzkar] Update buttons error:', error);
    }
  },
  
  // ============================================
  // 7. التبديل بين نوعي الدعاء
  // ============================================
  switchDuaType(newType) {
    try {
      if (this.currentDuaType === newType) {
        return;
      }
      
      this.currentDuaType = newType;
      this.savePreferences();
      this.updateDuaTypeButtons();
      this.updateDuaDisplay();
      
      // تتبع الحدث في Analytics
      trackEvent('Duas', 'switch_type', newType);
      
      console.log('[DuasAzkar] Switched to:', newType);
    } catch (error) {
      console.error('[DuasAzkar] Switch type error:', error);
    }
  },// ============================================
  // 8. التنقل بين الأدعية (التالي/السابق)
  // ============================================
  navigateDua(direction) {
    try {
      const duasList = this.currentDuaType === 'deceased' ? duas.deceased : duas.general;
      let index = this.currentDuaIndex[this.currentDuaType];
      
      // التنقل
      index += direction;
      
      // التدوير (Loop)
      if (index < 0) {
        index = duasList.length - 1;
      }
      if (index >= duasList.length) {
        index = 0;
      }
      
      this.currentDuaIndex[this.currentDuaType] = index;
      this.savePreferences();
      this.updateDuaDisplay();
      
      // تتبع الحدث في Analytics
      trackEvent('Duas', 'navigate', this.currentDuaType, index);
      
      console.log('[DuasAzkar] Navigated to:', index);
    } catch (error) {
      console.error('[DuasAzkar] Navigate error:', error);
    }
  },
  
  // ============================================
  // 9. تحديث عرض الدعاء
  // ============================================
  updateDuaDisplay() {
    try {
      const duasList = this.currentDuaType === 'deceased' ? duas.deceased : duas.general;
      const index = this.currentDuaIndex[this.currentDuaType];
      
      const textEl = document.getElementById('dua-text');
      const currentEl = document.getElementById('current-dua-index');
      const totalEl = document.getElementById('dua-total');
      const counterEl = document.getElementById('duaCounter');
      
      // تحديث نص الدعاء
      if (textEl) {
        textEl.textContent = duasList[index];
      }
            // تحديث العداد
      if (currentEl) currentEl.textContent = index + 1;
      if (totalEl) totalEl.textContent = duasList.length;
      if (counterEl) counterEl.textContent = index + 1;
      
      console.log('[DuasAzkar] Display updated:', index + 1, '/', duasList.length);
    } catch (error) {
      console.error('[DuasAzkar] Update display error:', error);
    }
  },
  
  // ============================================
  // 10. نسخ الدعاء
  // ============================================
  async copyDua(hintElement) {
    try {
      const duaText = document.getElementById('dua-text')?.textContent;
      if (!duaText) {
        showToast('❌ لم يتم العثور على نص الدعاء', 2000, 'error');
        return;
      }
      
      // إضافة تذييل للدعاء الخاص بالمتوفى
      const suffix = this.currentDuaType === 'deceased'
        ? '\n\nاللهم اجعل هذا الدعاء صدقة جارية عن روح المرحوم صبري كامل سليم'
        : '';
      
      const fullText = duaText + suffix;
      
      // النسخ إلى الحافظة
      const success = await copyToClipboard(fullText);
      
      if (success) {
        // إظهار رسالة النجاح
        if (hintElement) {
          hintElement.hidden = false;
          setTimeout(() => {
            hintElement.hidden = true;
          }, 2000);
        }
        
        showToast('✅ تم نسخ الدعاء!', 2000, 'success');
        
        // تتبع الحدث في Analytics
        trackEvent('Duas', 'copy', this.currentDuaType);
        
        console.log('[DuasAzkar] Dua copied successfully');
      } else {
        showToast('❌ فشل نسخ الدعاء', 2000, 'error');
        console.error('[DuasAzkar] Copy failed');      }
    } catch (error) {
      console.error('[DuasAzkar] Copy error:', error);
      showToast('❌ حدث خطأ أثناء النسخ', 2000, 'error');
    }
  },
  
  // ============================================
  // 11. تهيئة واجهة الأذكار
  // ============================================
  initAzkar() {
    try {
      const typeBtns = document.querySelectorAll('.azkar-opt');
      
      // تحديث الأزرار النشطة
      this.updateAzkarTypeButtons();
      
      // عرض الأذكار الحالية
      this.renderAzkar();
      
      // ربط أحداث أزرار نوع الذكر
      typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.switchAzkarType(btn.dataset.type);
        });
      });
      
      console.log('[DuasAzkar] Azkar initialized');
    } catch (error) {
      console.error('[DuasAzkar] Init azkar error:', error);
    }
  },
  
  // ============================================
  // 12. تحديث أزرار نوع الذكر
  // ============================================
  updateAzkarTypeButtons() {
    try {
      const typeBtns = document.querySelectorAll('.azkar-opt');
      typeBtns.forEach(btn => {
        if (btn.dataset.type === this.currentAzkarType) {
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        }
      });
    } catch (error) {
      console.error('[DuasAzkar] Update azkar buttons error:', error);    }
  },
  
  // ============================================
  // 13. التبديل بين أذكار الصباح والمساء
  // ============================================
  switchAzkarType(newType) {
    try {
      if (this.currentAzkarType === newType) {
        return;
      }
      
      this.currentAzkarType = newType;
      this.savePreferences();
      this.updateAzkarTypeButtons();
      this.renderAzkar();
      
      // تتبع الحدث في Analytics
      trackEvent('Azkar', 'switch_type', newType);
      
      console.log('[DuasAzkar] Switched azkar to:', newType);
    } catch (error) {
      console.error('[DuasAzkar] Switch azkar type error:', error);
    }
  },
  
  // ============================================
  // 14. عرض الأذكار (Render)
  // ============================================
  renderAzkar() {
    try {
      const listContainer = document.getElementById('azkar-list');
      if (!listContainer) {
        console.log('[DuasAzkar] Azkar list container not found');
        return;
      }
      
      const azkarList = this.currentAzkarType === 'morning' ? azkar.morning : azkar.evening;
      
      // إنشاء HTML للأذكار
      listContainer.innerHTML = azkarList.map((zikr, index) => `
        <div class="zikr-card" data-index="${index}">
          <p class="zikr-text">${zikr.text}</p>
          <span class="zikr-count">${zikr.count}×</span>
        </div>
      `).join('');
      
      // تتبع الحدث في Analytics
      trackEvent('Azkar', 'render', this.currentAzkarType, azkarList.length);
            console.log('[DuasAzkar] Azkar rendered:', azkarList.length, 'items');
    } catch (error) {
      console.error('[DuasAzkar] Render azkar error:', error);
    }
  },
  
  // ============================================
  // 15. الحصول على إحصائيات الأدعية والأذكار
  // ============================================
  getStats() {
    return {
      duaType: this.currentDuaType,
      duaIndex: this.currentDuaIndex,
      azkarType: this.currentAzkarType,
      totalDuasDeceased: duas.deceased.length,
      totalDuasGeneral: duas.general.length,
      totalAzkarMorning: azkar.morning.length,
      totalAzkarEvening: azkar.evening.length
    };
  }
};

// ============================================
// تصدير الكائن للاستخدام في الملفات الأخرى
// ============================================
export default DuasAzkar;

// ============================================
// نهاية ملف DuasAzkar
// ============================================
console.log('[DuasAzkar] Module loaded successfully');