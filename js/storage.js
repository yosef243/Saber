// js/storage.js
export const StorageKeys = Object.freeze({
  VERSION: 'APP_SCHEMA_VERSION',

  SETTINGS: 'SETTINGS_V2',
  FAVORITES: 'FAVORITES_V1',
  MASBAHA_STATE: 'MASBAHA_STATE_V2',
  MASBAHA_SESSIONS: 'MASBAHA_SESSIONS_V1',
  QURAN_PREFS: 'QURAN_PREFS_V1',

  // Deprecated (will be removed by migration)
  DEATH_ANNIVERSARY: 'DEATH_ANNIVERSARY',
  DEATH_DATE: 'deathDate'
});

const SCHEMA_VERSION = 2;

export const Storage = {
  SCHEMA_VERSION,

  getJSON(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getString(key, fallback = '') {
    const v = localStorage.getItem(key);
    return v == null ? fallback : v;
  },

  setString(key, value) {
    localStorage.setItem(key, String(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clearAll() {
    localStorage.clear();
  },

  exportAll() {
    const dump = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      dump[k] = localStorage.getItem(k);
    }
    return {
      __app: 'SABER',
      __schema: SCHEMA_VERSION,
      __ts: new Date().toISOString(),
      data: dump
    };
  },

  importAll(payload) {
    if (!payload || payload.__app !== 'SABER' || typeof payload.data !== 'object') {
      throw new Error('Invalid backup format');
    }
    for (const [k, v] of Object.entries(payload.data)) {
      if (typeof v === 'string') localStorage.setItem(k, v);
    }
  },

  migrateIfNeeded() {
    const current = Number(this.getString(StorageKeys.VERSION, '0')) || 0;
    if (current >= SCHEMA_VERSION) return;

    // Migration v1 -> v2: remove death anniversary keys + normalize settings
    if (current < 2) {
      this.remove(StorageKeys.DEATH_ANNIVERSARY);
      this.remove(StorageKeys.DEATH_DATE);

      // settings -> SETTINGS_V2
      const old = this.getJSON('SETTINGS', null);
      if (old && !localStorage.getItem(StorageKeys.SETTINGS)) {
        const migrated = {
          theme: old.theme ?? 'system',
          fontScale: old.fontSize === 'small' ? 14 : old.fontSize === 'large' ? 20 : 16,
          khushu: Boolean(old.khushu),
          sound: Boolean(old.sound ?? true),
          vibrate: Boolean(old.vibrate ?? true),
          analyticsOptIn: Boolean(old.analyticsOptIn ?? false)
        };
        this.setJSON(StorageKeys.SETTINGS, migrated);
      }
      localStorage.removeItem('SETTINGS');
    }

    this.setString(StorageKeys.VERSION, String(SCHEMA_VERSION));
  }
};