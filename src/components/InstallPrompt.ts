import type { Language } from '../types';

interface InstallChoice { outcome: 'accepted' | 'dismissed'; platform: string }
interface DeferredInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
}

let deferredPrompt: DeferredInstallPrompt | null = null;
let promptButton: HTMLButtonElement | null = null;
let promptContainer: HTMLDivElement | null = null;
let helpText: HTMLElement | null = null;
let currentLanguage: Language = 'ar';
let initialized = false;
let dismissed = false;

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isInstalled(): boolean {
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  const standaloneDisplay = typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches;
  return navigatorWithStandalone.standalone === true || standaloneDisplay;
}

function updatePrompt(): void {
  if (!promptButton || !promptContainer) return;
  const visible = !dismissed && !isInstalled() && (Boolean(deferredPrompt) || isIOS());
  promptContainer.hidden = !visible;
  promptButton.disabled = !deferredPrompt && !isIOS();
  if (helpText) {
    helpText.textContent = currentLanguage === 'ar'
      ? 'اضغط على زر المشاركة ثم اختر «إضافة إلى الشاشة الرئيسية».'
      : 'Tap Share, then choose “Add to Home Screen”.';
  }
}

export function initializeInstallPrompt(): void {
  if (initialized) return;
  initialized = true;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as DeferredInstallPrompt;
    dismissed = false;
    updatePrompt();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    dismissed = true;
    updatePrompt();
  });
}

export function renderInstallPrompt(language: Language): HTMLElement {
  initializeInstallPrompt();
  currentLanguage = language;
  const container = document.createElement('div');
  container.className = 'install-prompt';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'install-prompt-button';
  button.textContent = language === 'ar' ? '📲 تثبيت التطبيق على الهاتف' : '📲 Install on your phone';
  button.setAttribute('aria-expanded', 'false');
  const help = document.createElement('p');
  help.className = 'install-prompt-help';
  help.setAttribute('role', 'status');
  help.hidden = true;
  button.addEventListener('click', async () => {
    if (isIOS() && !deferredPrompt) {
      help.hidden = !help.hidden;
      button.setAttribute('aria-expanded', String(!help.hidden));
      return;
    }
    if (!deferredPrompt) return;
    const install = deferredPrompt;
    deferredPrompt = null;
    button.disabled = true;
    try {
      await install.prompt();
      const choice = await install.userChoice;
      dismissed = true;
      if (choice.outcome === 'accepted') dismissed = true;
    } catch (error) {
      console.warn('[Saber] Native install prompt failed:', error);
      dismissed = true;
    } finally {
      updatePrompt();
    }
  });
  container.append(button, help);
  promptButton = button;
  promptContainer = container;
  helpText = help;
  updatePrompt();
  return container;
}
