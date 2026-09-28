import type { AppSettings, Theme } from '../types';

const SETTINGS_KEY = 'saber.v2.settings';
const TASBEEH_KEY = 'saber.v2.tasbeeh';

export const defaultSettings: AppSettings = {
  language: 'ar',
  theme: 'default',
  soundEnabled: true,
  vibrationEnabled: true
};

function read<T>(key: string): unknown {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The app remains usable when browser storage is unavailable.
  }
}

export function loadSettings(): AppSettings {
  const saved = read<AppSettings>(SETTINGS_KEY);
  if (!saved || typeof saved !== 'object') return { ...defaultSettings };
  const input = saved as Partial<AppSettings>;
  const themes: Theme[] = ['default', 'blue', 'brown', 'dark'];
  return {
    language: input.language === 'en' ? 'en' : 'ar',
    theme: themes.includes(input.theme as Theme) ? input.theme as Theme : 'default',
    soundEnabled: typeof input.soundEnabled === 'boolean' ? input.soundEnabled : true,
    vibrationEnabled: typeof input.vibrationEnabled === 'boolean' ? input.vibrationEnabled : true
  };
}

export function saveSettings(settings: AppSettings): void {
  write(SETTINGS_KEY, settings);
}

export interface TasbeehProgress {
  activeId: string;
  currentCount: number;
  totalCount: number;
  customTargets: Record<string, number>;
  openEnded: boolean;
}

export function loadTasbeehProgress(): TasbeehProgress {
  const saved = read<TasbeehProgress>(TASBEEH_KEY);
  if (!saved || typeof saved !== 'object') return emptyTasbeehProgress();
  const input = saved as Partial<TasbeehProgress>;
  const customTargets: Record<string, number> = {};
  if (input.customTargets && typeof input.customTargets === 'object') {
    for (const [id, target] of Object.entries(input.customTargets)) {
      if (Number.isInteger(target) && target >= 1 && target <= 9999) customTargets[id] = target;
    }
  }
  return {
    activeId: typeof input.activeId === 'string' ? input.activeId : '',
    currentCount: Number.isSafeInteger(input.currentCount) && (input.currentCount ?? 0) >= 0 ? input.currentCount! : 0,
    totalCount: Number.isSafeInteger(input.totalCount) && (input.totalCount ?? 0) >= 0 ? input.totalCount! : 0,
    customTargets,
    openEnded: input.openEnded === true
  };
}

export function emptyTasbeehProgress(): TasbeehProgress {
  return { activeId: '', currentCount: 0, totalCount: 0, customTargets: {}, openEnded: false };
}

export function saveTasbeehProgress(progress: TasbeehProgress): void {
  write(TASBEEH_KEY, progress);
}
