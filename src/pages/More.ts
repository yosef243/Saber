import { allahNames } from '../data/names';
import { islamicStories } from '../data/stories';
import { dailyTasks } from '../data/tasks';
import { getDailyProgress, setTaskCompleted } from '../utils/dailyTracker';
import { t } from '../utils/i18n';
import type { PageContext } from './types';

type Section = 'habits' | 'names' | 'stories';

export function renderMore({ settings }: PageContext): HTMLElement {
  const language = settings.language;
  const page = document.createElement('section');
  page.className = 'page card more-page';
  const title = document.createElement('h2');
  title.textContent = t(language, 'more');
  const tabs = document.createElement('div');
  tabs.className = 'content-tabs';
  tabs.setAttribute('role', 'tablist');
  const panel = document.createElement('div');
  panel.setAttribute('role', 'tabpanel');
  panel.id = 'more-panel';
  const sections: Section[] = ['habits', 'names', 'stories'];
  const buttons = sections.map((section) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    button.textContent = t(language, section);
    button.addEventListener('click', () => show(section));
    tabs.append(button);
    return button;
  });

  function show(section: Section): void {
    buttons.forEach((button, index) => {
      button.setAttribute('aria-selected', String(sections[index] === section));
      button.tabIndex = sections[index] === section ? 0 : -1;
    });
    panel.replaceChildren(section === 'habits' ? renderHabits() : section === 'names' ? renderNames() : renderStories());
  }

  function renderHabits(): HTMLElement {
    const wrapper = document.createElement('div');
    const count = document.createElement('p');
    count.className = 'habit-progress';
    const list = document.createElement('div');
    list.className = 'habit-list';
    const checkboxes = new Map<string, HTMLInputElement>();
    const refresh = () => {
      const current = getDailyProgress();
      count.textContent = `${t(language, 'completedToday')}: ${current.size} / ${dailyTasks.length}`;
      checkboxes.forEach((checkbox, id) => { checkbox.checked = current.has(id); });
    };
    dailyTasks.forEach((task) => {
      const label = document.createElement('label');
      label.className = 'habit-item';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = task.id;
      checkbox.addEventListener('change', () => { setTaskCompleted(task.id, checkbox.checked); refresh(); });
      const name = document.createElement('span');
      name.textContent = language === 'ar' ? task.labelAr : task.labelEn;
      label.append(checkbox, name);
      list.append(label);
      checkboxes.set(task.id, checkbox);
    });
    wrapper.append(count, list);
    refresh();
    // Returning to a tab after midnight reads the new local day.
    document.addEventListener('visibilitychange', () => { if (!document.hidden && wrapper.isConnected) refresh(); }, { signal: pageAbort.signal });
    const timer = window.setInterval(() => {
      if (wrapper.isConnected) refresh();
      else window.clearInterval(timer);
    }, 60000);
    return wrapper;
  }

  function renderNames(): HTMLElement {
    const grid = document.createElement('div');
    grid.className = 'names-grid';
    allahNames.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'name-card';
      const number = document.createElement('span');
      number.className = 'name-number';
      number.textContent = String(item.id);
      const name = document.createElement('h3');
      name.lang = 'ar';
      name.dir = 'rtl';
      name.textContent = item.nameAr;
      const meaning = document.createElement('p');
      meaning.textContent = language === 'ar' ? item.descriptionAr : `${item.transliteration} · ${item.meaningEn}`;
      card.append(number, name, meaning);
      grid.append(card);
    });
    return grid;
  }

  function renderStories(): HTMLElement {
    const list = document.createElement('div');
    list.className = 'stories-list';
    islamicStories.forEach((story) => {
      const card = document.createElement('details');
      card.className = 'story-card';
      const summary = document.createElement('summary');
      summary.textContent = `${story.id}. ${language === 'ar' ? story.titleAr : story.titleEn}`;
      const body = document.createElement('p');
      body.textContent = language === 'ar' ? story.contentAr : story.contentEn;
      card.append(summary, body);
      list.append(card);
    });
    return list;
  }

  const pageAbort = new AbortController();
  // Event handlers on detached pages become inert; abort the visibility listener on navigation.
  const observer = new MutationObserver(() => {
    if (!page.isConnected) { pageAbort.abort(); observer.disconnect(); }
  });
  queueMicrotask(() => { if (page.isConnected) observer.observe(document.querySelector('#app')!, { childList: true }); });
  page.append(title, tabs, panel);
  show('habits');
  return page;
}
