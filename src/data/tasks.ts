import content from './tasks-content.json';
import type { Language } from '../types';

const tasks = content as Record<Language, string[]>;

export interface DailyTask {
  id: string;
  labelAr: string;
  labelEn: string;
}

export const dailyTasks: DailyTask[] = tasks.ar.map((labelAr, index) => ({
  id: `daily-${index + 1}`,
  labelAr,
  labelEn: tasks.en[index]
}));
