import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// Vue DevTools injects a floating overlay whose anchor is a `<div aria-label="Toggle
// devtools panel">` with no role. Storybook (.storybook/main.js) and Vitest
// (vitest.config.js) both build on this config, so that div lands inside every story
// iframe and axe reports a serious `aria-prohibited-attr` violation on every story.
// The overlay is only useful against `pnpm dev`; both tools flag themselves via env.
const isAppDevServer = !process.env.STORYBOOK && !process.env.VITEST

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), ...(isAppDevServer ? [vueDevTools()] : []), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
})
