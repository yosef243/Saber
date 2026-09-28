import { pageHref, type PageId } from '../router';
import { t } from '../utils/i18n';
import type { Language } from '../types';

const links: { page: PageId; key: Parameters<typeof t>[1]; icon: string }[] = [
  { page: 'home', key: 'home', icon: '📿' },
  { page: 'azkar', key: 'azkar', icon: '☀️' },
  { page: 'duas', key: 'duas', icon: '🤲' },
  { page: 'quran', key: 'quran', icon: '📖' }
];

export function renderNavbar(activePage: PageId, language: Language): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.setAttribute('aria-label', language === 'ar' ? 'الأقسام' : 'Sections');
  for (const { page, key, icon } of links) {
    const anchor = document.createElement('a');
    anchor.href = pageHref(page);
    const symbol = document.createElement('span');
    symbol.className = 'nav-icon';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = icon;
    const label = document.createElement('span');
    label.className = 'nav-label';
    label.textContent = t(language, key);
    anchor.append(symbol, label);
    if (page === activePage) anchor.setAttribute('aria-current', 'page');
    nav.append(anchor);
  }
  return nav;
}
