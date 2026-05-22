import { useState, useEffect } from 'react'
import { Flame, CalendarDays, Lightbulb, FolderKanban, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { formatDate } from '../lib/dates'

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function calcStreak(entries) {
  if (!entries.length) return 0
  const dates = new Set(entries.map((e) => e.date))
  const pad = (d) => d.toISOString().slice(0, 10)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (!dates.has(pad(today)) && !dates.has(pad(yesterday))) return 0
  const start = dates.has(pad(today)) ? new Date(today) : new Date(yesterday)
  let streak = 0
  const cursor = new Date(start)
  while (dates.has(pad(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function StatCard({ label, value, icon: Icon, iconColor, iconBg, loading }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-[#1e1e1e] bg-white dark:bg-[#0f0f0f] px-4 py-4">
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${iconBg} mb-3`}>
        <Icon size={15} className={iconColor} strokeWidth={2} />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
        {loading ? <span className="text-neutral-300 dark:text-neutral-700">—</span> : value}
      </p>
      <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-0.5">{label}</p>
    </div>
  )
}

export default function Dashboard({ onNavigate }) {
  const { user } = useAuth()
  const { palette } = useTheme()

  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState([])
  const [projects, setProjects] = useState([])
  const [ideaCount, setIdeaCount] = useState(0)
  const [lastReflection, setLastReflection] = useState(null)

  useEffect(() => {
    async function load() {
      const [e, p, i, r] = await Promise.all([
        supabase.from('today_entries').select('date, text').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('projects').select('name, status').eq('user_id', user.id),
        supabase.from('ideas').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('reflections').select('week, text').eq('user_id', user.id).order('week', { ascending: false }).limit(1),
      ])
      if (e.data) setEntries(e.data)
      if (p.data) setProjects(p.data)
      if (i.count !== null) setIdeaCount(i.count)
      if (r.data?.[0]) setLastReflection(r.data[0])
      setLoading(false)
    }
    load()
  }, [user.id])

  const streak = calcStreak(entries)
  const todayEntry = entries.find((e) => e.date === todayDate())
  const activeCount = projects.filter((p) => p.status === 'active').length
  const pausedCount = projects.filter((p) => p.status === 'paused').length
  const shippedCount = projects.filter((p) => p.status === 'shipped').length

  const stats = [
    {
      label: streak === 1 ? 'day streak' : 'day streak',
      value: streak,
      icon: Flame,
      iconColor: 'text-amber-500 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      label: 'days logged',
      value: entries.length,
      icon: CalendarDays,
      iconColor: 'text-sky-500 dark:text-sky-400',
      iconBg: 'bg-sky-50 dark:bg-sky-950/30',
    },
    {
      label: 'ideas captured',
      value: ideaCount,
      icon: Lightbulb,
      iconColor: 'text-violet-500 dark:text-violet-400',
      iconBg: 'bg-violet-50 dark:bg-violet-950/30',
    },
    {
      label: 'active projects',
      value: activeCount,
      icon: FolderKanban,
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
  ]

  return (
    <div className="max-w-lg">

      {/* Greeting */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">
          {greeting()}
        </h2>
        <p className="text-sm text-neutral-400 dark:text-neutral-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </div>

      {/* Today's log */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            Today's log
          </h3>
          <button
            onClick={() => onNavigate('today')}
            className={`flex items-center gap-1 text-xs font-medium ${palette.text} hover:underline`}
          >
            {todayEntry ? 'Edit entry' : 'Log now'}
            <ArrowRight size={11} />
          </button>
        </div>
        <div className="rounded-xl border border-gray-100 dark:border-[#1e1e1e] bg-white dark:bg-[#0f0f0f] px-5 py-4">
          {loading ? (
            <p className="text-sm text-neutral-300 dark:text-neutral-700">Loading…</p>
          ) : todayEntry ? (
            <>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-3">
                {todayEntry.text}
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-2">{formatDate(todayEntry.date)}</p>
            </>
          ) : (
            <p className="text-sm text-neutral-400 dark:text-neutral-600 italic">Nothing logged yet — what did you build today?</p>
          )}
        </div>
      </section>

      {/* Projects breakdown */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            Projects
          </h3>
          <button
            onClick={() => onNavigate('projects')}
            className={`flex items-center gap-1 text-xs font-medium ${palette.text} hover:underline`}
          >
            View all
            <ArrowRight size={11} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Active', count: activeCount, color: 'text-emerald-500 dark:text-emerald-400' },
            { label: 'Paused', count: pausedCount, color: 'text-amber-500 dark:text-amber-400' },
            { label: 'Shipped', count: shippedCount, color: 'text-sky-500 dark:text-sky-400' },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className="rounded-xl border border-gray-100 dark:border-[#1e1e1e] bg-white dark:bg-[#0f0f0f] px-3 py-3 text-center"
            >
              <p className={`text-xl font-bold ${color}`}>{loading ? '—' : count}</p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-600 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Last reflection */}
      {(loading || lastReflection) && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Last reflection
            </h3>
            <button
              onClick={() => onNavigate('reflection')}
              className={`flex items-center gap-1 text-xs font-medium ${palette.text} hover:underline`}
            >
              This week
              <ArrowRight size={11} />
            </button>
          </div>
          <div className="rounded-xl border border-gray-100 dark:border-[#1e1e1e] bg-white dark:bg-[#0f0f0f] px-5 py-4">
            {loading ? (
              <p className="text-sm text-neutral-300 dark:text-neutral-700">Loading…</p>
            ) : lastReflection ? (
              <>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-2">
                  {lastReflection.text}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-2">{lastReflection.week}</p>
              </>
            ) : null}
          </div>
        </section>
      )}

    </div>
  )
}
