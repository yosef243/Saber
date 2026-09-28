import { dailyTasks } from '../data/tasks';

const STORAGE_KEY = 'saber.v3.daily-tasks';

interface DailyProgress {
  date: string;
  completed: string[];
}

function localDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function read(): DailyProgress {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as DailyProgress | null;
    if (stored?.date === localDate() && Array.isArray(stored.completed)) {
      const known = new Set(dailyTasks.map((task) => task.id));
      return { date: stored.date, completed: stored.completed.filter((id) => typeof id === 'string' && known.has(id)) };
    }
  } catch { /* Treat unreadable storage as a fresh day. */ }
  return { date: localDate(), completed: [] };
}

function write(progress: DailyProgress): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* Remain usable without storage. */ }
}

export function getDailyProgress(): Set<string> {
  return new Set(read().completed);
}

export function setTaskCompleted(id: string, completed: boolean): Set<string> {
  const current = getDailyProgress();
  if (completed) current.add(id);
  else current.delete(id);
  write({ date: localDate(), completed: [...current] });
  return current;
}
