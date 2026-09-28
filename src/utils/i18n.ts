import type { Language } from '../types';

const messages = {
  ar: {
    home: 'السبحة', azkar: 'الأذكار', duas: 'الأدعية', quran: 'القرآن الكريم',
    create: 'أنشئ صدقة جارية', target: 'الهدف', total: 'المجموع',
    tap: 'اضغط للتسبيح', next: 'الذكر التالي', reset: 'تصفير',
    sound: 'الصوت', vibration: 'الاهتزاز',
    names: 'أسماء الله الحسنى', habits: 'الورد اليومي',
    completedToday: 'المهام المكتملة اليوم', nameMeaning: 'المعنى',
    createPreview: 'معاينة الصدقة الجارية', previewPrayer: 'معاينة الدعاء',
    copyLink: 'نسخ الرابط', shareWhatsApp: 'شارك عبر واتساب',
    copied: 'تم نسخ الرابط', copyFailed: 'تعذر النسخ؛ حدّد الرابط وانسخه',
    openLink: 'افتح الرابط', generatedLink: 'الرابط المخصص'
  },
  en: {
    home: 'Tasbeeh', azkar: 'Azkar', duas: 'Duas', quran: 'Quran',
    create: 'Create Memorial', target: 'Target', total: 'Total',
    tap: 'Tap to count', next: 'Next dhikr', reset: 'Reset',
    sound: 'Sound', vibration: 'Vibration',
    names: '99 Names of Allah', habits: 'Daily habits',
    completedToday: 'Tasks completed today', nameMeaning: 'Meaning',
    createPreview: 'Memorial preview', previewPrayer: 'Prayer preview',
    copyLink: 'Copy link', shareWhatsApp: 'Share via WhatsApp',
    copied: 'Link copied', copyFailed: 'Copy failed; select and copy the link',
    openLink: 'Open link', generatedLink: 'Personal link'
  }
} as const;

export type MessageKey = keyof typeof messages.ar;

export function t(language: Language, key: MessageKey): string {
  return messages[language][key];
}
