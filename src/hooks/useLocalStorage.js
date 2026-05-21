import { useState } from 'react'

// Reads from localStorage on first render, then keeps React state in sync.
// Every time you call setState, it also writes the new value to localStorage.
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  function setAndPersist(next) {
    const resolved = typeof next === 'function' ? next(value) : next
    setValue(resolved)
    localStorage.setItem(key, JSON.stringify(resolved))
  }

  return [value, setAndPersist]
}
