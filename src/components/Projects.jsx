import { useState, useRef, useEffect } from 'react'
import { FolderKanban, ChevronDown, Check } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useTheme } from '../contexts/ThemeContext'

const PROJECTS_KEY = 'bh-projects'
const STATUS_OPTIONS = ['active', 'paused', 'shipped']

const STATUS_BADGE = {
  active:  'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400',
  paused:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  shipped: 'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400',
}

const STATUS_DOT = {
  active:  'bg-green-500',
  paused:  'bg-yellow-500',
  shipped: 'bg-blue-500',
}

const STATUS_OPTION_HOVER = {
  active:  'hover:bg-green-50  dark:hover:bg-green-900/20  hover:text-green-700  dark:hover:text-green-400',
  paused:  'hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-400',
  shipped: 'hover:bg-blue-50   dark:hover:bg-blue-900/20   hover:text-blue-700   dark:hover:text-blue-400',
}

function emptyForm() {
  return { name: '', description: '', status: 'active' }
}

export default function Projects() {
  const { palette } = useTheme()
  const [projects, setProjects] = useLocalStorage(PROJECTS_KEY, [])
  const [form, setForm] = useState(emptyForm())
  const [adding, setAdding] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const dropdownRefs = useRef({})

  // Close on outside click or Escape
  useEffect(() => {
    if (!openDropdown) return
    function onMouseDown(e) {
      const el = dropdownRefs.current[openDropdown]
      if (el && !el.contains(e.target)) setOpenDropdown(null)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [openDropdown])

  function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setProjects((prev) => [
      {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ])
    setForm(emptyForm())
    setAdding(false)
  }

  function updateStatus(id, status) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
    setOpenDropdown(null)
  }

  function deleteProject(id) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  const inputClass = `w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-150 ${palette.ring}`

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Projects</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className={`px-4 py-2 ${palette.button} text-white text-sm font-semibold rounded-lg transition-all duration-150 active:scale-95`}
          >
            + Add project
          </button>
        )}
      </div>

      {adding && (
        <form
          onSubmit={handleAdd}
          className={`mb-6 rounded-xl border px-5 py-5 space-y-4 ${palette.formBorder}`}
        >
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Project name"
              autoFocus
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What are you building?"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Status
            </label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                    form.status === s
                      ? `${STATUS_BADGE[s]} border-transparent ring-2 ${palette.ring}`
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s]}`} />
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className={`px-4 py-2 ${palette.button} text-white text-sm font-semibold rounded-lg transition-all duration-150 active:scale-95`}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setForm(emptyForm()) }}
              className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {projects.length === 0 && !adding ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderKanban size={36} strokeWidth={1} className="text-gray-200 dark:text-gray-700 mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">No projects yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-600">Add your first project to start tracking.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-150 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-snug">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-2.5 font-medium tracking-wide uppercase">
                    {project.createdAt}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
                  {/* Custom status dropdown */}
                  <div
                    className="relative"
                    ref={(el) => { dropdownRefs.current[project.id] = el }}
                  >
                    <button
                      onClick={() => setOpenDropdown(openDropdown === project.id ? null : project.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${STATUS_BADGE[project.status]}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[project.status]}`} />
                      {project.status}
                      <ChevronDown
                        size={10}
                        strokeWidth={2.5}
                        className={`transition-transform duration-150 ${openDropdown === project.id ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {openDropdown === project.id && (
                      <div className="absolute right-0 top-full mt-1.5 z-20 min-w-[130px] rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl py-1.5 overflow-hidden">
                        {STATUS_OPTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(project.id, s)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors duration-100 ${
                              s === project.status
                                ? `${STATUS_BADGE[s]}`
                                : `text-gray-600 dark:text-gray-400 ${STATUS_OPTION_HOVER[s]}`
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[s]}`} />
                            {s}
                            {s === project.status && (
                              <Check size={11} strokeWidth={2.5} className="ml-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-gray-300 dark:text-gray-700 hover:text-red-400 dark:hover:text-red-500 transition-colors duration-150 text-xl leading-none opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
