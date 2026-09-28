import type { Dhikr, Language } from '../types';

// Small starter set for Phase 1. The full legacy content is migrated later.
const starterText = [
  { id: 'subhan-allah', ar: 'سُبْحَانَ اللَّهِ', en: 'Subhan Allah' },
  { id: 'alhamdulillah', ar: 'الْحَمْدُ لِلَّهِ', en: 'Alhamdulillah' },
  { id: 'la-ilaha-illallah', ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ', en: 'La ilaha illallah' },
  { id: 'allahu-akbar', ar: 'اللَّهُ أَكْبَرُ', en: 'Allahu Akbar' },
  { id: 'la-hawla', ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', en: 'La hawla wa la quwwata illa billah' }
] as const;

export function getStarterDhikr(language: Language): Dhikr[] {
  return starterText.map((item) => ({
    id: item.id,
    text: item[language],
    defaultCount: 0,
    targetCount: 33,
    currentCount: 0,
    category: 'tasbeeh'
  }));
}
