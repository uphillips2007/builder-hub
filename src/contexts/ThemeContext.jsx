import { createContext, useContext, useEffect, useState } from 'react'
import { PALETTE, FONTS, DEFAULT_FONT, DEFAULT_ACCENT_COLOR } from '../lib/themes'

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

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function darkenHex(hex, amount = 32) {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount)
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount)
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function applyAccent(hex) {
  const root = document.documentElement.style
  root.setProperty('--accent',        hex)
  root.setProperty('--accent-hover',  darkenHex(hex, 32))
  root.setProperty('--accent-subtle', hexToRgba(hex, 0.13))
  root.setProperty('--accent-muted',  hexToRgba(hex, 0.22))
}

export function ThemeProvider({ children }) {
  const [accentColor, setAccentColorState] = useState(
    () => localStorage.getItem('bh-accent-color') || DEFAULT_ACCENT_COLOR
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

  // Always dark
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  useEffect(() => {
    applyAccent(accentColor)
  }, [accentColor])

  useEffect(() => {
    const f = FONTS[font] ?? FONTS[DEFAULT_FONT]
    loadFont(f.url)
    document.documentElement.style.setProperty('--font', f.family)
  }, [font])

  useEffect(() => {
    document.documentElement.classList.toggle('compact', compact)
  }, [compact])

  function setAccentColor(hex) {
    setAccentColorState(hex)
    localStorage.setItem('bh-accent-color', hex)
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
        accentColor,
        setAccentColor,
        hubName,
        setHubName,
        font,
        setFont,
        compact,
        setCompact,
        palette: PALETTE,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
