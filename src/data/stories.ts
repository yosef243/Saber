import content from './stories-content.json';
import type { Language } from '../types';

interface LegacyStory { title: string; content: string }
const stories = content as Record<Language, LegacyStory[]>;

export interface IslamicStory {
  id: number;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
}

export const islamicStories: IslamicStory[] = stories.ar.map((item, index) => ({
  id: index + 1,
  titleAr: item.title,
  titleEn: stories.en[index].title,
  contentAr: item.content,
  contentEn: stories.en[index].content
}));
