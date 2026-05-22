import { useState, useEffect, useRef } from 'react'
import { LayoutDashboard, CalendarDays, FolderKanban, Lightbulb, Sparkles, Settings2, ArrowRight, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const SECTIONS = [
  { type: 'section', id: 'dashboard',  label: 'Dashboard',         icon: LayoutDashboard },
  { type: 'section', id: 'today',      label: 'Today',             icon: CalendarDays },
  { type: 'section', id: 'projects',   label: 'Projects',          icon: FolderKanban },
  { type: 'section', id: 'ideas',      label: 'Idea Dump',         icon: Lightbulb },
  { type: 'section', id: 'reflection', label: 'Weekly Reflection', icon: Sparkles },
  { type: 'section', id: 'settings',   label: 'Settings',          icon: Settings2 },
]

export default function CommandPalette({ onNavigate, onClose }) {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [projects, setProjects] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    supabase
      .from('projects')
      .select('id, name, status')
      .eq('user_id', user.id)
      .order('inserted_at', { ascending: false })
      .limit(20)
      .then(({ data }) => { if (data) setProjects(data) })
  }, [user.id])

  const projectItems = projects.map((p) => ({
    type: 'project',
    id: p.id,
    label: p.name,
    status: p.status,
    icon: FolderKanban,
  }))

  const allItems = [...SECTIONS, ...projectItems]

  const filtered = query.trim()
    ? allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : allItems

  useEffect(() => { setSelectedIndex(0) }, [query])

  function confirm(item) {
    if (item.type === 'project') {
      onNavigate('project', item.id)
    } else {
      onNavigate(item.id)
    }
    onClose()
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (filtered[selectedIndex]) confirm(filtered[selectedIndex])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const STATUS_DOT = { active: 'bg-green-500', paused: 'bg-yellow-500', shipped: 'bg-blue-500' }

  const sections = filtered.filter((i) => i.type === 'section')
  const projectResults = filtered.filter((i) => i.type === 'project')

  let cursor = 0

  function renderItem(item) {
    const index = cursor++
    const Icon = item.icon
    const active = index === selectedIndex
    return (
      <button
        key={item.type + item.id}
        onClick={() => confirm(item)}
        onMouseEnter={() => setSelectedIndex(index)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-75 ${
          active
            ? 'bg-(--accent-subtle) text-(--accent)'
            : 'text-neutral-300 hover:bg-white/5'
        }`}
      >
        <Icon size={15} strokeWidth={1.75} className="shrink-0 opacity-70" />
        <span className="flex-1 text-left font-medium">{item.label}</span>
        {item.type === 'project' && item.status && (
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[item.status] ?? 'bg-neutral-500'}`} />
        )}
        {active && <ArrowRight size={13} className="shrink-0 opacity-50" />}
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-md mx-4 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
          <Search size={15} className="text-neutral-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Go to..."
            className="flex-1 bg-transparent text-white text-sm placeholder:text-neutral-600 focus:outline-none"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-600 bg-white/5 border border-white/8">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="px-2 py-2 max-h-80 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-neutral-600">No results</p>
          )}

          {sections.length > 0 && (
            <div>
              {query.trim() === '' && (
                <p className="px-3 py-1.5 text-[10px] font-semibold text-neutral-600 uppercase tracking-widest">
                  Navigate
                </p>
              )}
              {sections.map(renderItem)}
            </div>
          )}

          {projectResults.length > 0 && (
            <div className={sections.length > 0 ? 'mt-1' : ''}>
              {query.trim() === '' && (
                <p className="px-3 py-1.5 mt-1 text-[10px] font-semibold text-neutral-600 uppercase tracking-widest">
                  Projects
                </p>
              )}
              {projectResults.map(renderItem)}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-white/8 flex items-center gap-3 text-[11px] text-neutral-600">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> open</span>
          <span><kbd className="font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
