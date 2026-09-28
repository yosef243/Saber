import { duaCategories, duas, resolveDuaText } from '../data/duas';
import type { DuaCategory } from '../types';
import { shareDuaCard } from '../utils/shareCard';
import type { PageContext } from './types';

let selectedCategory: DuaCategory = 'deceased';

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const temporary = document.createElement('textarea');
    temporary.value = value;
    temporary.style.position = 'fixed';
    temporary.style.opacity = '0';
    document.body.append(temporary);
    temporary.select();
    try { return document.execCommand('copy'); }
    catch { return false; }
    finally { temporary.remove(); }
  }
}

export function renderDuas(context: PageContext): HTMLElement {
  const language = context.settings.language;
  const page = document.createElement('section');
  page.className = 'page card';
  const heading = document.createElement('h2');
  heading.textContent = language === 'ar' ? 'الأدعية' : 'Supplications';
  page.append(heading);

  const tabs = document.createElement('div');
  tabs.className = 'content-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', heading.textContent);
  const list = document.createElement('div');
  list.id = 'duas-list';
  list.className = 'dua-list';
  list.setAttribute('role', 'tabpanel');

  function draw(): void {
    for (const button of tabs.querySelectorAll<HTMLButtonElement>('button')) {
      const selected = button.dataset.category === selectedCategory;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
    list.replaceChildren();
    for (const dua of duas.filter((item) => item.category === selectedCategory)) {
      const text = resolveDuaText(dua, context.profile);
      const card = document.createElement('article');
      card.className = 'dua-card';
      const title = document.createElement('h3');
      title.textContent = language === 'ar' ? dua.title : dua.titleEn;
      const body = document.createElement('p');
      body.className = 'dua-arabic';
      body.lang = 'ar';
      body.dir = 'rtl';
      body.textContent = text;
      card.append(title, body);
      if (language === 'en') {
        const translation = document.createElement('p');
        translation.className = 'dua-translation';
        translation.textContent = dua.translationEn;
        card.append(translation);
      }
      const usageNote = language === 'ar' ? dua.usageNoteAr : dua.usageNoteEn;
      if (usageNote) {
        const note = document.createElement('p');
        note.className = 'dua-usage';
        note.textContent = usageNote;
        card.append(note);
      }
      const source = document.createElement('a');
      source.href = dua.sourceUrl;
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      source.className = 'dua-source';
      source.textContent = dua.source;
      card.append(source);

      const actions = document.createElement('div');
      actions.className = 'dua-actions';
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.textContent = language === 'ar' ? 'نسخ النص' : 'Copy text';
      const share = document.createElement('button');
      share.type = 'button';
      share.textContent = language === 'ar' ? 'شارك كبطاقة تذكارية' : 'Share memorial card';
      const status = document.createElement('span');
      status.className = 'action-status';
      status.setAttribute('role', 'status');
      copy.addEventListener('click', async () => {
        status.textContent = await copyText(text)
          ? (language === 'ar' ? 'تم النسخ' : 'Copied')
          : (language === 'ar' ? 'تعذر النسخ' : 'Copy failed');
      });
      share.addEventListener('click', async () => {
        share.disabled = true;
        try {
          const result = await shareDuaCard(dua.title, text, dua.source, context.profile);
          status.textContent = result === 'shared'
            ? (language === 'ar' ? 'تمت المشاركة' : 'Shared')
            : (language === 'ar' ? 'تم تنزيل البطاقة' : 'Card downloaded');
        } catch (error) {
          if (!(error instanceof DOMException && error.name === 'AbortError')) {
            status.textContent = language === 'ar' ? 'تعذر إنشاء البطاقة' : 'Could not create card';
          }
        } finally {
          share.disabled = false;
        }
      });
      actions.append(copy, share, status);
      card.append(actions);
      list.append(card);
    }
  }

  for (const category of duaCategories) {
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
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = duaCategories.findIndex((item) => item.id === selectedCategory);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? duaCategories.length - 1
      : (index + (event.key === 'ArrowRight' ? 1 : -1) + duaCategories.length) % duaCategories.length;
    selectedCategory = duaCategories[next].id;
    draw();
    tabs.querySelectorAll<HTMLButtonElement>('button')[next].focus();
  });
  page.append(tabs, list);
  draw();
  return page;
}
