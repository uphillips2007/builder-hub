import { useState } from 'react'
import { CalendarDays, Pencil } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useTheme } from '../contexts/ThemeContext'
import { formatPageDate, formatDate } from '../lib/dates'

const TODAY_KEY = 'bh-today-entries'

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

export default function Today() {
  const { palette } = useTheme()
  const [entries, setEntries] = useLocalStorage(TODAY_KEY, [])
  const date = todayDate()

  const [text, setText] = useState(
    () => entries.find((e) => e.date === date)?.text ?? ''
  )
  const [saved, setSaved] = useState(false)

  const [editingDate, setEditingDate] = useState(null)
  const [editText, setEditText] = useState('')

  function handleSave(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setEntries((prev) => {
      const without = prev.filter((e) => e.date !== date)
      return [{ date, text: trimmed }, ...without]
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function startEdit(entry) {
    setEditingDate(entry.date)
    setEditText(entry.text)
  }

  function saveEdit() {
    const trimmed = editText.trim()
    if (!trimmed) return
    setEntries((prev) =>
      prev.map((e) => (e.date === editingDate ? { ...e, text: trimmed } : e))
    )
    setEditingDate(null)
  }

  function cancelEdit() {
    setEditingDate(null)
    setEditText('')
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))

  const inputClass = `w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-3 text-sm leading-relaxed resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-150 ${palette.ring}`

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Today</h2>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">{formatPageDate(date)}</p>

      <form onSubmit={handleSave} className="mb-10">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2.5">
          What did you build today?
        </label>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe what you built, shipped, or learned..."
          className={inputClass}
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            type="submit"
            className={`px-5 py-2 ${palette.button} text-white text-sm font-semibold rounded-lg transition-all duration-150 active:scale-95`}
          >
            Save
          </button>
          <span className={`text-sm font-medium text-green-600 dark:text-green-400 transition-opacity duration-300 ${saved ? 'opacity-100' : 'opacity-0'}`}>
            ✓ Saved
          </span>
        </div>
      </form>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CalendarDays size={36} strokeWidth={1} className="text-gray-200 dark:text-gray-700 mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">No entries yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-600">Your daily logs will appear here after you save one.</p>
        </div>
      ) : (
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
            All entries
          </p>
          <ul className="space-y-3">
            {sorted.map((entry) => (
              <li
                key={entry.date}
                className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-150 group"
              >
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                  {entry.date === date && (
                    <span className={`font-semibold ${palette.text} mr-1.5`}>Today · </span>
                  )}
                  {formatDate(entry.date)}
                </p>

                {editingDate === entry.date ? (
                  <div>
                    <textarea
                      rows={4}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Escape' && cancelEdit()}
                      autoFocus
                      className={inputClass}
                    />
                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={saveEdit}
                        className={`px-4 py-1.5 ${palette.button} text-white text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95`}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-1.5 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <p className="flex-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed min-w-0">
                      {entry.text}
                    </p>
                    <button
                      onClick={() => startEdit(entry)}
                      className="shrink-0 text-gray-300 dark:text-gray-700 hover:text-gray-500 dark:hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-150 mt-0.5"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
