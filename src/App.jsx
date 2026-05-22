import { useState, useEffect } from 'react'
import { LayoutDashboard, CalendarDays, FolderKanban, Lightbulb, Sparkles, Settings2, Menu, X, Search } from 'lucide-react'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import AuthScreen from './components/auth/AuthScreen'
import CommandPalette from './components/CommandPalette'
import MigrationBanner from './components/MigrationBanner'
import RightPanel from './components/RightPanel'
import Dashboard from './components/Dashboard'
import Today from './components/Today'
import Projects from './components/Projects'
import ProjectPage from './components/ProjectPage'
import IdeaDump from './components/IdeaDump'
import WeeklyReflection from './components/WeeklyReflection'
import Settings from './components/Settings'

const NAV = [
  { id: 'dashboard',  label: 'Dashboard',         icon: LayoutDashboard },
  { id: 'today',      label: 'Today',             icon: CalendarDays },
  { id: 'projects',   label: 'Projects',          icon: FolderKanban },
  { id: 'ideas',      label: 'Idea Dump',         icon: Lightbulb },
  { id: 'reflection', label: 'Weekly Reflection', icon: Sparkles },
]

function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 56 56" className="shrink-0" aria-hidden="true">
      <rect x="0" y="0" width="56" height="56" rx="12" fill="#e11d48"/>
      <rect x="14" y="13" width="9" height="30" rx="2" fill="#ffffff"/>
      <rect x="25" y="13" width="17" height="13" rx="3" fill="#ffffff"/>
      <rect x="25" y="30" width="17" height="13" rx="3" fill="#fda4af"/>
    </svg>
  )
}

function NavItems({ active, onNavigate, palette, onPalette }) {
  return (
    <>
      <div className="px-2 pt-3 pb-1">
        <button
          onClick={onPalette}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-500 border border-(--border) hover:bg-(--hover) hover:text-neutral-400 transition-all duration-150"
        >
          <Search size={13} />
          <span className="flex-1 text-left text-xs">Go to...</span>
          <kbd className="text-[10px] font-mono opacity-60">⌘K</kbd>
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-0.5" aria-label="Main navigation">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            aria-current={active === id ? 'page' : undefined}
            className={[
              'w-full text-left flex items-center gap-2.5 px-3 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              active === id
                ? palette.navActive
                : 'text-neutral-500 dark:text-neutral-400 hover:bg-(--hover) hover:text-gray-900 dark:hover:text-neutral-100',
            ].join(' ')}
          >
            <Icon size={16} strokeWidth={active === id ? 2 : 1.75} />
            {label}
          </button>
        ))}
      </nav>

      <div className="p-2 border-t border-(--border)">
        <button
          onClick={() => onNavigate('settings')}
          aria-current={active === 'settings' ? 'page' : undefined}
          className={[
            'w-full text-left flex items-center gap-2.5 px-3 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
            active === 'settings'
              ? palette.navActive
              : 'text-neutral-400 dark:text-neutral-500 hover:bg-(--hover) hover:text-gray-700 dark:hover:text-neutral-300',
          ].join(' ')}
        >
          <Settings2 size={16} strokeWidth={active === 'settings' ? 2 : 1.75} />
          Settings
        </button>
      </div>
    </>
  )
}

function Layout() {
  const [active, setActive] = useState('dashboard')
  const [projectId, setProjectId] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const { palette, hubName } = useTheme()

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function navigate(id, pid) {
    setActive(id)
    setProjectId(pid ?? null)
    setDrawerOpen(false)
  }

  // Highlight 'projects' in nav when inside a project page
  const activeNav = active === 'project' ? 'projects' : active

  return (
    <div className="min-h-screen flex flex-col bg-(--bg) text-gray-900 dark:text-white overflow-x-hidden">

      {/* ── Mobile top bar ─────────────────────────────────── */}
      <header className="md:hidden shrink-0 flex items-center justify-between px-4 h-14 bg-(--surface) border-b border-(--border)">
        <div className="flex items-center gap-2.5 text-gray-900 dark:text-white">
            <LogoMark />
            <span className="text-sm font-semibold tracking-tight">{hubName}</span>
          </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center justify-center w-10 h-10 -mr-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-(--hover) transition-colors duration-150"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* ── Mobile drawer backdrop ──────────────────────────── */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={[
          'md:hidden fixed inset-0 z-30 bg-black/50 transition-opacity duration-200',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* ── Mobile drawer ──────────────────────────────────── */}
      <div
        className={[
          'md:hidden fixed inset-y-0 left-0 z-40 w-72 flex flex-col',
          'bg-(--surface) border-r border-(--border)',
          'transition-transform duration-200 ease-in-out',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-(--border) shrink-0">
          <div className="flex items-center gap-2.5 text-gray-900 dark:text-white">
            <LogoMark />
            <span className="text-sm font-semibold tracking-tight">{hubName}</span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-(--hover) transition-colors duration-150"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
        <NavItems active={activeNav} onNavigate={navigate} palette={palette} onPalette={() => setPaletteOpen(true)} />
      </div>

      {/* ── Desktop + content row ───────────────────────────── */}
      <div className="flex flex-1">

        <aside className="hidden md:flex md:flex-col md:w-56 shrink-0 border-r border-(--border) bg-(--surface)">
          <div className="px-5 py-6 border-b border-(--border)">
            <div className="flex items-center gap-2.5 text-gray-900 dark:text-white">
            <LogoMark />
            <span className="text-sm font-semibold tracking-tight">{hubName}</span>
          </div>
          </div>
          <NavItems active={activeNav} onNavigate={navigate} palette={palette} onPalette={() => setPaletteOpen(true)} />
        </aside>

        <main className="flex-1 min-w-0 w-full px-4 py-6 md:px-8 md:py-12">
          <div key={active === 'project' ? `project-${projectId}` : active} className="page-enter max-w-2xl mx-auto">
            {active === 'dashboard'  && <Dashboard onNavigate={navigate} />}
            {active === 'today'      && <Today />}
            {active === 'projects'   && <Projects onNavigate={navigate} />}
            {active === 'project'    && <ProjectPage projectId={projectId} onBack={() => navigate('projects')} />}
            {active === 'ideas'      && <IdeaDump />}
            {active === 'reflection' && <WeeklyReflection />}
            {active === 'settings'   && <Settings />}
          </div>
        </main>

        <aside className="hidden xl:block shrink-0 w-64 border-l border-(--border) bg-(--surface) px-5 py-8 sticky top-0 h-screen overflow-y-auto">
          <RightPanel onNavigate={navigate} />
        </aside>
      </div>

      {paletteOpen && (
        <CommandPalette onNavigate={navigate} onClose={() => setPaletteOpen(false)} />
      )}
      <MigrationBanner />
    </div>
  )
}

function AppGate() {
  const { session } = useAuth()

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-(--bg) dark:bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    )
  }

  if (!session) return <AuthScreen />

  return <Layout />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppGate />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
