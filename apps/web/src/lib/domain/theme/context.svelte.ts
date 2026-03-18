import { getContext, setContext } from 'svelte'

export type Theme = 'dark' | 'light'
export type ThemePreference = 'system' | Theme

const THEME_KEY = Symbol('theme')
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const getSystemTheme = (): Theme =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(theme)
}

const setCookie = (theme: ThemePreference) => {
  if (typeof document === 'undefined') {
    return
  }
  const value = theme === 'system' ? getSystemTheme() : theme
  document.cookie = `theme=${value};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`
}

const createThemeState = () => {
  let preference = $state<ThemePreference>('light')
  let resolved = $state<Theme>('light')

  if (typeof document !== 'undefined') {
    const isDark = document.documentElement.classList.contains('dark')
    resolved = isDark ? 'dark' : 'light'
    preference = resolved
  }

  return {
    get preference() {
      return preference
    },
    get resolved() {
      return resolved
    },
    set: (pref: ThemePreference) => {
      preference = pref
      resolved = pref === 'system' ? getSystemTheme() : pref
      applyTheme(resolved)
      setCookie(pref)
    },
    setupSystemListener: () => {
      if (typeof window === 'undefined') {
        return () => {}
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent) => {
        if (preference === 'system') {
          resolved = e.matches ? 'dark' : 'light'
          applyTheme(resolved)
          setCookie('system')
        }
      }

      mediaQuery.addEventListener('change', handler)
      return () => {
        mediaQuery.removeEventListener('change', handler)
      }
    }
  }
}

type ThemeState = ReturnType<typeof createThemeState>

export const createThemeContext = () => {
  const state = createThemeState()
  setContext(THEME_KEY, state)
  return state
}

export const useTheme = () => {
  const ctx = getContext<ThemeState | undefined>(THEME_KEY)
  if (!ctx) {
    throw new Error('useTheme must be called within a component tree with createThemeContext')
  }
  return ctx
}
