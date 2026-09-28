# Saber

Saber is a vanilla TypeScript PWA built with Vite. It provides five bottom-navigation views, memorial personalization, a Smart Tasbeeh, categorized azkar and duas, an in-app Quran reader, and a dedicated memorial creation page.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal. Check with `npm run typecheck` and `npm run lint`, then build with `npm run build`. The production output is `dist/`. Cloudflare Pages sets `CF_PAGES` and builds for the domain root; local and GitHub Pages builds use `/Saber/`.

For Cloudflare Pages Git deployments, set the build command to `npm run build` and the build output directory to `dist`.

## Source layout

- `src/types`: domain interfaces and constrained settings types
- `src/data`: typed tasbeeh, azkar, duas, the 114-surah metadata index, 99 names of Allah, 20 stories, and 10 daily tasks
- `src/components`: header, navigation, counter, and memorial banner
- `src/pages`: Home, Azkar, Duas, Quran, More, and Create Memorial views
- `src/styles`: responsive layout and theme tokens
- `src/utils`: storage, memorial state, Quran API/cache, share-card rendering, audio, haptics, and translations
- `legacy/index.html`: original page source; the original `css/`, `data/`, `js/`, `manifest.json`, and `sw.js` remain at the repository root as migration references

Memorial name and gender are initialized from URL query or hash parameters and stored locally. The creation page previews the dedication and gender-aware prayer as the form changes, then generates a shareable `#/home?name=...&g=...` URL with copy and WhatsApp actions. Azkar and duas have source links on their cards. The Quran index is bundled as small metadata; Uthmani text is fetched one surah at a time from [Al Quran Cloud](https://alquran.cloud/api) and cached in IndexedDB, with a localStorage fallback. Only surahs already opened are available offline. Reader preferences and the last-read ayah are stored locally. The More page contains the migrated names and stories plus a local-calendar-day devotional tracker. Language preference is stored locally; Arabic is the default and English switches the app to LTR.

The Vite PWA plugin emits `dist/manifest.webmanifest` and `dist/sw.js` with start URL, scope, icon paths, and service-worker registration matched to the selected base path. The root `manifest.json` and `sw.js` are legacy references and are not used by the production build.

## Ad isolation

The new app contains all AdSense code inside `src/pages/CreateMemorial.ts`. Other pages have no ad element or AdSense request. Ads are disabled until both `VITE_ADSENSE_CLIENT` and `VITE_ADSENSE_SLOT` are configured at build time (see `.env.example`). Failed or unfilled ads are removed without a placeholder.
