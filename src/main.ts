import './styles/main.css';
import './styles/themes.css';
import { renderHeader } from './components/Header';
import { showCreateMemorialModal } from './components/CreateMemorialModal';
import { renderMemorialBanner } from './components/MemorialBanner';
import { renderNavbar } from './components/Navbar';
import { renderHome } from './pages/Home';
import { renderAzkar } from './pages/Azkar';
import { renderDuas } from './pages/Duas';
import { renderQuran } from './pages/Quran';
import { renderNames } from './pages/Names';
import { startRouter, type PageId } from './router';
import type { AppSettings } from './types';
import { defaultSettings, loadSettings, saveSettings } from './utils/storage';
import { getMemorial, initializeMemorial } from './utils/memorial';

const existingApp = document.querySelector<HTMLDivElement>('#app');
const app = existingApp ?? document.createElement('div');
if (!existingApp) {
  console.error('[Saber] Missing #app root in index.html; creating a fallback mount.');
  app.id = 'app';
  document.body.append(app);
}

let settings: AppSettings = defaultSettings;
let currentPageId: PageId = 'home';

function showRenderError(error: unknown): void {
  console.error('[Saber] Failed to render the application:', error);
  const panel = document.createElement('section');
  panel.className = 'startup-error card';
  const title = document.createElement('h2');
  title.textContent = settings.language === 'ar' ? 'تعذر تحميل التطبيق' : 'Unable to load Saber';
  const guidance = document.createElement('p');
  guidance.textContent = settings.language === 'ar'
    ? 'حدث خطأ أثناء فتح الصفحة. يرجى تحديثها للمحاولة مرة أخرى.'
    : 'Something went wrong while opening this page. Please refresh and try again.';
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'primary-button';
  retry.textContent = settings.language === 'ar' ? 'تحديث الصفحة' : 'Reload page';
  retry.addEventListener('click', () => location.reload());
  panel.append(title, guidance, retry);
  app.replaceChildren(panel);
}

function safeRender(page: PageId): void {
  try {
    renderPage(page);
  } catch (error) {
    showRenderError(error);
  }
}

function updateSettings(next: AppSettings): void {
  settings = next;
  saveSettings(settings);
  safeRender(currentPageId);
}

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
    case 'names': main.append(renderNames(context)); break;
  }
  let openMemorialModal: () => void = () => undefined;
  const refreshMemorialBanner = (): void => {
    const currentBanner = app.querySelector('.memorial-banner');
    if (currentBanner) {
      currentBanner.replaceWith(renderMemorialBanner(getMemorial(), settings.language, openMemorialModal));
    }
    document.title = `${getMemorial()?.name || (settings.language === 'ar' ? 'صدقة جارية' : 'Sadaqa Jariyah')} | Saber`;
  };
  openMemorialModal = () => showCreateMemorialModal(
    { settings, profile: getMemorial(), onSettingsChange: updateSettings },
    refreshMemorialBanner
  );
  app.replaceChildren(
    renderHeader(settings, updateSettings),
    renderMemorialBanner(profile, settings.language, openMemorialModal),
    renderNavbar(page, settings.language),
    main
  );
}

function enableServiceWorkerUpdates(): void {
  if (!('serviceWorker' in navigator)) return;
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    location.reload();
  });
  window.addEventListener('load', () => {
    void navigator.serviceWorker.getRegistration(import.meta.env.BASE_URL)
      .then(async (registration) => {
        if (!registration) return;
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        await registration.update();
      })
      .catch((error: unknown) => console.warn('[Saber] Service worker update check failed:', error));
  });
}

window.addEventListener('error', (event) => {
  console.error('[Saber] Unhandled runtime error:', event.error ?? event.message);
});
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Saber] Unhandled promise rejection:', event.reason);
});

try {
  settings = loadSettings();
  initializeMemorial();
  startRouter(safeRender);
} catch (error) {
  showRenderError(error);
}

try {
  enableServiceWorkerUpdates();
} catch (error) {
  console.warn('[Saber] Service worker update setup failed:', error);
}
