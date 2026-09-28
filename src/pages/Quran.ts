import {
  getBookmark, getReaderPreferences, getSurah, saveBookmark, saveReaderPreferences,
  surahIndex, type QuranSurah, type SurahMetadata
} from '../utils/quranApi';
import type { PageContext } from './types';

let activeObserver: IntersectionObserver | null = null;

function readerHref(surah: number, ayah?: number): string {
  return `#/quran/${surah}${ayah ? `/${ayah}` : ''}`;
}

function revelationLabel(metadata: SurahMetadata, language: 'ar' | 'en'): string {
  if (language === 'en') return metadata.revelationType;
  return metadata.revelationType === 'Meccan' ? 'مكية' : 'مدنية';
}

function renderIndex(page: HTMLElement, context: PageContext): void {
  const language = context.settings.language;
  const bookmark = getBookmark();
  if (bookmark) {
    const resume = document.createElement('a');
    resume.className = 'resume-banner';
    resume.href = readerHref(bookmark.surah, bookmark.ayah);
    const name = surahIndex[bookmark.surah - 1];
    resume.textContent = language === 'ar'
      ? `متابعة القراءة: ${name.name}، الآية ${bookmark.ayah}`
      : `Continue reading: ${name.englishName}, ayah ${bookmark.ayah}`;
    page.append(resume);
  }

  const search = document.createElement('input');
  search.type = 'search';
  search.className = 'surah-search';
  search.placeholder = language === 'ar' ? 'ابحث عن سورة أو رقمها' : 'Search by name or number';
  search.setAttribute('aria-label', search.placeholder);
  page.append(search);

  const list = document.createElement('div');
  list.className = 'surah-index';
  function drawIndex(term = ''): void {
    list.replaceChildren();
    const normalized = term.trim().toLocaleLowerCase();
    for (const surah of surahIndex) {
      if (normalized && !`${surah.number} ${surah.name} ${surah.englishName}`.toLocaleLowerCase().includes(normalized)) continue;
      const link = document.createElement('a');
      link.className = 'surah-row';
      link.href = readerHref(surah.number);
      const number = document.createElement('span');
      number.className = 'surah-number';
      number.textContent = String(surah.number);
      const names = document.createElement('span');
      names.className = 'surah-names';
      const arabic = document.createElement('strong');
      arabic.lang = 'ar';
      arabic.dir = 'rtl';
      arabic.textContent = surah.name;
      const english = document.createElement('small');
      english.textContent = surah.englishName;
      names.append(arabic, english);
      const details = document.createElement('span');
      details.className = 'surah-details';
      details.textContent = language === 'ar'
        ? `${revelationLabel(surah, language)} · ${surah.numberOfAyahs} آية`
        : `${revelationLabel(surah, language)} · ${surah.numberOfAyahs} verses`;
      link.append(number, names, details);
      list.append(link);
    }
  }
  search.addEventListener('input', () => drawIndex(search.value));
  page.append(list);
  drawIndex();
}

