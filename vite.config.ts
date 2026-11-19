import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

import app from './server/app'
import { THEME_STORAGE_KEY } from './src/lib/theme'

// Runs in <head> before first paint so the saved (or system) theme applies
// without a light flash. Injected here so the storage key has one definition.
const THEME_INIT_SCRIPT = `(() => {
  const media = matchMedia('(prefers-color-scheme: dark)')
  const applyTheme = () => {
    let saved = null
    try {
      saved = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})
    } catch {}
    const isDark = saved ? saved === 'dark' : media.matches
    document.documentElement.classList.toggle('dark', isDark)
  }
  applyTheme()
  media.addEventListener('change', applyTheme)
})()`

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      configureServer(server) {
        server.middlewares.use(app)
      },
      name: 'api-server'
    },
    {
      name: 'theme-init',
      transformIndexHtml: () => [
        { children: THEME_INIT_SCRIPT, injectTo: 'head-prepend', tag: 'script' }
      ]
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
