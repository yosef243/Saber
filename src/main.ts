import './styles/main.css';
import './styles/themes.css';
import { renderHeader } from './components/Header';
import { renderMemorialBanner } from './components/MemorialBanner';
import { renderNavbar } from './components/Navbar';
import { renderHome } from './pages/Home';
import { renderAzkar } from './pages/Azkar';
import { renderDuas } from './pages/Duas';
import { renderQuran } from './pages/Quran';
import { renderCreateMemorial } from './pages/CreateMemorial';
import { renderMore } from './pages/More';
import { startRouter, type PageId } from './router';
import type { AppSettings } from './types';
import { loadSettings, saveSettings } from './utils/storage';
import { getMemorial, initializeMemorial } from './utils/memorial';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app root');

let settings = loadSettings();
initializeMemorial();

function updateSettings(next: AppSettings): void {
  settings = next;
  saveSettings(settings);
  renderPage(currentPageId);
}

let currentPageId: PageId = 'home';

function renderPage(page: PageId): void {
  currentPageId = page;
  const profile = getMemorial();
  document.documentElement.lang = settings.language;
  document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
  document.body.dataset.theme = settings.theme;
  document.body.dataset.page = page;
  document.title = `${profile?.name || (settings.language === 'ar' ? 'صدقة جارية' : 'Sadaqa Jariyah')} | Saber`;

  const context = { settings, profile, onSettingsChange: updateSettings };
  const main = document.createElement('main');
  main.id = 'main-content';
  switch (page) {
    case 'home': main.append(renderHome(context)); break;
    case 'azkar': main.append(renderAzkar(context)); break;
    case 'duas': main.append(renderDuas(context)); break;
    case 'quran': main.append(renderQuran(context)); break;
    case 'more': main.append(renderMore(context)); break;
    case 'create-memorial': main.append(renderCreateMemorial(context)); break;
  }
  app!.replaceChildren(
    renderHeader(settings, updateSettings),
    ...((page === 'create-memorial') ? [] : [renderMemorialBanner(profile, settings.language)]),
    renderNavbar(page, settings.language),
    main
  );
}

startRouter(renderPage);
