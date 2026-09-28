export const pageIds = ['home', 'azkar', 'duas', 'quran', 'more', 'create-memorial'] as const;
export type PageId = typeof pageIds[number];

export function currentPage(): PageId {
  const page = location.hash.replace(/^#\/?/, '').split(/[/?]/)[0];
  return pageIds.includes(page as PageId) ? page as PageId : 'home';
}

export function pageHref(page: PageId): string {
  return `#/${page}`;
}

export function startRouter(render: (page: PageId) => void): void {
  window.addEventListener('hashchange', () => render(currentPage()));
  render(currentPage());
}
