import { useState, useEffect } from 'react'
import { CalendarDays, Pencil, Flame } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { formatPageDate, formatDate } from '../lib/dates'

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

function calcStreak(entries) {
  if (!entries.length) return 0
  const dates = new Set(entries.map((e) => e.date))

  const pad = (d) => d.toISOString().slice(0, 10)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Streak is dead if neither today nor yesterday has an entry
  if (!dates.has(pad(today)) && !dates.has(pad(yesterday))) return 0

  // Start counting from today (or yesterday if today not logged yet)
  const start = dates.has(pad(today)) ? new Date(today) : new Date(yesterday)
  let streak = 0
  const cursor = new Date(start)
  while (dates.has(pad(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export default function Today() {
  const { palette } = useTheme()
  const { user } = useAuth()
  const date = todayDate()

  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const [editingDate, setEditingDate] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('today_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
      if (data) {
        setEntries(data)
        const todayEntry = data.find((e) => e.date === date)
        if (todayEntry) setText(todayEntry.text)
      }
      setLoading(false)
    }
    load()
  }, [user.id])

  async function handleSave(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    setEntries((prev) => {
      const without = prev.filter((e) => e.date !== date)
      return [{ date, text: trimmed, user_id: user.id }, ...without]
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)

    await supabase.from('today_entries').upsert(
      { user_id: user.id, date, text: trimmed, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,date' }
    )
  }

  function startEdit(entry) {
    setEditingDate(entry.date)
    setEditText(entry.text)
  }

  async function saveEdit() {
    const trimmed = editText.trim()
    if (!trimmed) return
    const d = editingDate
    setEntries((prev) => prev.map((e) => (e.date === d ? { ...e, text: trimmed } : e)))
    setEditingDate(null)
    await supabase
      .from('today_entries')
      .update({ text: trimmed, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('date', d)
  }

  function cancelEdit() {
    setEditingDate(null)
    setEditText('')
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))

  const inputClass = `w-full rounded-xl border border-[--input-border] bg-[--input-bg] text-gray-900 dark:text-white px-4 py-3 text-sm leading-relaxed resize-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors duration-150`

  const streak = calcStreak(entries)

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Today</h2>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
            <Flame size={14} className="text-amber-500 dark:text-amber-400" strokeWidth={2} />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {streak} {streak === 1 ? 'day' : 'days'}
            </span>
          </div>
        )}
      </div>
      <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-8">{formatPageDate(date)}</p>

      <form onSubmit={handleSave} className="mb-10">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2.5">
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

      {loading ? (
        <div className="py-8 text-center text-sm text-neutral-400 dark:text-neutral-600">Loading…</div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CalendarDays size={36} strokeWidth={1} className="text-gray-200 dark:text-gray-700 mb-3" />
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">No entries yet</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-600">Your daily logs will appear here after you save one.</p>
        </div>
      ) : (
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4">
            All entries
          </p>
          <ul className="space-y-3">
            {sorted.map((entry) => (
              <li
                key={entry.date}
                className="rounded-xl border border-[--border] bg-[--card] px-5 py-4 shadow-sm dark:shadow-none hover:border-[--border-hover] hover:shadow-md transition-all duration-200 group"
              >
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-2">
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
                        className="px-4 py-1.5 text-neutral-500 dark:text-neutral-400 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <p className="flex-1 text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed min-w-0">
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


