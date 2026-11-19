// vite.config.ts reads this key to inject the pre-paint theme script into
// index.html, so the `dark` class on <html> is the source of truth after load.
export const THEME_STORAGE_KEY = 'theme'

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark')
  try {
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light')
  } catch {
    // Storage can be blocked (e.g. private mode); the theme still applies for this visit.
  }
}
