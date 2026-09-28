import rawIndex from '../data/surahs.json';

export interface SurahMetadata {
  number: number;
  name: string;
  englishName: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
}

export interface QuranAyah {
  numberInSurah: number;
  text: string;
}

export interface QuranSurah extends SurahMetadata {
  ayahs: QuranAyah[];
}

export interface QuranBookmark { surah: number; ayah: number }
export interface ReaderPreferences { fontSize: number; nightMode: boolean }

export const surahIndex: SurahMetadata[] = rawIndex as SurahMetadata[];
const DB_NAME = 'saber-quran-v1';
const STORE = 'surahs';
const BOOKMARK_KEY = 'saber.v2.quran.bookmark';
const READER_KEY = 'saber.v2.quran.reader';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB unavailable'));
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readCache(number: number): Promise<QuranSurah | null> {
  try {
    const db = await openDb();
    return await new Promise((resolve) => {
      const transaction = db.transaction(STORE, 'readonly');
      const request = transaction.objectStore(STORE).get(number);
      request.onsuccess = () => { resolve(request.result as QuranSurah | null); db.close(); };
      request.onerror = () => { resolve(null); db.close(); };
    });
  } catch {
    try {
      const value = localStorage.getItem(`${DB_NAME}.${number}`);
      return value ? JSON.parse(value) as QuranSurah : null;
    } catch { return null; }
  }
}

async function writeCache(surah: QuranSurah): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve) => {
      const transaction = db.transaction(STORE, 'readwrite');
      transaction.objectStore(STORE).put(surah, surah.number);
      transaction.oncomplete = () => { resolve(); db.close(); };
      transaction.onerror = () => { resolve(); db.close(); };
    });
  } catch {
    try { localStorage.setItem(`${DB_NAME}.${surah.number}`, JSON.stringify(surah)); } catch { /* Cache is optional. */ }
  }
}

export async function getSurah(number: number): Promise<QuranSurah> {
  const metadata = surahIndex[number - 1];
  if (!metadata || metadata.number !== number) throw new Error('Invalid surah number');
  const cached = await readCache(number);
  if (cached?.ayahs?.length === metadata.numberOfAyahs) return cached;

  const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}/quran-uthmani`, {
    headers: { Accept: 'application/json' }
  });
  if (!response.ok) throw new Error(`Quran API returned ${response.status}`);
  const payload = await response.json() as { code?: number; data?: Partial<QuranSurah> };
  const ayahs = payload.data?.ayahs;
  if (payload.code !== 200 || !Array.isArray(ayahs) || ayahs.length !== metadata.numberOfAyahs ||
      !ayahs.every((ayah, index) => ayah.numberInSurah === index + 1 && typeof ayah.text === 'string' && ayah.text.length > 0)) {
    throw new Error('Incomplete Quran API response');
  }
  const surah: QuranSurah = { ...metadata, ayahs: ayahs.map((ayah) => ({ numberInSurah: ayah.numberInSurah, text: ayah.text })) };
  await writeCache(surah);
  return surah;
}

export function getBookmark(): QuranBookmark | null {
  try {
    const value = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || 'null') as QuranBookmark | null;
    const metadata = value && surahIndex[value.surah - 1];
    return metadata && Number.isInteger(value!.ayah) && value!.ayah >= 1 && value!.ayah <= metadata.numberOfAyahs ? value : null;
  } catch { return null; }
}

export function saveBookmark(bookmark: QuranBookmark): void {
  try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark)); } catch { /* Storage is optional. */ }
}

export function getReaderPreferences(): ReaderPreferences {
  try {
    const value = JSON.parse(localStorage.getItem(READER_KEY) || 'null') as Partial<ReaderPreferences> | null;
    return {
      fontSize: typeof value?.fontSize === 'number' && value.fontSize >= 24 && value.fontSize <= 48 ? value.fontSize : 32,
      nightMode: value?.nightMode === true
    };
  } catch { return { fontSize: 32, nightMode: false }; }
}

export function saveReaderPreferences(value: ReaderPreferences): void {
  try { localStorage.setItem(READER_KEY, JSON.stringify(value)); } catch { /* Storage is optional. */ }
}
