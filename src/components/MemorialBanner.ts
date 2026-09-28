import type { Language, MemorialProfile } from '../types';
import { pageHref } from '../router';

export function renderMemorialBanner(profile: MemorialProfile | null, language: Language): HTMLElement {
  const banner = document.createElement('aside');
  banner.className = 'memorial-banner';
  banner.setAttribute('aria-label', language === 'ar' ? 'صدقة جارية' : 'Ongoing charity memorial');

  const copy = document.createElement('div');
  copy.className = 'memorial-copy';
  const text = document.createElement('p');
  text.className = 'memorial-kicker';
  const name = document.createElement('h2');
  name.className = 'memorial-name';
  const prayer = document.createElement('p');
  prayer.className = 'memorial-prayer';
  if (profile) {
    text.textContent = language === 'ar'
      ? (profile.name === 'صبري كامل سليم' && profile.gender === 'm'
        ? 'صدقة جارية عن روح المرحوم'
        : `صدقة جارية عن روح ${profile.gender === 'f' ? 'المرحومة' : 'المرحوم'}`)
      : 'An ongoing charity in loving memory of';
    name.textContent = profile.name;
    prayer.textContent = language === 'ar'
      ? profile.customMessage || (profile.gender === 'f'
        ? 'اللهم اغفر لها وارحمها واجعل قبرها روضة من رياض الجنة'
        : 'اللهم اغفر له وارحمه واجعل قبره روضة من رياض الجنة')
      : profile.customMessage || `May Allah envelop ${profile.gender === 'f' ? 'her' : 'him'} in mercy and grant ${profile.gender === 'f' ? 'her' : 'him'} a place in Jannah.`;
  } else {
    text.textContent = language === 'ar'
      ? 'صدقة جارية عن موتانا وموتى المسلمين جميعاً'
      : 'An ongoing charity for all our departed loved ones and all Muslims.';
    name.remove();
    prayer.textContent = language === 'ar'
      ? 'اللهم اغفر لهم وارحمهم وأسكنهم فسيح جناتك'
      : 'May Allah forgive them, have mercy on them, and grant them Jannah.';
  }
  copy.append(text);
  if (profile) copy.append(name);
  const divider = document.createElement('span');
  divider.className = 'memorial-divider';
  divider.setAttribute('aria-hidden', 'true');
  copy.append(divider, prayer);
  banner.append(copy);
  const link = document.createElement('a');
  link.href = pageHref('create-memorial');
  link.className = profile ? 'memorial-badge' : 'memorial-invite';
  link.textContent = profile
    ? (language === 'ar' ? 'إنشاء صدقة جارية' : 'Create ongoing charity')
    : (language === 'ar' ? 'إنشاء صدقة جارية' : 'Create ongoing charity');
  banner.append(link);
  return banner;
}
