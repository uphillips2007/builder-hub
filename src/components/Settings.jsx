import { useState } from 'react'
import { Sun, Moon, AlignJustify, Maximize2 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { ACCENTS, FONTS } from '../lib/themes'

export default function Settings() {
  const { accent, setAccent, darkMode, setDarkMode, hubName, setHubName, font, setFont, compact, setCompact, palette } = useTheme()
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [nameInput, setNameInput] = useState(hubName)

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

      {/* Appearance */}
      <section className="mb-8">
        <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Appearance
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setDarkMode(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              !darkMode
                ? `border-transparent ${palette.button} text-white`
                : 'border-(--input-border) dark:border-[#2a2a2a] text-neutral-600 dark:text-neutral-400 hover:bg-(--hover)'
            }`}
          >
            <Sun size={14} />
            Light
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              darkMode
                ? `border-transparent ${palette.button} text-white`
                : 'border-(--input-border) dark:border-[#2a2a2a] text-neutral-600 dark:text-neutral-400 hover:bg-(--hover)'
            }`}
          >
            <Moon size={14} />
            Dark
          </button>
        </div>
      </section>

      {/* Accent color */}
      <section className="mb-8">
        <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Accent Color
        </h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(ACCENTS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setAccent(key)}
              title={val.name}
              style={{
                backgroundColor: val.swatch,
                boxShadow:
                  accent === key
                    ? `0 0 0 2px ${darkMode ? '#030712' : '#f9fafb'}, 0 0 0 4px ${val.swatch}`
                    : undefined,
                transform: accent === key ? 'scale(1.15)' : undefined,
              }}
              className="w-7 h-7 rounded-full transition-all hover:scale-110 cursor-pointer"
            />
          ))}
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-3">
          {ACCENTS[accent]?.name}
        </p>
      </section>

      {/* Font */}
      <section className="mb-8">
        <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Font
        </h3>
        <div className="flex flex-wrap gap-2">
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

      {/* Density */}
      <section className="mb-8">
        <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Density
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCompact(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              !compact
                ? `border-transparent ${palette.button} text-white`
                : 'border-(--input-border) dark:border-[#2a2a2a] text-neutral-600 dark:text-neutral-400 hover:bg-(--hover)'
            }`}
          >
            <Maximize2 size={14} />
            Comfortable
          </button>
          <button
            onClick={() => setCompact(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              compact
                ? `border-transparent ${palette.button} text-white`
                : 'border-(--input-border) dark:border-[#2a2a2a] text-neutral-600 dark:text-neutral-400 hover:bg-(--hover)'
            }`}
          >
            <AlignJustify size={14} />
            Compact
          </button>
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
