import { useRef, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { FONTS } from '../lib/themes'

export default function Settings() {
  const { accentColor, setAccentColor, hubName, setHubName, font, setFont, palette } = useTheme()
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [nameInput, setNameInput] = useState(hubName)
  const colorRef = useRef(null)

  function saveHubName(e) {
    e.preventDefault()
    const trimmed = nameInput.trim()
    if (!trimmed) return
    setHubName(trimmed)
    toast('Hub name saved')
  }

  return (
    <div className="max-w-sm">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Settings</h2>

      {/* Hub name */}
      <section className="mb-8">
        <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Hub Name
        </h3>
        <form onSubmit={saveHubName} className="flex gap-2">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="flex-1 rounded-lg border border-(--input-border) dark:border-[#2a2a2a] bg-(--input-bg) dark:bg-[#1c1c1c] text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500"
          />
          <button
            type="submit"
            className={`px-4 py-2 ${palette.button} text-white text-sm font-medium rounded-lg transition-colors`}
          >
            Save
          </button>
        </form>
      </section>

      {/* Accent color */}
      <section className="mb-8">
        <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Accent Color
        </h3>
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div
              onClick={() => colorRef.current?.click()}
              className="w-12 h-12 rounded-full cursor-pointer shadow-md ring-2 ring-white/10 transition-transform hover:scale-105"
              style={{ background: accentColor }}
            />
            <input
              ref={colorRef}
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer rounded-full"
            />
          </div>
          <div>
            <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">
              {accentColor.toUpperCase()}
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Click the circle to open color picker</p>
          </div>
        </div>
      </section>

      {/* Font */}
      <section className="mb-8">
        <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Font
        </h3>
        <div className="flex gap-2">
          {Object.entries(FONTS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setFont(key)}
              style={{ fontFamily: val.family }}
              className={`px-4 py-2 rounded-lg text-sm border transition-all duration-150 ${
                font === key
                  ? `border-transparent ${palette.button} text-white`
                  : 'border-(--input-border) dark:border-[#2a2a2a] text-neutral-600 dark:text-neutral-400 hover:bg-(--hover) bg-(--card)'
              }`}
            >
              {val.name}
            </button>
          ))}
        </div>
      </section>

      {/* Account */}
      <section className="pt-8 border-t border-(--border)">
        <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Account
        </h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-3">{user?.email}</p>
        <button
          onClick={signOut}
          className="px-4 py-2 text-sm font-medium text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Sign out
        </button>
      </section>
    </div>
  )
}
