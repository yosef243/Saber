import type { AppSettings, Theme } from '../types';

const themes: Theme[] = ['default', 'blue', 'brown', 'dark'];
const themeColors: Record<Theme, string> = {
  default: '#1e6f5c', blue: '#1d3557', brown: '#6f4e37', dark: '#111827'
};

export function renderHeader(
  settings: AppSettings,
  onSettingsChange: (next: AppSettings) => void
): HTMLElement {
  const header = document.createElement('header');
  header.className = 'site-header';

  const top = document.createElement('div');
  top.className = 'header-actions';

  const language = document.createElement('button');
  language.type = 'button';
  language.className = 'text-button';
  language.textContent = settings.language === 'ar' ? 'English' : 'العربية';
  language.setAttribute('aria-label', settings.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
  language.addEventListener('click', () => onSettingsChange({ ...settings, language: settings.language === 'ar' ? 'en' : 'ar' }));
  top.append(language);

  const themePicker = document.createElement('div');
  themePicker.className = 'theme-picker';
  themePicker.setAttribute('aria-label', settings.language === 'ar' ? 'ألوان التطبيق' : 'App colors');
  for (const theme of themes) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-swatch';
    button.style.backgroundColor = themeColors[theme];
    button.setAttribute('aria-label', theme);
    button.setAttribute('aria-pressed', String(settings.theme === theme));
    button.addEventListener('click', () => onSettingsChange({ ...settings, theme }));
    themePicker.append(button);
  }
  top.append(themePicker);
  header.append(top);

  const title = document.createElement('h1');
  title.textContent = settings.language === 'ar' ? 'صدقة جارية' : 'Sadaqa Jariyah';
  header.append(title);
  return header;
}
