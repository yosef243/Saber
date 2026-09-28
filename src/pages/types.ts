import type { AppSettings, MemorialProfile } from '../types';

export interface PageContext {
  settings: AppSettings;
  profile: MemorialProfile | null;
  onSettingsChange: (next: AppSettings) => void;
}
