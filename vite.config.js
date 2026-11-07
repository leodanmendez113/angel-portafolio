import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'node:path'

// El "base" tiene que coincidir con el nombre del repositorio en GitHub Pages.
export default defineConfig({
  base: '/angel-portafolio/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        admin: resolve(import.meta.dirname, 'admin/index.html')
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'logo.svg'],
      manifest: {
        name: 'Anmar Productions — Videografía comercial',
        short_name: 'Anmar Video',
        description: 'Reels y comerciales grabados por Anmar Productions.',
        lang: 'es',
        theme_color: '#0C0C0E',
        background_color: '#0C0C0E',
        display: 'standalone',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // El admin no se sirve desde la caché de la portada.
        navigateFallbackDenylist: [/\/admin/],
        runtimeCaching: [
          {
            // La lista de videos siempre se pide fresca; la copia guardada solo se usa sin señal.
            urlPattern: /videos\.json/,
            handler: 'NetworkFirst',
            options: { cacheName: 'videos', networkTimeoutSeconds: 4 }
          },
          {
            urlPattern: /^https:\/\/i\.ytimg\.com\/.*/,
            handler: 'CacheFirst',
            options: { cacheName: 'miniaturas', expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: { cacheName: 'fuentes', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      }
    })
  ]
})
