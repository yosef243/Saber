import { getStarterDhikr } from '../data/tasbeeh';
import type { AppSettings } from '../types';
import { playTap } from '../utils/audio';
import { vibrateTap } from '../utils/haptics';
import { t } from '../utils/i18n';
import { emptyTasbeehProgress, loadTasbeehProgress, saveTasbeehProgress } from '../utils/storage';

const RING_CIRCUMFERENCE = 2 * Math.PI * 110;

export function renderCounter(
  settings: AppSettings,
  onSettingsChange: (next: AppSettings) => void
): HTMLElement {
  const dhikr = getStarterDhikr(settings.language);
  let progress = loadTasbeehProgress();
  let completionPending = false;
  if (!dhikr.some((item) => item.id === progress.activeId)) progress.activeId = dhikr[0].id;

  const section = document.createElement('section');
  section.className = 'counter-card';
  const dhikrRow = document.createElement('div');
  dhikrRow.className = 'counter-dhikr-row';
  const previous = document.createElement('button');
  previous.type = 'button';
  previous.className = 'dhikr-step';
  previous.setAttribute('aria-label', settings.language === 'ar' ? 'الذكر السابق' : 'Previous dhikr');
  previous.textContent = document.documentElement.dir === 'rtl' ? '›' : '‹';
  const title = document.createElement('h2');
  title.className = 'counter-title';
  title.lang = settings.language;
  title.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'dhikr-step';
  next.setAttribute('aria-label', settings.language === 'ar' ? 'الذكر التالي' : 'Next dhikr');
  next.textContent = document.documentElement.dir === 'rtl' ? '‹' : '›';
  dhikrRow.append(previous, title, next);

  const presets = document.createElement('div');
  presets.className = 'target-presets';
  presets.setAttribute('role', 'group');
  presets.setAttribute('aria-label', settings.language === 'ar' ? 'اختر هدف التسبيح' : 'Choose a tasbeeh target');
  const finiteTargets = [33, 100];
  const presetButtons = finiteTargets.map((targetCount) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.target = String(targetCount);
    button.textContent = String(targetCount);
    presets.append(button);
    return button;
  });
  const openButton = document.createElement('button');
  openButton.type = 'button';
  openButton.dataset.target = 'open';
  openButton.textContent = settings.language === 'ar' ? '∞ مفتوح' : '∞ Open';
  presets.append(openButton);

  const dial = document.createElement('button');
  dial.type = 'button';
  dial.className = 'counter-button';
  dial.setAttribute('aria-label', settings.language === 'ar' ? 'اضغط للتسبيح' : 'Tap to count');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('counter-progress-ring');
  svg.setAttribute('viewBox', '0 0 240 240');
  svg.setAttribute('aria-hidden', 'true');
  const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  track.classList.add('counter-ring-track');
  track.setAttribute('cx', '120');
  track.setAttribute('cy', '120');
  track.setAttribute('r', '110');
  const arc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  arc.classList.add('counter-ring-value');
  arc.setAttribute('cx', '120');
  arc.setAttribute('cy', '120');
  arc.setAttribute('r', '110');
  arc.style.strokeDasharray = String(RING_CIRCUMFERENCE);
  svg.append(track, arc);
  const number = document.createElement('span');
  number.className = 'counter-number';
  const hint = document.createElement('span');
  hint.className = 'counter-hint';
  dial.append(svg, number, hint);

  const ratio = document.createElement('p');
  ratio.className = 'counter-progress';
  ratio.id = 'counter-progress-label';
  ratio.setAttribute('aria-live', 'polite');
  const total = document.createElement('p');
  total.className = 'counter-total';
  const notice = document.createElement('p');
  notice.className = 'counter-notice';
  notice.setAttribute('role', 'status');
  notice.setAttribute('aria-live', 'polite');

  const controls = document.createElement('div');
  controls.className = 'counter-controls';
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'reset-button';
  reset.textContent = settings.language === 'ar' ? 'إعادة' : 'Reset';
  controls.append(reset);
  const preferences = document.createElement('div');
  preferences.className = 'counter-preferences';
  const soundLabel = document.createElement('label');
  const sound = document.createElement('input');
  sound.type = 'checkbox';
  sound.checked = settings.soundEnabled;
  const soundText = document.createElement('span');
  soundText.textContent = t(settings.language, 'sound');
  soundLabel.append(sound, soundText);
  const vibrationLabel = document.createElement('label');
  const vibration = document.createElement('input');
  vibration.type = 'checkbox';
  vibration.checked = settings.vibrationEnabled;
  const vibrationText = document.createElement('span');
  vibrationText.textContent = t(settings.language, 'vibration');
  vibrationLabel.append(vibration, vibrationText);
  preferences.append(soundLabel, vibrationLabel);
  section.append(dhikrRow, presets, dial, ratio, total, notice, controls, preferences);

  function activeIndex(): number {
    return Math.max(0, dhikr.findIndex((item) => item.id === progress.activeId));
  }

  function targetCount(): number {
    if (progress.openEnded) return Number.POSITIVE_INFINITY;
    return progress.customTargets[dhikr[activeIndex()].id] === 100 ? 100 : 33;
  }

  function update(): void {
    const item = dhikr[activeIndex()];
    const targetValue = targetCount();
    const amount = progress.openEnded
      ? (progress.currentCount % 100) / 100
      : Math.min(progress.currentCount / targetValue, 1);
    const targetText = progress.openEnded ? '∞' : String(targetValue);
    title.textContent = item.text;
    number.textContent = String(progress.currentCount);
    hint.textContent = t(settings.language, 'tap');
    ratio.textContent = `${progress.currentCount} / ${targetText}`;
    total.textContent = `${t(settings.language, 'total')}: ${progress.totalCount}`;
    arc.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - amount));
  dial.setAttribute('aria-label', settings.language === 'ar'
    ? `${item.text}، ${progress.currentCount} من ${targetText}. اضغط للتسبيح`
    : `${item.text}, ${progress.currentCount} of ${targetText}. Tap to count`);
    dial.setAttribute('aria-describedby', ratio.id);
    presetButtons.forEach((button, index) => {
      button.setAttribute('aria-pressed', String(!progress.openEnded && targetValue === finiteTargets[index]));
    });
    openButton.setAttribute('aria-pressed', String(progress.openEnded));
  }

  function advance(offset = 1, completed = false): void {
    if (completionPending && !completed) return;
    progress.activeId = dhikr[(activeIndex() + offset + dhikr.length) % dhikr.length].id;
    progress.currentCount = 0;
    saveTasbeehProgress(progress);
    update();
  }

  function completeAndAdvance(): void {
    if (completionPending) return;
    completionPending = true;
    section.classList.add('target-reached');
    notice.textContent = settings.language === 'ar' ? 'أحسنت، تقبّل الله منك' : 'Well done. May Allah accept it.';
    dial.disabled = true;
    saveTasbeehProgress(progress);
    window.setTimeout(() => {
      advance(1, true);
      completionPending = false;
      section.classList.remove('target-reached');
      dial.disabled = false;
    }, 520);
  }

  dial.addEventListener('click', () => {
    if (completionPending) return;
    if (settings.soundEnabled) playTap();
    if (settings.vibrationEnabled) vibrateTap();
    progress.currentCount += 1;
    progress.totalCount += 1;
    if (!progress.openEnded && progress.currentCount >= targetCount()) {
      update();
      completeAndAdvance();
      return;
    }
    notice.textContent = '';
    saveTasbeehProgress(progress);
    update();
  });

  presetButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (completionPending) return;
      progress.openEnded = false;
      progress.customTargets[dhikr[activeIndex()].id] = finiteTargets[index];
      if (progress.currentCount >= finiteTargets[index]) { update(); completeAndAdvance(); }
      else { saveTasbeehProgress(progress); update(); }
    });
  });
  openButton.addEventListener('click', () => {
    if (completionPending) return;
    progress.openEnded = true;
    notice.textContent = '';
    saveTasbeehProgress(progress);
    update();
  });
  previous.addEventListener('click', () => advance(-1));
  next.addEventListener('click', () => advance());
  reset.addEventListener('click', () => {
    if (completionPending) return;
    progress = emptyTasbeehProgress();
    progress.activeId = dhikr[0].id;
    notice.textContent = '';
    saveTasbeehProgress(progress);
    update();
  });
  sound.addEventListener('change', () => onSettingsChange({ ...settings, soundEnabled: sound.checked }));
  vibration.addEventListener('change', () => onSettingsChange({ ...settings, vibrationEnabled: vibration.checked }));
  update();
  return section;
}
