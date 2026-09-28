import type { Dua, DuaCategory, Gender, MemorialProfile } from '../types';

export interface DuaEntry extends Dua {
  titleEn: string;
  translationEn: string;
  usageNoteAr?: string;
  usageNoteEn?: string;
}

export const duaCategories: { id: DuaCategory; ar: string; en: string }[] = [
  { id: 'deceased', ar: 'أدعية للمتوفى', en: 'For the deceased' },
  { id: 'quranic', ar: 'أدعية من القرآن الكريم', en: 'From the Quran' },
  { id: 'healing', ar: 'أدعية الشفاء وتفريج الكرب', en: 'Healing and relief' },
  { id: 'prayer', ar: 'أدعية الصلاة وجوامع الدعاء', en: 'Prayer and general' }
];

// Quranic text follows the quran-uthmani edition. The source links identify the exact verses.
// Personalized funeral prayers adapt the cited wording by replacing the unnamed deceased with a name.
export const duas: DuaEntry[] = [
  {
    id: 'funeral-forgiveness', category: 'deceased', title: 'دعاء المغفرة والرحمة', titleEn: 'Forgiveness and mercy',
    textMale: 'اللَّهُمَّ اغْفِرْ لِ{الاسم} وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ.',
    textFemale: 'اللَّهُمَّ اغْفِرْ لِ{الاسم} وَارْحَمْهَا، وَعَافِهَا وَاعْفُ عَنْهَا، وَأَكْرِمْ نُزُلَهَا، وَوَسِّعْ مُدْخَلَهَا.',
    translationEn: 'O Allah, forgive and have mercy on the deceased, grant pardon and a generous welcome.',
    source: 'بتصرّف من صحيح مسلم 963', sourceUrl: 'https://sunnah.com/muslim/11/109'
  },
  {
    id: 'funeral-home', category: 'deceased', title: 'خيرٌ من الدار والأهل', titleEn: 'A better home',
    textMale: 'اللَّهُمَّ أَبْدِلْ {الاسم} دَارًا خَيْرًا مِنْ دَارِهِ، وَأَهْلًا خَيْرًا مِنْ أَهْلِهِ، وَأَدْخِلْهُ الْجَنَّةَ، وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ.',
    textFemale: 'اللَّهُمَّ أَبْدِلْ {الاسم} دَارًا خَيْرًا مِنْ دَارِهَا، وَأَهْلًا خَيْرًا مِنْ أَهْلِهَا، وَأَدْخِلْهَا الْجَنَّةَ، وَأَعِذْهَا مِنْ عَذَابِ الْقَبْرِ.',
    translationEn: 'O Allah, grant the deceased a better home and family, admit them to Paradise, and protect them from the grave.',
    source: 'بتصرّف من صحيح مسلم 963', sourceUrl: 'https://sunnah.com/muslim/11/109'
  },
  {
    id: 'quran-world-hereafter', category: 'quranic', title: 'خير الدنيا والآخرة', titleEn: 'Good in both worlds',
    textMale: 'رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةًۭ وَفِى ٱلْءَاخِرَةِ حَسَنَةًۭ وَقِنَا عَذَابَ ٱلنَّارِ',
    textFemale: 'رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةًۭ وَفِى ٱلْءَاخِرَةِ حَسَنَةًۭ وَقِنَا عَذَابَ ٱلنَّارِ',
    translationEn: 'Our Lord, grant us good in this world and the Hereafter, and protect us from the Fire.',
    source: 'القرآن الكريم 2:201 (مقطع دعاء)', sourceUrl: 'https://quran.com/2/201'
  },
  {
    id: 'quran-hearts', category: 'quranic', title: 'ثبات القلب', titleEn: 'Steadfast hearts',
    textMale: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ ٱلْوَهَّابُ',
    textFemale: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ ٱلْوَهَّابُ',
    translationEn: 'Our Lord, keep our hearts firm after guiding us and grant us mercy.',
    source: 'القرآن الكريم 3:8', sourceUrl: 'https://quran.com/3/8'
  },
  {
    id: 'quran-parents', category: 'quranic', title: 'للوالدين والمؤمنين', titleEn: 'For parents and believers',
    textMale: 'رَبَّنَا ٱغْفِرْ لِى وَلِوَٰلِدَىَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ ٱلْحِسَابُ',
    textFemale: 'رَبَّنَا ٱغْفِرْ لِى وَلِوَٰلِدَىَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ ٱلْحِسَابُ',
    translationEn: 'Our Lord, forgive me, my parents, and the believers on the Day of Reckoning.',
    source: 'القرآن الكريم 14:41', sourceUrl: 'https://quran.com/14/41'
  },
  {
    id: 'quran-mercy', category: 'quranic', title: 'المغفرة والرحمة', titleEn: 'Forgiveness and mercy',
    textMale: 'وَقُل رَّبِّ ٱغْفِرْ وَٱرْحَمْ وَأَنتَ خَيْرُ ٱلرَّٰحِمِينَ',
    textFemale: 'وَقُل رَّبِّ ٱغْفِرْ وَٱرْحَمْ وَأَنتَ خَيْرُ ٱلرَّٰحِمِينَ',
    translationEn: 'My Lord, forgive and have mercy; You are the best of those who show mercy.',
    source: 'القرآن الكريم 23:118', sourceUrl: 'https://quran.com/23/118'
  },
  {
    id: 'healing-illness', category: 'healing', title: 'دعاء الشفاء', titleEn: 'Prayer for healing',
    textMale: 'أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ وَاشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا.',
    textFemale: 'أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ وَاشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا.',
    translationEn: 'O Lord of mankind, remove harm and grant a healing that leaves no illness.',
    source: 'صحيح مسلم 2191a', sourceUrl: 'https://sunnah.com/muslim:2191a'
  },
  {
    id: 'healing-anxiety', category: 'healing', title: 'من الهم والحزن', titleEn: 'For anxiety and sorrow',
    textMale: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ.',
    textFemale: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ.',
    translationEn: 'O Allah, I seek refuge from anxiety, sorrow, weakness, idleness, debt, and oppression.',
    source: 'صحيح البخاري، كتاب الدعوات', sourceUrl: 'https://sunnah.com/bukhari/80'
  },
  {
    id: 'prayer-sujood', category: 'prayer', title: 'دعاء السجود', titleEn: 'In prostration',
    textMale: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ.',
    textFemale: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ.',
    translationEn: 'O Allah, forgive all my sins, small and great, first and last, open and hidden.',
    source: 'صحيح مسلم، كتاب الصلاة', sourceUrl: 'https://sunnah.com/muslim/4'
  },
  {
    id: 'prayer-istikharah', category: 'prayer', title: 'دعاء الاستخارة', titleEn: 'Istikharah',
    textMale: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّهُ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ.',
    textFemale: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّهُ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ.',
    translationEn: 'After two voluntary rakahs, ask Allah to guide your choice and grant what is best.',
    usageNoteAr: 'بعد ركعتين غير الفريضة، سمِّ حاجتك عند قول: «هذا الأمر».',
    usageNoteEn: 'After two voluntary rakahs, name your decision where the prayer says “this matter.”',
    source: 'دعاء الاستخارة، حصن المسلم 74', sourceUrl: 'https://sunnah.com/hisn/74'
  },
  {
    id: 'prayer-guidance', category: 'prayer', title: 'جوامع الدعاء', titleEn: 'Guidance and purity',
    textMale: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى.',
    textFemale: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى.',
    translationEn: 'O Allah, I ask You for guidance, piety, chastity, and contentment.',
    source: 'صحيح مسلم 2721a', sourceUrl: 'https://sunnah.com/muslim:2721a'
  }
];

export function resolveDuaText(dua: DuaEntry, profile: MemorialProfile | null): string {
  const gender: Gender = profile?.gender ?? 'm';
  const fallback = dua.id === 'funeral-home'
    ? (gender === 'f' ? 'أَمَتَكَ' : 'عَبْدَكَ')
    : (gender === 'f' ? 'أَمَتِكَ' : 'عَبْدِكَ');
  const name = profile?.name ?? fallback;
  return (gender === 'f' ? dua.textFemale : dua.textMale).replaceAll('{الاسم}', name);
}
