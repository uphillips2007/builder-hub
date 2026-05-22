import { createContext, useContext, useEffect, useState } from 'react'
import { ACCENTS, DEFAULT_ACCENT, FONTS, DEFAULT_FONT } from '../lib/themes'

const ThemeContext = createContext(null)

const loadedFontUrls = new Set()

function loadFont(url) {
  if (!url || loadedFontUrls.has(url)) return
  loadedFontUrls.add(url)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
}

export function ThemeProvider({ children }) {
  const [accent, setAccentName] = useState(() => {
    // v3: force charcoal — clears any leftover rose/old accent
    const themeVer = localStorage.getItem('bh-theme-ver')
    if (themeVer !== '3') {
      localStorage.setItem('bh-theme-ver', '3')
      localStorage.removeItem('bh-accent')
      return DEFAULT_ACCENT
    }
    return localStorage.getItem('bh-accent') || DEFAULT_ACCENT
  })
  const [darkMode, setDarkModeState] = useState(
    () => localStorage.getItem('bh-dark') === 'true'
  )
  const [hubName, setHubNameState] = useState(
    () => localStorage.getItem('bh-hub-name') || 'Builder Hub'
  )
  const [font, setFontName] = useState(
    () => localStorage.getItem('bh-font') || DEFAULT_FONT
  )
  const [compact, setCompactState] = useState(
    () => localStorage.getItem('bh-compact') === 'true'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    const f = FONTS[font] ?? FONTS[DEFAULT_FONT]
    loadFont(f.url)
    document.documentElement.style.setProperty('--font', f.family)
  }, [font])

  useEffect(() => {
    document.documentElement.classList.toggle('compact', compact)
  }, [compact])

  function setAccent(name) {
    setAccentName(name)
    localStorage.setItem('bh-accent', name)
  }

  function setDarkMode(val) {
    setDarkModeState(val)
    localStorage.setItem('bh-dark', String(val))
  }

  function setHubName(name) {
    setHubNameState(name)
    localStorage.setItem('bh-hub-name', name)
  }

  function setFont(name) {
    setFontName(name)
    localStorage.setItem('bh-font', name)
  }

  function setCompact(val) {
    setCompactState(val)
    localStorage.setItem('bh-compact', String(val))
  }

  return (
    <ThemeContext.Provider
      value={{
        accent,
        setAccent,
        darkMode,
        setDarkMode,
        hubName,
        setHubName,
        font,
        setFont,
        compact,
        setCompact,
        palette: ACCENTS[accent] ?? ACCENTS[DEFAULT_ACCENT],
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
