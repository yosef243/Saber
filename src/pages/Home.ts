import { renderCounter } from '../components/Counter';
import { dailyTasks } from '../data/tasks';
import { getDailyProgress, setTaskCompleted } from '../utils/dailyTracker';
import { t } from '../utils/i18n';
import type { PageContext } from './types';

export function renderHome(context: PageContext): HTMLElement {
  const page = document.createElement('div');
  page.className = 'page home-dashboard';
  const counter = renderCounter(context.settings, context.onSettingsChange);
  const sidebar = document.createElement('aside');
  sidebar.className = 'home-sidebar';
  const habits = document.createElement('section');
  habits.className = 'card daily-card';
  const heading = document.createElement('h2');
  heading.textContent = t(context.settings.language, 'habits');
  const progress = document.createElement('p');
  progress.className = 'habit-progress';
  progress.setAttribute('role', 'status');
  const list = document.createElement('div');
  list.className = 'habit-list';
  const checkboxes = new Map<string, HTMLInputElement>();
  const refresh = (): void => {
    const completed = getDailyProgress();
    progress.textContent = `${t(context.settings.language, 'completedToday')}: ${completed.size} / ${dailyTasks.length}`;
    checkboxes.forEach((checkbox, id) => { checkbox.checked = completed.has(id); });
  };
  for (const task of dailyTasks) {
    const label = document.createElement('label');
    label.className = 'habit-item';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
      setTaskCompleted(task.id, checkbox.checked);
      refresh();
    });
    const text = document.createElement('span');
    text.textContent = context.settings.language === 'ar' ? task.labelAr : task.labelEn;
    label.append(checkbox, text);
    list.append(label);
    checkboxes.set(task.id, checkbox);
  }
  habits.append(heading, progress, list);
  const dedication = document.createElement('section');
  dedication.className = 'card dedication-card';
  const dedicationTitle = document.createElement('h2');
  dedicationTitle.textContent = context.settings.language === 'ar' ? 'إهداء الأجر' : 'Dedicate the reward';
  const dedicationText = document.createElement('p');
  dedicationText.textContent = context.settings.language === 'ar'
    ? `اجعل وردك اليوم صدقة جارية عن ${context.profile?.name || 'موتى المسلمين'}.`
    : `Dedicate today's worship to ${context.profile?.name || 'our departed loved ones'}.`;
  const namesLink = document.createElement('a');
  namesLink.className = 'home-names-link';
  namesLink.href = '#/names';
  namesLink.textContent = t(context.settings.language, 'names');
  dedication.append(dedicationTitle, dedicationText, namesLink);
  sidebar.append(habits, dedication);
  page.append(counter, sidebar);
  refresh();
  const timer = window.setInterval(() => {
    if (page.isConnected) refresh();
    else window.clearInterval(timer);
  }, 60000);
  const visibilityController = new AbortController();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && page.isConnected) refresh();
  }, { signal: visibilityController.signal });
  const observer = new MutationObserver(() => {
    if (!page.isConnected) {
      visibilityController.abort();
      observer.disconnect();
    }
  });
  queueMicrotask(() => {
    if (page.isConnected) observer.observe(document.querySelector('#app')!, { childList: true });
    else visibilityController.abort();
  });
  return page;
}
