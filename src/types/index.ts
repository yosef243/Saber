export type Language = 'ar' | 'en';
export type Gender = 'm' | 'f';
export type Theme = 'default' | 'blue' | 'brown' | 'dark';
export type DhikrCategory = 'tasbeeh' | 'morning' | 'evening' | 'sleep' | 'after-prayer';
export type DuaCategory = 'deceased' | 'quranic' | 'healing' | 'prayer';

export interface Dhikr {
  id: string;
  text: string;
  defaultCount: number;
  targetCount: number;
  currentCount: number;
  category: DhikrCategory;
}

export interface Dua {
  id: string;
  title: string;
  textMale: string;
  textFemale: string;
  category: DuaCategory;
  source: string;
  sourceUrl: string;
}

export interface MemorialProfile {
  name: string;
  gender: Gender;
  customMessage?: string;
}

export interface AppSettings {
  language: Language;
  theme: Theme;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
