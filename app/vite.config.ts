import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/workouts/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/*.jpg'],
      manifest: {
        name: 'Workday Workouts',
        short_name: 'Workouts',
        description: 'Quick exercise breaks for your workday',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/workouts/',
        icons: [
          {
            src: '/workouts/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/workouts/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,jpg,png,svg,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
