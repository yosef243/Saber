import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const siteBase = process.env.CF_PAGES ? '/' : '/Saber/';

export default defineConfig({
  base: siteBase,
  build: { target: 'esnext' },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'icons/icon-72x72.png', 'icons/icon-96x96.png', 'icons/icon-128x128.png',
        'icons/icon-144x144.png', 'icons/icon-152x152.png', 'icons/icon-180x180.png',
        'icons/icon-192x192.png', 'icons/icon-384x384.png', 'icons/icon-512x512.png'
      ],
      manifest: {
        id: './',
        name: 'صدقة جارية - صبري كامل سليم',
        short_name: 'صدقة جارية',
        description: 'مسبحة، أذكار، أدعية، وروابط تذكارية',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#faf8f5',
        theme_color: '#0D3B2E',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          { src: './icons/icon-72x72.png', sizes: '72x72', type: 'image/png', purpose: 'any' },
          { src: './icons/icon-96x96.png', sizes: '96x96', type: 'image/png', purpose: 'any' },
          { src: './icons/icon-128x128.png', sizes: '128x128', type: 'image/png', purpose: 'any' },
          { src: './icons/icon-144x144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
          { src: './icons/icon-152x152.png', sizes: '152x152', type: 'image/png', purpose: 'any' },
          { src: './icons/icon-180x180.png', sizes: '180x180', type: 'image/png', purpose: 'any' },
          { src: './icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: './icons/icon-384x384.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
          { src: './icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
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
