import { useState } from 'react'
import { CalendarDays, FolderKanban, Lightbulb, Sparkles, Settings2 } from 'lucide-react'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import Today from './components/Today'
import Projects from './components/Projects'
import IdeaDump from './components/IdeaDump'
import WeeklyReflection from './components/WeeklyReflection'
import Settings from './components/Settings'

const NAV = [
  { id: 'today', label: 'Today', icon: CalendarDays },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'ideas', label: 'Idea Dump', icon: Lightbulb },
  { id: 'reflection', label: 'Weekly Reflection', icon: Sparkles },
]

function Layout() {
  const [active, setActive] = useState('today')
  const { palette, hubName } = useTheme()

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
        <div className="px-5 py-6 border-b border-gray-100 dark:border-gray-800">
          <span className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">
            ⚡ {hubName}
          </span>
        </div>

        <nav className="flex-1 p-2 pt-3 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={[
                'w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active === id
                  ? palette.navActive
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
              ].join(' ')}
            >
              <Icon size={15} strokeWidth={active === id ? 2 : 1.75} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setActive('settings')}
            className={[
              'w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              active === 'settings'
                ? palette.navActive
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300',
            ].join(' ')}
          >
            <Settings2 size={15} strokeWidth={active === 'settings' ? 2 : 1.75} />
            Settings
          </button>
        </div>
      </aside>

      <main className="flex-1 px-12 py-12 max-w-2xl">
        {active === 'today' && <Today />}
        {active === 'projects' && <Projects />}
        {active === 'ideas' && <IdeaDump />}
        {active === 'reflection' && <WeeklyReflection />}
        {active === 'settings' && <Settings />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  )
}
