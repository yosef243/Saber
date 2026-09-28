import type { Gender, MemorialProfile } from '../types';

const STORAGE_KEY = 'saber.v2.memorial';
export const DEFAULT_MEMORIAL: MemorialProfile = {
  name: 'صبري كامل سليم',
  gender: 'm',
  customMessage: 'اللهم اغفر له وارحمه واجعل قبره روضة من رياض الجنة'
};
let active: MemorialProfile | null = null;

function normalizeName(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/^(?:المرحوم(?:ة)?|المغفور له(?:ا)?)\s*[:：-]?\s*/u, '').trim().slice(0, 120);
}

function normalizeGender(value: unknown): Gender {
  return value === 'f' ? 'f' : 'm';
}

function fromParams(): MemorialProfile | null {
  const query = new URLSearchParams(location.search);
  const hashQuery = location.hash.includes('?') ? location.hash.slice(location.hash.indexOf('?') + 1) : '';
  const hash = new URLSearchParams(hashQuery);
  const rawName = query.get('name') ?? hash.get('name');
  const name = normalizeName(rawName);
  if (!name) return null;
  const gender = normalizeGender(query.get('g') ?? hash.get('g'));
  const customMessage = (query.get('message') ?? hash.get('message') ?? '').trim().slice(0, 500);
  return { name, gender, ...(customMessage ? { customMessage } : {}) };
}

export function setMemorial(profile: MemorialProfile | null): void {
  const name = normalizeName(profile?.name);
  active = name ? {
    name,
    gender: normalizeGender(profile?.gender),
    ...(profile?.customMessage ? { customMessage: profile.customMessage.trim().slice(0, 500) } : {})
  } : null;
  try {
    if (active) localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Memorial display still works for this visit if storage is unavailable.
  }
}

export function initializeMemorial(): MemorialProfile | null {
  const linked = fromParams();
  if (linked) {
    setMemorial(linked);
    return active;
  }
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as Partial<MemorialProfile> | null;
    if (stored && normalizeName(stored.name)) {
      setMemorial({ name: stored.name!, gender: normalizeGender(stored.gender), customMessage: stored.customMessage });
      return active;
    }
  } catch {
    // Fall through to the app's default memorial profile.
  }
  setMemorial(DEFAULT_MEMORIAL);
  return active;
}

export function getMemorial(): MemorialProfile | null {
  return active;
}
