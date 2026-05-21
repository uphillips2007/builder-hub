import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'

const LS_KEYS = {
  today:       'bh-today-entries',
  projects:    'bh-projects',
  ideas:       'bh-ideas',
  reflections: 'bh-reflections',
}
const MIGRATED_KEY = 'bh-migration-done'

function readLocalData() {
  let hasAny = false
  const out = {}
  for (const [name, key] of Object.entries(LS_KEYS)) {
    try {
      const raw = localStorage.getItem(key)
      const parsed = raw ? JSON.parse(raw) : []
      if (Array.isArray(parsed) && parsed.length > 0) {
        out[name] = parsed
        hasAny = true
      }
    } catch {}
  }
  return hasAny ? out : null
}

export default function MigrationBanner() {
  const { user } = useAuth()
  const { palette } = useTheme()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [localData, setLocalData] = useState(null)

  useEffect(() => {
    if (!user) return
    if (localStorage.getItem(MIGRATED_KEY)) return
    const data = readLocalData()
    if (!data) {
      localStorage.setItem(MIGRATED_KEY, 'true')
      return
    }
    setLocalData(data)
    setShow(true)
  }, [user])

  async function handleImport() {
    if (!localData || !user) return
    setLoading(true)

    const ops = []

    if (localData.today) {
      ops.push(
        supabase.from('today_entries').upsert(
          localData.today.map((e) => ({
            user_id: user.id,
            date: e.date,
            text: e.text,
            updated_at: new Date().toISOString(),
          })),
          { onConflict: 'user_id,date' }
        )
      )
    }

    if (localData.projects) {
      ops.push(
        supabase.from('projects').insert(
          localData.projects.map((p) => ({
            user_id: user.id,
            name: p.name,
            description: p.description || '',
            status: p.status,
            created_at: p.createdAt,
          }))
        )
      )
    }

    if (localData.ideas) {
      ops.push(
        supabase.from('ideas').insert(
          localData.ideas.map((i) => ({
            user_id: user.id,
            text: i.text,
            created_at: i.createdAt,
          }))
        )
      )
    }

    if (localData.reflections) {
      ops.push(
        supabase.from('reflections').upsert(
          localData.reflections.map((r) => ({
            user_id: user.id,
            week: r.week,
            text: r.text,
            updated_at: new Date().toISOString(),
          })),
          { onConflict: 'user_id,week' }
        )
      )
    }

    await Promise.all(ops)

    Object.values(LS_KEYS).forEach((k) => localStorage.removeItem(k))
    localStorage.setItem(MIGRATED_KEY, 'true')

    // Reload so all components re-fetch from Supabase
    window.location.reload()
  }

  function handleDismiss() {
    localStorage.setItem(MIGRATED_KEY, 'true')
    setShow(false)
  }

  if (!show) return null

  const count = Object.values(localData || {}).reduce((s, a) => s + a.length, 0)

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-4">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
          Import your local data?
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Found {count} {count === 1 ? 'item' : 'items'} saved in this browser. Import them into your account so they sync everywhere.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleImport}
            disabled={loading}
            className={`px-4 py-1.5 ${palette.button} text-white text-xs font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Importing…' : 'Import data'}
          </button>
          <button
            onClick={handleDismiss}
            disabled={loading}
            className="px-4 py-1.5 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Start fresh
          </button>
        </div>
      </div>
    </div>
  )
}
