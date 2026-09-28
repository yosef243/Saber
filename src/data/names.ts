import content from './names-content.json';
import type { Language } from '../types';

interface LegacyName { name: string; desc: string }
const names = content as Record<Language, LegacyName[]>;

export interface AllahName {
  id: number;
  nameAr: string;
  transliteration: string;
  descriptionAr: string;
  meaningEn: string;
}

export const allahNames: AllahName[] = names.ar.map((item, index) => ({
  id: index + 1,
  nameAr: item.name,
  transliteration: names.en[index].name,
  descriptionAr: item.desc,
  meaningEn: names.en[index].desc
}));
