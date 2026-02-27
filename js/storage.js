// ============================================
// صدقة جارية - المرحوم صبري كامل سليم
// Storage Module - الإصدار 2.1.0
// إدارة LocalStorage للتطبيق
// ============================================

const Storage = {
  // بادئة المفاتيح لتجنب التعارض
  PREFIX: 'sabry_memorial_',
  
  // إصدار هيكل البيانات (للتحديثات المستقبلية)
  VERSION: '2.1.0',
  
  // ============================================
  // حفظ قيمة في LocalStorage
  // ============================================
  set(key, value) {
    try {
      const fullKey = this.PREFIX + key;
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(fullKey, jsonValue);
      console.log('[Storage] Saved:', key, '=', value);
      return true;
    } catch (error) {
      console.error('[Storage] Save error:', error);
      return false;
    }
  },
  
  // ============================================
  // قراءة قيمة من LocalStorage
  // ============================================
  get(key, defaultValue = null) {
    try {
      const fullKey = this.PREFIX + key;
      const item = localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('[Storage] Get error:', error);
      return defaultValue;
    }
  },
  
  // ============================================
  // حذف قيمة من LocalStorage
  // ============================================
  remove(key) {
    try {
      const fullKey = this.PREFIX + key;
      localStorage.removeItem(fullKey);      console.log('[Storage] Removed:', key);
      return true;
    } catch (error) {
      console.error('[Storage] Remove error:', error);
      return false;
    }
  },
  
  // ============================================
  // مسح جميع بيانات التطبيق
  // ============================================
  clearAll() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      console.log('[Storage] All data cleared');
      return true;
    } catch (error) {
      console.error('[Storage] Clear error:', error);
      return false;
    }
  },
  
  // ============================================
  // التحقق من وجود مفتاح
  // ============================================
  has(key) {
    const fullKey = this.PREFIX + key;
    return localStorage.getItem(fullKey) !== null;
  },
  
  // ============================================
  // الحصول على جميع مفاتيح التطبيق
  // ============================================
  getAllKeys() {
    const keys = Object.keys(localStorage);
    return keys.filter(key => key.startsWith(this.PREFIX));
  },
  
  // ============================================
  // نسخ احتياطي للبيانات (Export)
  // ============================================
  exportData() {
    try {
      const data = {};
      const keys = this.getAllKeys();      keys.forEach(key => {
        const shortKey = key.replace(this.PREFIX, '');
        data[shortKey] = this.get(shortKey);
      });
      data.exportDate = new Date().toISOString();
      data.version = this.VERSION;
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('[Storage] Export error:', error);
      return null;
    }
  },
  
  // ============================================
  // استعادة بيانات من نسخة احتياطية (Import)
  // ============================================
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      Object.keys(data).forEach(key => {
        if (key !== 'exportDate' && key !== 'version') {
          this.set(key, data[key]);
        }
      });
      console.log('[Storage] Data imported successfully');
      return true;
    } catch (error) {
      console.error('[Storage] Import error:', error);
      return false;
    }
  },
  
  // ============================================
  // مفاتيح التخزين المعروفة
  // ============================================
  keys: {
    // المسبحة
    COUNTER: 'counter',
    TOTAL_COUNT: 'total_count',
    CYCLE: 'cycle',
    CURRENT_DHIKR: 'current_dhikr',
    
    // الأدعية
    DUA_TYPE: 'dua_type',
    DUA_INDEX_DECEASED: 'dua_index_deceased',
    DUA_INDEX_GENERAL: 'dua_index_general',
    
    // الأذكار
    AZKAR_TYPE: 'azkar_type',
        // الإعدادات
    THEME: 'theme',
    FONT_SIZE: 'font_size',
    SOUND: 'sound',
    BG_PATTERN: 'bg_pattern',
    ANNIVERSARY: 'anniversary',
    
    // التطبيق
    ONBOARDED: 'onboarded',
    VISITOR_COUNT: 'visitor_count',
    LAST_VERSION: 'last_version'
  }
};

// ============================================
// تصدير الكائن للاستخدام في الملفات الأخرى
// ============================================
export default Storage;