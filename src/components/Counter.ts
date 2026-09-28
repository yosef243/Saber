import { getStarterDhikr } from '../data/tasbeeh';
import type { AppSettings } from '../types';
import { playTap } from '../utils/audio';
import { vibrateTap } from '../utils/haptics';
import { t } from '../utils/i18n';
import { emptyTasbeehProgress, loadTasbeehProgress, saveTasbeehProgress } from '../utils/storage';

export function renderCounter(
  settings: AppSettings,
  onSettingsChange: (next: AppSettings) => void
): HTMLElement {
  const dhikr = getStarterDhikr(settings.language);
  let progress = loadTasbeehProgress();
  if (!dhikr.some((item) => item.id === progress.activeId)) progress.activeId = dhikr[0].id;

  const section = document.createElement('section');
  section.className = 'counter-card';
  section.innerHTML = `
    <h2 class="counter-title"></h2>
    <p class="counter-progress" aria-live="polite"></p>
    <button type="button" class="counter-button"><span class="counter-number"></span><span class="counter-hint"></span></button>
    <p class="counter-total"></p>
    <p class="counter-notice" role="status" aria-live="polite"></p>
    <div class="target-presets" role="group" aria-label="Quick target counts">
      <button type="button" data-target="33">33</button>
      <button type="button" data-target="100">100</button>
      <button type="button" class="custom-target-preset"></button>
    </div>
    <div class="counter-controls">
      <label class="target-label"><span></span><input class="target-input" type="number" min="1" max="9999" inputmode="numeric" /></label>
      <button type="button" class="next-button"></button>
      <button type="button" class="reset-button"></button>
    </div>
    <div class="counter-preferences">
      <label><input class="sound-toggle" type="checkbox" /><span></span></label>
      <label><input class="vibration-toggle" type="checkbox" /><span></span></label>
    </div>`;

  const title = section.querySelector<HTMLElement>('.counter-title')!;
  const count = section.querySelector<HTMLElement>('.counter-number')!;
  const hint = section.querySelector<HTMLElement>('.counter-hint')!;
  const step = section.querySelector<HTMLElement>('.counter-progress')!;
  const total = section.querySelector<HTMLElement>('.counter-total')!;
  const notice = section.querySelector<HTMLElement>('.counter-notice')!;
  const target = section.querySelector<HTMLInputElement>('.target-input')!;
  const tap = section.querySelector<HTMLButtonElement>('.counter-button')!;
  section.querySelector<HTMLElement>('.target-presets')!.setAttribute('aria-label', settings.language === 'ar' ? 'أهداف سريعة' : 'Quick target counts');

  function activeIndex(): number {
    return Math.max(0, dhikr.findIndex((item) => item.id === progress.activeId));
  }

  function targetCount(): number {
    const item = dhikr[activeIndex()];
    return progress.customTargets[item.id] ?? item.targetCount;
  }

  function update(): void {
    const item = dhikr[activeIndex()];
    title.textContent = item.text;
    count.textContent = String(progress.currentCount);
    tap.style.setProperty('--progress', `${Math.min(progress.currentCount / targetCount(), 1) * 360}deg`);
    hint.textContent = t(settings.language, 'tap');
    step.textContent = `${progress.currentCount} / ${targetCount()}`;
    total.textContent = `${t(settings.language, 'total')}: ${progress.totalCount}`;
    target.value = String(targetCount());
    section.querySelector<HTMLElement>('.target-label span')!.textContent = t(settings.language, 'target');
    section.querySelector<HTMLButtonElement>('.custom-target-preset')!.textContent = settings.language === 'ar' ? 'مخصص' : 'Custom';
    section.querySelectorAll<HTMLButtonElement>('.target-presets button').forEach((button) => {
      const selected = button.dataset.target ? Number(button.dataset.target) === targetCount() : ![33, 100].includes(targetCount());
      button.setAttribute('aria-pressed', String(selected));
    });
    section.querySelector<HTMLButtonElement>('.next-button')!.textContent = t(settings.language, 'next');
    section.querySelector<HTMLButtonElement>('.reset-button')!.textContent = t(settings.language, 'reset');
    section.querySelector<HTMLElement>('.sound-toggle + span')!.textContent = t(settings.language, 'sound');
    section.querySelector<HTMLElement>('.vibration-toggle + span')!.textContent = t(settings.language, 'vibration');
    section.querySelector<HTMLInputElement>('.sound-toggle')!.checked = settings.soundEnabled;
    section.querySelector<HTMLInputElement>('.vibration-toggle')!.checked = settings.vibrationEnabled;
  }

  function advance(): void {
    progress.activeId = dhikr[(activeIndex() + 1) % dhikr.length].id;
    progress.currentCount = 0;
    saveTasbeehProgress(progress);
    update();
  }

  tap.addEventListener('click', () => {
    if (settings.soundEnabled) playTap();
    if (settings.vibrationEnabled) vibrateTap();
    progress.currentCount += 1;
    progress.totalCount += 1;
    if (progress.currentCount >= targetCount()) {
      notice.textContent = settings.language === 'ar' ? 'أحسنت! انتقلنا إلى الذكر التالي.' : 'Target reached! Moving to the next dhikr.';
      advance();
    } else {
      notice.textContent = '';
      saveTasbeehProgress(progress);
      update();
    }
  });

  target.addEventListener('change', () => {
    const value = Number(target.value);
    if (!Number.isInteger(value) || value < 1 || value > 9999) {
      update();
      return;
    }
    progress.customTargets[dhikr[activeIndex()].id] = value;
    if (progress.currentCount >= value) advance();
    else { saveTasbeehProgress(progress); update(); }
  });

  section.querySelectorAll<HTMLButtonElement>('.target-presets button[data-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const value = Number(button.dataset.target);
      progress.customTargets[dhikr[activeIndex()].id] = value;
      if (progress.currentCount >= value) advance();
      else { saveTasbeehProgress(progress); update(); }
    });
  });
  section.querySelector<HTMLButtonElement>('.custom-target-preset')!.addEventListener('click', () => {
    target.focus();
    target.select();
  });

  section.querySelector<HTMLButtonElement>('.next-button')!.addEventListener('click', () => {
    notice.textContent = '';
    advance();
  });
  section.querySelector<HTMLButtonElement>('.reset-button')!.addEventListener('click', () => {
    progress = emptyTasbeehProgress();
    progress.activeId = dhikr[0].id;
    notice.textContent = '';
    saveTasbeehProgress(progress);
    update();
  });
  section.querySelector<HTMLInputElement>('.sound-toggle')!.addEventListener('change', (event) => {
    onSettingsChange({ ...settings, soundEnabled: (event.target as HTMLInputElement).checked });
  });
  section.querySelector<HTMLInputElement>('.vibration-toggle')!.addEventListener('change', (event) => {
    onSettingsChange({ ...settings, vibrationEnabled: (event.target as HTMLInputElement).checked });
  });
  update();
  return section;
}
