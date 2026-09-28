import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const siteBase = process.env.CF_PAGES ? '/' : '/Saber/';

export default defineConfig({
  base: siteBase,
  build: { target: 'esnext' },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192x192.png', 'icons/icon-512x512.png'],
      manifest: {
        id: siteBase,
        name: 'صدقة جارية | Saber',
        short_name: 'Saber',
        description: 'مسبحة، أذكار، أدعية، وروابط تذكارية',
        start_url: siteBase,
        scope: siteBase,
        display: 'standalone',
        background_color: '#faf8f5',
        theme_color: '#0f382c',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          { src: `${siteBase}icons/icon-192x192.png`, sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: `${siteBase}icons/icon-512x512.png`, sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        navigateFallback: `${siteBase}index.html`,
        navigateFallbackDenylist: [/\/legacy\//],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ]
});
