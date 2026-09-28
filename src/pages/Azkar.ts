import { getAzkar, type AzkarCategory } from '../data/azkar';
import { dailyTasks } from '../data/tasks';
import { vibrateTap } from '../utils/haptics';
import { getDailyProgress, setTaskCompleted } from '../utils/dailyTracker';
import { t } from '../utils/i18n';
import type { PageContext } from './types';

const STORAGE_KEY = 'saber.v2.azkar';
const categories: { id: AzkarCategory; ar: string; en: string }[] = [
  { id: 'morning', ar: 'الصباح', en: 'Morning' },
  { id: 'evening', ar: 'المساء', en: 'Evening' },
  { id: 'sleep', ar: 'النوم', en: 'Sleep' },
  { id: 'after-prayer', ar: 'بعد الصلاة', en: 'After prayer' }
];
let selectedCategory: AzkarCategory = 'morning';

interface AzkarProgress { day: string; remaining: Record<string, number> }

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function loadProgress(): AzkarProgress {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as AzkarProgress | null;
    if (saved?.day === today() && saved.remaining && typeof saved.remaining === 'object') {
      return saved;
    }
  } catch { /* Ignore invalid storage. */ }
  return { day: today(), remaining: {} };
}

function saveProgress(value: AzkarProgress): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch { /* Storage is optional. */ }
}

export function renderAzkar(context: PageContext): HTMLElement {
  const language = context.settings.language;
  let progress = loadProgress();
  const page = document.createElement('section');
  page.className = 'page card';
  const heading = document.createElement('h2');
  heading.textContent = language === 'ar' ? 'الأذكار' : 'Azkar';
  const routine = document.createElement('section');
  routine.className = 'daily-routine';
  const routineHeading = document.createElement('h3');
  routineHeading.textContent = t(language, 'habits');
  const routineProgress = document.createElement('p');
  routineProgress.className = 'habit-progress';
  routineProgress.setAttribute('role', 'status');
  const routineList = document.createElement('div');
  routineList.className = 'habit-list';
  const routineChecks = new Map<string, HTMLInputElement>();
  const refreshRoutine = (): void => {
    const complete = getDailyProgress();
    routineProgress.textContent = `${t(language, 'completedToday')}: ${complete.size} / ${dailyTasks.length}`;
    routineChecks.forEach((checkbox, id) => { checkbox.checked = complete.has(id); });
  };
  for (const task of dailyTasks) {
    const label = document.createElement('label');
    label.className = 'habit-item';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
      setTaskCompleted(task.id, checkbox.checked);
      refreshRoutine();
    });
    const text = document.createElement('span');
    text.textContent = language === 'ar' ? task.labelAr : task.labelEn;
    label.append(checkbox, text);
    routineList.append(label);
    routineChecks.set(task.id, checkbox);
  }
  routine.append(routineHeading, routineProgress, routineList);
  const tabs = document.createElement('div');
  tabs.className = 'content-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', heading.textContent);
  const toolbar = document.createElement('div');
  toolbar.className = 'azkar-toolbar';
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'text-button';
  reset.textContent = language === 'ar' ? 'ابدأ ورداً جديداً' : 'Start a new session';
  reset.addEventListener('click', () => {
    for (const item of getAzkar(language, selectedCategory)) delete progress.remaining[item.id];
    saveProgress(progress);
    draw();
  });
  toolbar.append(reset);
  const list = document.createElement('div');
  list.id = 'azkar-list';
  list.className = 'azkar-list';
  list.setAttribute('role', 'tabpanel');

  function draw(): void {
    if (progress.day !== today()) progress = { day: today(), remaining: {} };
    for (const button of tabs.querySelectorAll<HTMLButtonElement>('button')) {
      const selected = button.dataset.category === selectedCategory;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
    list.replaceChildren();
    for (const item of getAzkar(language, selectedCategory)) {
      const raw = progress.remaining[item.id];
      const remaining = Number.isInteger(raw) && raw >= 0 && raw <= item.targetCount ? raw : item.targetCount;
      const card = document.createElement('article');
      card.className = `azkar-card${remaining === 0 ? ' is-complete' : ''}`;
      const text = document.createElement('p');
      text.className = 'azkar-text';
      text.lang = language;
      text.dir = language === 'ar' ? 'rtl' : 'ltr';
      text.textContent = item.text;
      card.append(text);
      if (item.sourceUrl) {
        const source = document.createElement('a');
        source.className = 'dua-source';
        source.href = item.sourceUrl;
        source.target = '_blank';
        source.rel = 'noopener noreferrer';
        source.textContent = item.source || '';
        card.append(source);
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'azkar-count';
      button.disabled = remaining === 0;
      button.textContent = remaining === 0
        ? (language === 'ar' ? '✓ مكتمل' : '✓ Complete')
        : (language === 'ar' ? `المتبقي: ${remaining}` : `${remaining} remaining`);
      button.addEventListener('click', () => {
        if (progress.day !== today()) progress = { day: today(), remaining: {} };
        const current = progress.remaining[item.id] ?? item.targetCount;
        const next = Math.max(0, current - 1);
        progress.remaining[item.id] = next;
        saveProgress(progress);
        if (context.settings.vibrationEnabled) vibrateTap();
        button.disabled = next === 0;
        button.textContent = next === 0
          ? (language === 'ar' ? '✓ مكتمل' : '✓ Complete')
          : (language === 'ar' ? `المتبقي: ${next}` : `${next} remaining`);
        card.classList.toggle('is-complete', next === 0);
      });
      card.append(button);
      list.append(card);
    }
  }

  for (const category of categories) {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', list.id);
    button.dataset.category = category.id;
    button.textContent = language === 'ar' ? category.ar : category.en;
    button.addEventListener('click', () => { selectedCategory = category.id; draw(); });
    tabs.append(button);
  }
  tabs.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = categories.findIndex((item) => item.id === selectedCategory);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? categories.length - 1
      : (index + (event.key === 'ArrowRight' ? 1 : -1) + categories.length) % categories.length;
    selectedCategory = categories[next].id;
    draw();
    tabs.querySelectorAll<HTMLButtonElement>('button')[next].focus();
  });
  page.append(heading, routine, tabs, toolbar, list);
  refreshRoutine();
  draw();
  const timer = window.setInterval(() => {
    if (page.isConnected) refreshRoutine();
    else window.clearInterval(timer);
  }, 60000);
  const visibilityController = new AbortController();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && page.isConnected) refreshRoutine();
  }, { signal: visibilityController.signal });
  const pageObserver = new MutationObserver(() => {
    if (!page.isConnected) {
      visibilityController.abort();
      pageObserver.disconnect();
    }
  });
  queueMicrotask(() => {
    if (page.isConnected) pageObserver.observe(document.querySelector('#app')!, { childList: true });
    else visibilityController.abort();
  });
  return page;
}
