import { renderMemorialBanner } from './MemorialBanner';
import type { MemorialProfile } from '../types';
import { memorialShareUrl } from '../utils/canonical';
import { t } from '../utils/i18n';
import { setMemorial } from '../utils/memorial';
import type { PageContext } from '../pages/types';

export function renderCreateMemorial(
  context: PageContext,
  onProfileSaved: (profile: MemorialProfile) => void
): HTMLElement {
  const language = context.settings.language;
  const page = document.createElement('section');
  page.className = 'create-memorial-content';
  const title = document.createElement('h2');
  title.textContent = t(language, 'create');
  const form = document.createElement('form');
  form.className = 'memorial-form';
  form.innerHTML = `
    <label class="field"><span></span><input name="name" type="text" maxlength="120" autocomplete="name" required /></label>
    <label class="field"><span></span><select name="gender"><option value="m"></option><option value="f"></option></select></label>
    <label class="field"><span></span><textarea name="message" maxlength="500" rows="2"></textarea></label>
    <button type="submit" class="primary-button"></button>`;
  const name = form.elements.namedItem('name') as HTMLInputElement;
  const gender = form.elements.namedItem('gender') as HTMLSelectElement;
  const message = form.elements.namedItem('message') as HTMLTextAreaElement;
  const labels = form.querySelectorAll<HTMLElement>('.field span');
  labels[0].textContent = language === 'ar' ? 'اسم المتوفى' : 'Name of the deceased';
  labels[1].textContent = language === 'ar' ? 'النوع' : 'Gender';
  labels[2].textContent = language === 'ar' ? 'دعاء بسيط للمتوفى' : 'A simple prayer for the deceased';
  gender.options[0].textContent = language === 'ar' ? 'ذكر' : 'Male';
  gender.options[1].textContent = language === 'ar' ? 'أنثى' : 'Female';
  form.querySelector('button')!.textContent = language === 'ar' ? 'إنشاء رابط الصدقة الجارية' : 'Create ongoing charity link';
  message.placeholder = language === 'ar' ? 'اللهم اغفر له وارحمه واجعل قبره روضة من رياض الجنة' : 'Enter a short prayer';
  if (context.profile) {
    name.value = context.profile.name;
    gender.value = context.profile.gender;
    message.value = context.profile.customMessage || '';
  }

  const preview = document.createElement('section');
  preview.className = 'memorial-preview';
  const previewTitle = document.createElement('h3');
  previewTitle.textContent = t(language, 'createPreview');
  const bannerPreview = document.createElement('div');
  const prayerTitle = document.createElement('h4');
  prayerTitle.textContent = t(language, 'previewPrayer');
  const prayer = document.createElement('p');
  prayer.className = 'dua-arabic';
  prayer.lang = 'ar';
  prayer.dir = 'rtl';
  preview.append(previewTitle, bannerPreview, prayerTitle, prayer);

  const output = document.createElement('section');
  output.className = 'generated-link';
  output.hidden = true;
  const linkLabel = document.createElement('label');
  linkLabel.className = 'field';
  linkLabel.textContent = t(language, 'generatedLink');
  const linkInput = document.createElement('input');
  linkInput.type = 'url';
  linkInput.readOnly = true;
  linkLabel.append(linkInput);
  const actions = document.createElement('div');
  actions.className = 'memorial-actions';
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'copy-button';
  copy.textContent = t(language, 'copyLink');
  const whatsapp = document.createElement('a');
  whatsapp.className = 'share-button';
  whatsapp.target = '_blank';
  whatsapp.rel = 'noopener noreferrer';
  whatsapp.textContent = t(language, 'shareWhatsApp');
  const status = document.createElement('p');
  status.className = 'action-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  actions.append(copy, whatsapp);
  output.append(linkLabel, actions, status);

  const profileFromForm = (): MemorialProfile | null => {
    const trimmedName = name.value.trim();
    if (!trimmedName) return null;
    const customMessage = message.value.trim();
    return { name: trimmedName, gender: gender.value === 'f' ? 'f' : 'm', ...(customMessage ? { customMessage } : {}) };
  };
  const updatePreview = () => {
    const profile = profileFromForm();
    bannerPreview.replaceChildren(renderMemorialBanner(profile, language));
    prayer.textContent = profile?.customMessage || (language === 'ar'
      ? (profile?.gender === 'f'
        ? 'اللهم اغفر لها وارحمها واجعل قبرها روضة من رياض الجنة'
        : 'اللهم اغفر له وارحمه واجعل قبره روضة من رياض الجنة')
      : (profile?.gender === 'f'
        ? 'May Allah forgive her, have mercy on her, and grant her a garden among the gardens of Paradise.'
        : 'May Allah forgive him, have mercy on him, and grant him a garden among the gardens of Paradise.'));
    output.hidden = true;
    status.textContent = '';
    status.classList.remove('is-visible');
  };
  form.addEventListener('input', updatePreview);
  form.addEventListener('change', updatePreview);
  updatePreview();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const profile = profileFromForm();
    if (!profile) { name.focus(); return; }
    setMemorial(profile);
    onProfileSaved(profile);
    const url = memorialShareUrl(profile);
    linkInput.value = url;
    const prayerText = profile.customMessage || (profile.gender === 'f'
      ? 'اللهم اغفر لها وارحمها واجعل قبرها روضة من رياض الجنة'
      : 'اللهم اغفر له وارحمه واجعل قبره روضة من رياض الجنة');
    const dedication = language === 'ar'
      ? `صدقة جارية عن روح ${profile.gender === 'f' ? 'المرحومة' : 'المرحوم'} ${profile.name}\n${prayerText}`
      : `An ongoing charity in memory of ${profile.name}.\nMay Allah forgive ${profile.gender === 'f' ? 'her' : 'him'} and have mercy on ${profile.gender === 'f' ? 'her' : 'him'}.\n${prayerText}`;
    whatsapp.href = `https://wa.me/?text=${encodeURIComponent(`${dedication}\n\n${url}`)}`;
    output.hidden = false;
    status.textContent = '';
    status.classList.remove('is-visible');
  });
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(linkInput.value);
      status.textContent = t(language, 'copied');
      status.classList.add('is-visible');
      copy.textContent = t(language, 'copied');
      window.setTimeout(() => {
        if (copy.isConnected) copy.textContent = t(language, 'copyLink');
        status.classList.remove('is-visible');
      }, 2500);
    } catch {
      linkInput.focus();
      linkInput.select();
      status.textContent = t(language, 'copyFailed');
      status.classList.add('is-visible');
    }
  });

  page.append(title, form, preview, output);
  return page;
}
