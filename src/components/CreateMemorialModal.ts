import type { MemorialProfile } from '../types';
import { renderCreateMemorial } from './CreateMemorialForm';
import type { PageContext } from '../pages/types';

export function showCreateMemorialModal(
  context: PageContext,
  onProfileSaved: (profile: MemorialProfile) => void
): void {
  const existing = document.querySelector<HTMLDialogElement>('.create-memorial-modal');
  if (existing) {
    existing.querySelector<HTMLButtonElement>('.modal-close')?.focus();
    return;
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'create-memorial-modal';
  dialog.setAttribute('aria-label', context.settings.language === 'ar' ? 'إنشاء صدقة جارية' : 'Create an ongoing charity');
  const frame = document.createElement('div');
  frame.className = 'create-memorial-modal-frame';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'modal-close';
  close.setAttribute('aria-label', context.settings.language === 'ar' ? 'إغلاق' : 'Close');
  close.textContent = '×';
  close.addEventListener('click', () => dialog.close());
  frame.append(close, renderCreateMemorial(context, onProfileSaved));

  const ad = renderMemorialAd(dialog);
  if (ad) frame.append(ad.element);
  dialog.append(frame);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    ad?.dispose();
    dialog.remove();
  }, { once: true });
  document.body.append(dialog);
  dialog.showModal();
}

function renderMemorialAd(dialog: HTMLDialogElement): { element: HTMLElement; dispose: () => void } | null {
  const client = import.meta.env.VITE_ADSENSE_CLIENT?.trim();
  const slot = import.meta.env.VITE_ADSENSE_SLOT?.trim();
  if (!/^ca-pub-\d+$/.test(client || '') || !/^\d+$/.test(slot || '')) return null;

  const container = document.createElement('aside');
  container.className = 'memorial-ad';
  container.setAttribute('aria-label', 'Advertisement');
  const ad = document.createElement('ins');
  ad.className = 'adsbygoogle';
  ad.style.display = 'block';
  ad.dataset.adClient = client;
  ad.dataset.adSlot = slot;
  ad.dataset.adFormat = 'auto';
  ad.dataset.fullWidthResponsive = 'true';
  container.append(ad);

  let timeout = 0;
  const dispose = (): void => {
    observer.disconnect();
    window.clearTimeout(timeout);
  };
  const observer = new MutationObserver(() => {
    if (ad.dataset.adStatus === 'filled') {
      container.classList.add('is-filled');
      dispose();
    }
    if (ad.dataset.adStatus === 'unfilled') {
      container.remove();
      dispose();
    }
  });
  observer.observe(ad, { attributes: true, attributeFilter: ['data-ad-status'] });
  timeout = window.setTimeout(() => {
    container.remove();
    dispose();
  }, 8000);

  const push = (): void => {
    if (!dialog.open || !container.isConnected) return;
    const adWindow = window as Window & { adsbygoogle?: Record<string, unknown>[] };
    try { (adWindow.adsbygoogle ??= []).push({}); }
    catch { container.remove(); }
  };
  queueMicrotask(() => {
    if (!dialog.open || !container.isConnected) return;
    const existing = document.querySelector<HTMLScriptElement>('script[data-saber-adsense]');
    if (existing) {
      if (existing.dataset.loaded === 'true') push();
      else existing.addEventListener('load', push, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.dataset.saberAdsense = 'true';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.crossOrigin = 'anonymous';
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      push();
    });
    script.addEventListener('error', () => {
      dispose();
      container.remove();
      script.remove();
    }, { once: true });
    document.head.append(script);
  });
  return { element: container, dispose };
}
