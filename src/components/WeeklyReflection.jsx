import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { formatWeekRange } from '../lib/dates'

function currentISOWeek() {
  const d = new Date()
  const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = utc.getUTCDay() || 7
  utc.setUTCDate(utc.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((utc - yearStart) / 86400000 + 1) / 7)
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export default function WeeklyReflection() {
  const { palette } = useTheme()
  const { user } = useAuth()
  const week = currentISOWeek()

  const [reflections, setReflections] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', user.id)
        .order('week', { ascending: false })
      if (data) {
        setReflections(data)
        const current = data.find((r) => r.week === week)
        if (current) setText(current.text)
      }
      setLoading(false)
    }
    load()
  }, [user.id])

  async function handleSave(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    setReflections((prev) => {
      const without = prev.filter((r) => r.week !== week)
      return [{ week, text: trimmed, user_id: user.id }, ...without]
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)

    await supabase.from('reflections').upsert(
      { user_id: user.id, week, text: trimmed, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,week' }
    )
  }

  const past = [...reflections]
    .sort((a, b) => b.week.localeCompare(a.week))
    .filter((r) => r.week !== week)

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Weekly Reflection</h2>
      <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-8">{formatWeekRange(week)}</p>

      <form onSubmit={handleSave} className="mb-10">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2.5">
          What gave me energy this week?
        </label>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="People, problems, moments, work — anything that made you feel alive..."
          className={`w-full rounded-xl border border-(--input-border) bg-(--input-bg) text-gray-900 dark:text-white px-4 py-3 text-sm leading-relaxed resize-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors duration-150`}
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            type="submit"
            className={`px-5 py-2 ${palette.button} text-white text-sm font-semibold rounded-lg transition-all duration-150 active:scale-95`}
          >
            Save
          </button>
          <span
            className={`text-sm font-medium text-green-600 dark:text-green-400 transition-opacity duration-300 ${saved ? 'opacity-100' : 'opacity-0'}`}
          >
            ✓ Saved
          </span>
        </div>
      </form>

      {loading ? (
        <div className="py-8 text-center text-sm text-neutral-400 dark:text-neutral-600">Loading…</div>
      ) : past.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Sparkles size={36} strokeWidth={1} className="text-gray-200 dark:text-gray-700 mb-3" />
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">No past reflections yet</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-600">Previous weeks will appear here after you save them.</p>
        </div>
      ) : (
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4">
            Previous weeks
          </p>
          <ul className="space-y-3">
            {past.map((r) => (
              <li
                key={r.week}
                className="rounded-xl border border-(--border) bg-(--card) px-5 py-4 shadow-sm dark:shadow-none hover:border-(--border-hover) hover:shadow-md transition-all duration-200"
              >
                <p className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mb-2">
                  {formatWeekRange(r.week)}
                </p>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


