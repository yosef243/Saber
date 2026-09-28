import { renderCounter } from '../components/Counter';
import type { PageContext } from './types';

export function renderHome(context: PageContext): HTMLElement {
  const page = document.createElement('div');
  page.className = 'page';
  page.append(renderCounter(context.settings, context.onSettingsChange));
  return page;
}
