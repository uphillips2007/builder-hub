import { useState, useEffect } from 'react'
import { Flame, Lightbulb, FolderKanban, CalendarDays } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { formatPageDate, formatTimestamp, formatWeekRange } from '../lib/dates'

function currentISOWeek() {
  const d = new Date()
  const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = utc.getUTCDay() || 7
  utc.setUTCDate(utc.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((utc - yearStart) / 86400000 + 1) / 7)
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

function calcStreak(dates) {
  const set = new Set(dates)
  const pad = (d) => d.toISOString().slice(0, 10)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (!set.has(pad(today)) && !set.has(pad(yesterday))) return 0
  const start = set.has(pad(today)) ? new Date(today) : new Date(yesterday)
  let streak = 0
  const cursor = new Date(start)
  while (set.has(pad(cursor))) { streak++; cursor.setDate(cursor.getDate() - 1) }
  return streak
}

export default function RightPanel({ onNavigate }) {
  const { user } = useAuth()
  const { palette } = useTheme()
  const [data, setData] = useState(null)

  useEffect(() => {
    async function load() {
      const [
        { data: entries },
        { count: ideasCount },
        { count: activeProjects },
        { data: latestIdea },
        { data: reflection },
      ] = await Promise.all([
        supabase.from('today_entries').select('date').eq('user_id', user.id),
        supabase.from('ideas').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active'),
        supabase.from('ideas').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('reflections').select('text').eq('user_id', user.id).eq('week', currentISOWeek()).maybeSingle(),
      ])
      setData({
        streak: calcStreak((entries || []).map((e) => e.date)),
        ideasCount: ideasCount ?? 0,
        activeProjects: activeProjects ?? 0,
        latestIdea,
        reflection,
      })
    }
    load()
  }, [user.id])

  const today = new Date().toISOString().slice(0, 10)
  const week = currentISOWeek()

  return (
    <div className="space-y-6">
      {/* Date */}
      <div>
        <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Today</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">{formatPageDate(today)}</p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{formatWeekRange(week)}</p>
      </div>

      {/* Streak */}
      {data && data.streak > 0 && (
        <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
          <Flame size={16} className="text-amber-500 dark:text-amber-400 flame-pulse shrink-0" strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {data.streak} {data.streak === 1 ? 'day' : 'day'} streak
            </p>
            <p className="text-xs text-amber-600/70 dark:text-amber-500/70">Keep it going</p>
          </div>
        </div>
      )}

      {/* Quick stats */}
      {data && (
        <div>
          <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">At a glance</p>
          <div className="space-y-2">
            <button
              onClick={() => onNavigate('ideas')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-(--border) bg-(--card) hover:border-(--border-hover) hover:bg-(--hover) transition-all duration-150 group"
            >
              <div className="flex items-center gap-2.5">
                <Lightbulb size={14} className="text-neutral-400 dark:text-neutral-500" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Ideas</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{data.ideasCount}</span>
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-(--border) bg-(--card) hover:border-(--border-hover) hover:bg-(--hover) transition-all duration-150"
            >
              <div className="flex items-center gap-2.5">
                <FolderKanban size={14} className="text-neutral-400 dark:text-neutral-500" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Active projects</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{data.activeProjects}</span>
            </button>
          </div>
        </div>
      )}

      {/* This week's reflection */}
      <div>
        <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">This week</p>
        {data?.reflection ? (
          <button
            onClick={() => onNavigate('reflection')}
            className="w-full text-left px-3.5 py-3 rounded-xl border border-(--border) bg-(--card) hover:border-(--border-hover) transition-all duration-150"
          >
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-4">
              {data.reflection.text}
            </p>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('reflection')}
            className="w-full text-left px-3.5 py-3 rounded-xl border border-dashed border-(--border-hover) hover:border-(--border) transition-all duration-150"
          >
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              No reflection this week yet
            </p>
            <p className={`text-xs font-medium mt-1 ${palette.text}`}>Write one →</p>
          </button>
        )}
      </div>

      {/* Latest idea */}
      {data?.latestIdea && (
        <div>
          <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">Latest idea</p>
          <button
            onClick={() => onNavigate('ideas')}
            className="w-full text-left px-3.5 py-3 rounded-xl border border-(--border) bg-(--card) hover:border-(--border-hover) transition-all duration-150"
          >
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-3">
              {data.latestIdea.text}
            </p>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-600 mt-2">
              {formatTimestamp(data.latestIdea.created_at)}
            </p>
          </button>
        </div>
      )}
    </div>
  )
}