function renderReader(page: HTMLElement, context: PageContext, number: number, requestedAyah: number): void {
  const language = context.settings.language;
  const metadata = surahIndex[number - 1];
  if (!metadata || metadata.number !== number) { renderIndex(page, context); return; }

  const back = document.createElement('a');
  back.href = '#/quran';
  back.className = 'reader-back';
  back.textContent = language === 'ar' ? '← فهرس السور' : '← Surah index';
  const title = document.createElement('h3');
  title.className = 'reader-title';
  title.lang = 'ar';
  title.dir = 'rtl';
  title.textContent = metadata.name;
  const subtitle = document.createElement('p');
  subtitle.className = 'reader-subtitle';
  subtitle.textContent = `${metadata.englishName} · ${revelationLabel(metadata, language)} · ${metadata.numberOfAyahs} ${language === 'ar' ? 'آية' : 'verses'}`;
  const controls = document.createElement('div');
  controls.className = 'reader-controls';
  const smaller = document.createElement('button');
  smaller.type = 'button';
  smaller.textContent = 'A−';
  smaller.setAttribute('aria-label', language === 'ar' ? 'تصغير الخط' : 'Decrease font size');
  const larger = document.createElement('button');
  larger.type = 'button';
  larger.textContent = 'A+';
  larger.setAttribute('aria-label', language === 'ar' ? 'تكبير الخط' : 'Increase font size');
  const night = document.createElement('button');
  night.type = 'button';
  night.textContent = language === 'ar' ? 'الوضع الليلي' : 'Night mode';
  night.setAttribute('aria-pressed', 'false');
  controls.append(smaller, larger, night);
  const content = document.createElement('div');
  content.className = 'quran-reader';
  const preferences = getReaderPreferences();
  function applyPreferences(): void {
    content.style.setProperty('--ayah-size', `${preferences.fontSize}px`);
    content.classList.toggle('reader-night', preferences.nightMode);
    night.setAttribute('aria-pressed', String(preferences.nightMode));
    saveReaderPreferences(preferences);
  }
  smaller.addEventListener('click', () => { preferences.fontSize = Math.max(24, preferences.fontSize - 2); applyPreferences(); });
  larger.addEventListener('click', () => { preferences.fontSize = Math.min(48, preferences.fontSize + 2); applyPreferences(); });
  night.addEventListener('click', () => { preferences.nightMode = !preferences.nightMode; applyPreferences(); });
  applyPreferences();

  const status = document.createElement('p');
  status.className = 'reader-status';
  status.setAttribute('role', 'status');
  status.textContent = language === 'ar' ? 'جارٍ تحميل السورة...' : 'Loading surah…';
  content.append(status);
  page.append(back, title, subtitle, controls, content);

  function showSurah(surah: QuranSurah): void {
    content.replaceChildren();
    const ayah = Number.isInteger(requestedAyah) && requestedAyah >= 1 && requestedAyah <= surah.ayahs.length ? requestedAyah : 1;
    saveBookmark({ surah: number, ayah });
    for (const item of surah.ayahs) {
      const verse = document.createElement('article');
      verse.id = `ayah-${item.numberInSurah}`;
      verse.className = 'quran-ayah';
      verse.dataset.ayah = String(item.numberInSurah);
      verse.tabIndex = 0;
      verse.setAttribute('aria-label', `${language === 'ar' ? 'الآية' : 'Ayah'} ${item.numberInSurah}`);
      const text = document.createElement('p');
      text.className = 'quran-text';
      text.lang = 'ar';
      text.dir = 'rtl';
      text.textContent = item.text.replace(/^\uFEFF/, '');
      const marker = document.createElement('span');
      marker.className = 'ayah-marker';
      marker.textContent = String(item.numberInSurah);
      verse.append(text, marker);
      verse.addEventListener('click', () => saveBookmark({ surah: number, ayah: item.numberInSurah }));
      verse.addEventListener('focus', () => saveBookmark({ surah: number, ayah: item.numberInSurah }));
      content.append(verse);
    }
    requestAnimationFrame(() => {
      if (!page.isConnected) return;
      if (ayah > 1) page.querySelector(`#ayah-${ayah}`)?.scrollIntoView({ block: 'start' });
      if ('IntersectionObserver' in window) {
        activeObserver?.disconnect();
        activeObserver = new IntersectionObserver((entries) => {
          const visible = entries.filter((entry) => entry.isIntersecting);
          if (!visible.length || !page.isConnected) return;
          visible.sort((a, b) => Math.abs(a.boundingClientRect.top - innerHeight * .2) - Math.abs(b.boundingClientRect.top - innerHeight * .2));
          const currentAyah = Number((visible[0].target as HTMLElement).dataset.ayah);
          if (currentAyah >= 1) saveBookmark({ surah: number, ayah: currentAyah });
        }, { rootMargin: '-15% 0px -65% 0px' });
        content.querySelectorAll('.quran-ayah').forEach((element) => activeObserver?.observe(element));
        window.addEventListener('hashchange', () => activeObserver?.disconnect(), { once: true });
      }
    });
  }

  void getSurah(number).then((surah) => {
    if (page.isConnected) showSurah(surah);
  }).catch(() => {
    if (!page.isConnected) return;
    status.textContent = language === 'ar' ? 'تعذر تحميل السورة. اتصل بالإنترنت أو افتح سورة محفوظة.' : 'Could not load this surah. Connect to the internet or open a saved surah.';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'text-button';
    retry.textContent = language === 'ar' ? 'حاول مرة أخرى' : 'Try again';
    retry.addEventListener('click', () => {
      page.replaceChildren();
      const heading = document.createElement('h2');
      heading.textContent = language === 'ar' ? 'القرآن الكريم' : 'The Quran';
      page.append(heading);
      renderReader(page, context, number, requestedAyah);
    });
    content.append(retry);
  });
}

export function renderQuran(context: PageContext): HTMLElement {
  activeObserver?.disconnect();
  const page = document.createElement('section');
  page.className = 'page card quran-page';
  const heading = document.createElement('h2');
  heading.textContent = context.settings.language === 'ar' ? 'القرآن الكريم' : 'The Quran';
  page.append(heading);
  const match = location.hash.match(/^#\/quran\/(\d+)(?:\/(\d+))?/);
  if (match) renderReader(page, context, Number(match[1]), Number(match[2] || '1'));
  else renderIndex(page, context);
  return page;
}
