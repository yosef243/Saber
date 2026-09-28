import { allahNames } from '../data/names';
import { t } from '../utils/i18n';
import type { PageContext } from './types';

export function renderNames({ settings }: PageContext): HTMLElement {
  const page = document.createElement('section');
  page.className = 'page card names-page';
  const back = document.createElement('a');
  back.className = 'reader-back';
  back.href = '#/home';
  back.textContent = settings.language === 'ar' ? 'العودة إلى السبحة' : 'Back to Tasbeeh';
  const title = document.createElement('h2');
  title.textContent = t(settings.language, 'names');
  const grid = document.createElement('div');
  grid.className = 'names-grid';
  for (const item of allahNames) {
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
    meaning.textContent = settings.language === 'ar' ? item.descriptionAr : `${item.transliteration} · ${item.meaningEn}`;
    card.append(number, name, meaning);
    grid.append(card);
  }
  page.append(back, title, grid);
  return page;
}
