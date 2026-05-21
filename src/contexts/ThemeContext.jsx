import { createContext, useContext, useEffect, useState } from 'react'
import { ACCENTS, DEFAULT_ACCENT } from '../lib/themes'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [accent, setAccentName] = useState(
    () => localStorage.getItem('bh-accent') || DEFAULT_ACCENT
  )
  const [darkMode, setDarkModeState] = useState(
    () => localStorage.getItem('bh-dark') === 'true'
  )
  const [hubName, setHubNameState] = useState(
    () => localStorage.getItem('bh-hub-name') || 'Builder Hub'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

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

  return (
    <ThemeContext.Provider
      value={{
        accent,
        setAccent,
        darkMode,
        setDarkMode,
        hubName,
        setHubName,
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
