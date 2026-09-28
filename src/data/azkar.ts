import legacyContent from './azkar-content.json';
import type { Dhikr, Language } from '../types';

export type AzkarCategory = 'morning' | 'evening' | 'sleep' | 'after-prayer';
export interface AzkarEntry extends Dhikr {
  source?: string;
  sourceUrl?: string;
}

type LegacyItem = { t: string; c: number };
const content = legacyContent as Record<Language, Record<'morning' | 'evening' | 'sleep', LegacyItem[]>>;

const sources: Record<'morning' | 'evening' | 'sleep', { label: string; url: string }[]> = {
  morning: [
    { label: 'القرآن 2:255', url: 'https://quran.com/2/255' },
    { label: 'القرآن 112–114؛ أبو داود 5082', url: 'https://sunnah.com/abudawud:5082' },
    { label: 'رياض الصالحين 1455', url: 'https://sunnah.com/riyadussalihin:1455' },
    { label: 'رياض الصالحين 1453', url: 'https://sunnah.com/riyadussalihin/15/46' },
    { label: 'صحيح مسلم 2692', url: 'https://sunnah.com/muslim:2692' }
  ],
  evening: [
    { label: 'القرآن 2:255', url: 'https://quran.com/2/255' },
    { label: 'القرآن 112–114؛ أبو داود 5082', url: 'https://sunnah.com/abudawud:5082' },
    { label: 'رياض الصالحين 1455', url: 'https://sunnah.com/riyadussalihin:1455' },
    { label: 'أذكار المساء', url: 'https://sunnah.com/riyadussalihin/15' },
    { label: 'صحيح مسلم 2692', url: 'https://sunnah.com/muslim:2692' }
  ],
  sleep: [
    { label: 'صحيح البخاري 6324', url: 'https://sunnah.com/bukhari/80/21' },
    { label: 'القرآن 2:255؛ صحيح البخاري 2311', url: 'https://sunnah.com/bukhari/40/11' },
    { label: 'القرآن 112–114؛ صحيح البخاري 5017', url: 'https://sunnah.com/bukhari:5017' },
    { label: 'حصن المسلم 102', url: 'https://sunnah.com/hisn:102' }
  ]
};

const afterPrayer: Record<Language, { id: string; text: string; count: number; source: string; sourceUrl: string }[]> = {
  ar: [
    { id: 'istighfar', text: 'أَسْتَغْفِرُ اللَّهَ', count: 3, source: 'صحيح مسلم 591', sourceUrl: 'https://sunnah.com/muslim:591' },
    { id: 'salam', text: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ ذَا الْجَلَالِ وَالْإِكْرَامِ', count: 1, source: 'صحيح مسلم 591', sourceUrl: 'https://sunnah.com/muslim:591' },
    { id: 'subhan', text: 'سُبْحَانَ اللَّهِ', count: 33, source: 'صحيح مسلم 597a', sourceUrl: 'https://sunnah.com/muslim:597a' },
    { id: 'hamd', text: 'الْحَمْدُ لِلَّهِ', count: 33, source: 'صحيح مسلم 597a', sourceUrl: 'https://sunnah.com/muslim:597a' },
    { id: 'takbir', text: 'اللَّهُ أَكْبَرُ', count: 33, source: 'صحيح مسلم 597a', sourceUrl: 'https://sunnah.com/muslim:597a' },
    { id: 'tahlil', text: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', count: 1, source: 'صحيح مسلم 597a', sourceUrl: 'https://sunnah.com/muslim:597a' }
  ],
  en: [
    { id: 'istighfar', text: 'Astaghfirullah — I seek Allah’s forgiveness', count: 3, source: 'Sahih Muslim 591', sourceUrl: 'https://sunnah.com/muslim:591' },
    { id: 'salam', text: 'O Allah, You are Peace and from You comes peace. Blessed are You, Owner of Majesty and Honor.', count: 1, source: 'Sahih Muslim 591', sourceUrl: 'https://sunnah.com/muslim:591' },
    { id: 'subhan', text: 'Subhan Allah — Glory be to Allah', count: 33, source: 'Sahih Muslim 597a', sourceUrl: 'https://sunnah.com/muslim:597a' },
    { id: 'hamd', text: 'Alhamdulillah — Praise be to Allah', count: 33, source: 'Sahih Muslim 597a', sourceUrl: 'https://sunnah.com/muslim:597a' },
    { id: 'takbir', text: 'Allahu Akbar — Allah is Greatest', count: 33, source: 'Sahih Muslim 597a', sourceUrl: 'https://sunnah.com/muslim:597a' },
    { id: 'tahlil', text: 'There is no god but Allah alone, without partner. His is the dominion and all praise, and He has power over all things.', count: 1, source: 'Sahih Muslim 597a', sourceUrl: 'https://sunnah.com/muslim:597a' }
  ]
};

export function getAzkar(language: Language, category: AzkarCategory): AzkarEntry[] {
  if (category === 'after-prayer') return afterPrayer[language].map((item) => ({
    id: `after-prayer-${item.id}`, text: item.text, defaultCount: 0,
    targetCount: item.count, currentCount: 0, category,
    source: item.source, sourceUrl: item.sourceUrl
  }));
  return content[language][category].map((item, index) => ({
    id: `${category}-${index}`, text: item.t, defaultCount: 0,
    targetCount: item.c, currentCount: 0, category,
    source: sources[category][index]?.label, sourceUrl: sources[category][index]?.url
  }));
}
