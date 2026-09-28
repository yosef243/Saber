import { getAzkar, type AzkarCategory } from '../data/azkar';
import { vibrateTap } from '../utils/haptics';
import type { PageContext } from './types';

const STORAGE_KEY = 'saber.v2.azkar';
const categories: { id: AzkarCategory; ar: string; en: string }[] = [
  { id: 'morning', ar: 'أذكار الصباح', en: 'Morning' },
  { id: 'evening', ar: 'أذكار المساء', en: 'Evening' },
  { id: 'sleep', ar: 'أذكار النوم', en: 'Sleep' },
  { id: 'after-prayer', ar: 'بعد الصلاة', en: 'After prayer' }
];
let selectedCategory: AzkarCategory = 'morning';

interface AzkarProgress { day: string; remaining: Record<string, number> }

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadProgress(): AzkarProgress {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as AzkarProgress | null;
    if (saved?.day === today() && saved.remaining && typeof saved.remaining === 'object') return saved;
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
  page.className = 'page azkar-page';

  const tabs = document.createElement('div');
  tabs.className = 'azkar-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', language === 'ar' ? 'أقسام الأذكار' : 'Azkar categories');
  const list = document.createElement('div');
  list.id = 'azkar-list';
  list.className = 'azkar-list';
  list.setAttribute('role', 'tabpanel');
  const completion = document.createElement('aside');
  completion.className = 'azkar-completion';
  completion.tabIndex = -1;
  completion.setAttribute('role', 'status');
  completion.textContent = language === 'ar'
    ? 'هنيئاً لك، أتممت هذا الورد كاملاً 🌿'
    : 'Well done, you completed this remembrance 🌿';

  function remainingFor(id: string, target: number): number {
    const raw = progress.remaining[id];
    return Number.isInteger(raw) && raw >= 0 && raw <= target ? raw : target;
  }

  function updateTabs(): void {
    for (const category of categories) {
      const button = tabs.querySelector<HTMLButtonElement>(`[data-category="${category.id}"]`);
      if (!button) continue;
      const items = getAzkar(language, category.id);
      const completed = items.filter((item) => remainingFor(item.id, item.targetCount) === 0).length;
      button.querySelector<HTMLElement>('.azkar-tab-progress')!.textContent = `${completed}/${items.length}`;
      const selected = category.id === selectedCategory;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
  }

  function updateCompletion(items: ReturnType<typeof getAzkar>): void {
    const allComplete = items.length > 0 && items.every((item) => remainingFor(item.id, item.targetCount) === 0);
    completion.hidden = !allComplete;
  }

  function draw(animate = false): void {
    if (progress.day !== today()) progress = { day: today(), remaining: {} };
    const items = getAzkar(language, selectedCategory);
    updateTabs();
    list.replaceChildren();
    for (const item of items) {
      const remaining = remainingFor(item.id, item.targetCount);
      const card = document.createElement('article');
      card.className = `azkar-card${remaining === 0 ? ' is-complete' : ''}`;
      card.tabIndex = 0;
      card.setAttribute('aria-label', language === 'ar' ? 'اضغط لتقليل العدد' : 'Tap to reduce the count');
      const text = document.createElement('p');
      text.className = 'azkar-text';
      text.lang = language;
      text.dir = language === 'ar' ? 'rtl' : 'ltr';
      text.textContent = item.text;
      card.append(text);
      if (item.sourceUrl) {
        const source = document.createElement('a');
        source.className = 'azkar-source';
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
      const setButtonText = (count: number): void => {
        button.replaceChildren();
        if (count === 0) {
          button.classList.add('is-done');
          button.textContent = language === 'ar' ? '✓ تم' : '✓ Done';
          button.setAttribute('aria-label', language === 'ar' ? 'مكتمل' : 'Complete');
          return;
        }
        button.classList.remove('is-done');
        const value = document.createElement('span');
        value.className = 'azkar-count-value';
        value.textContent = String(count);
        const label = document.createElement('span');
        label.className = 'azkar-count-label';
        label.textContent = language === 'ar' ? 'متبقي' : 'left';
        button.append(value, label);
        button.setAttribute('aria-label', language === 'ar' ? `متبقي ${count}` : `${count} remaining`);
      };
      setButtonText(remaining);

      const decrement = (): void => {
        if (button.disabled) return;
        if (progress.day !== today()) progress = { day: today(), remaining: {} };
        const next = Math.max(0, remainingFor(item.id, item.targetCount) - 1);
        progress.remaining[item.id] = next;
        saveProgress(progress);
        if (context.settings.vibrationEnabled) vibrateTap();
        button.disabled = next === 0;
        setButtonText(next);
        card.classList.toggle('is-complete', next === 0);
        updateTabs();
        updateCompletion(items);
        if (next === 0) {
          window.setTimeout(() => {
            if (completion.hidden) {
              list.querySelector<HTMLButtonElement>('.azkar-count:not(:disabled)')?.focus({ preventScroll: true });
            } else {
              completion.focus({ preventScroll: true });
            }
          }, 180);
        }
      };
      button.addEventListener('click', (event) => { event.stopPropagation(); decrement(); });
      card.addEventListener('click', (event) => {
        if (event.target instanceof Element && event.target.closest('a, button')) return;
        decrement();
      });
      card.addEventListener('keydown', (event) => {
        if (event.target !== card || !['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        decrement();
      });
      card.append(button);
      list.append(card);
    }
    updateCompletion(items);
    if (animate && 'animate' in list) {
      list.animate(
        [{ opacity: 0.78, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 180, easing: 'ease-out' }
      );
    }
  }

  for (const category of categories) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'azkar-tab';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', list.id);
    button.dataset.category = category.id;
    const label = document.createElement('span');
    label.className = 'azkar-tab-label';
    label.textContent = language === 'ar' ? category.ar : category.en;
    const badge = document.createElement('span');
    badge.className = 'azkar-tab-progress';
    button.append(label, badge);
    button.addEventListener('click', () => {
      selectedCategory = category.id;
      draw(true);
    });
    tabs.append(button);
  }
  tabs.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = categories.findIndex((item) => item.id === selectedCategory);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? categories.length - 1
      : (index + (event.key === 'ArrowRight' ? 1 : -1) + categories.length) % categories.length;
    selectedCategory = categories[next].id;
    draw(true);
    tabs.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next].focus();
  });

  page.append(tabs, list, completion);
  draw();
  return page;
}
