import type { MemorialProfile } from '../types';

export const CANONICAL_ORIGIN = 'https://sabry.pages.dev';

export function memorialShareUrl(profile: MemorialProfile | null, includeMessage = true): string {
  const params = new URLSearchParams();
  if (profile) {
    params.set('name', profile.name);
    params.set('g', profile.gender);
    if (includeMessage && profile.customMessage) params.set('message', profile.customMessage);
  }
  const query = params.toString();
  return `${CANONICAL_ORIGIN}/#/home${query ? `?${query}` : ''}`;
}
