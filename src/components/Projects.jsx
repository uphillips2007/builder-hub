import { useState, useRef, useEffect } from 'react'
import { FolderKanban, ChevronDown, Check, Pencil, X } from 'lucide-react'
import { Sk } from './Skeleton'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { formatDate } from '../lib/dates'

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
  const { user } = useAuth()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm())
  const [adding, setAdding] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const dropdownRefs = useRef({})

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('inserted_at', { ascending: false })
      if (data) setProjects(data)
      setLoading(false)
    }
    load()
  }, [user.id])

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

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    const payload = {
      user_id: user.id,
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      created_at: new Date().toISOString().slice(0, 10),
    }
    setForm(emptyForm())
    setAdding(false)
    const { data } = await supabase.from('projects').insert(payload).select().single()
    if (data) setProjects((prev) => [data, ...prev])
  }

  async function updateStatus(id, status) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
    setOpenDropdown(null)
    await supabase.from('projects').update({ status }).eq('id', id).eq('user_id', user.id)
  }

  async function deleteProject(id) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    await supabase.from('projects').delete().eq('id', id).eq('user_id', user.id)
  }

  function startEdit(project) {
    setEditingId(project.id)
    setEditForm({ name: project.name, description: project.description })
    setOpenDropdown(null)
  }

  async function saveEdit() {
    if (!editForm.name.trim()) return
    const id = editingId
    const updates = { name: editForm.name.trim(), description: editForm.description.trim() }
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
    setEditingId(null)
    await supabase.from('projects').update(updates).eq('id', id).eq('user_id', user.id)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  const inputClass = `w-full rounded-lg border border-(--input-border) bg-(--input-bg) text-gray-900 dark:text-white px-3 py-2 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors duration-150`

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Projects</h2>
          <p className="text-sm text-neutral-400 dark:text-neutral-500">
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
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1.5">
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
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1.5">
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
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1.5">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                    form.status === s
                      ? `${STATUS_BADGE[s]} border-transparent ring-2 ring-neutral-500/40`
                      : 'border-gray-200 dark:border-[#2a2a2a] text-neutral-500 dark:text-neutral-400 hover:border-gray-300 dark:hover:border-[#3a3a3a] bg-white dark:bg-[#1c1c1c]'
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
              className="px-4 py-2 text-neutral-500 dark:text-neutral-400 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-(--border) bg-(--card) pl-6 pr-5 py-4 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] shimmer" />
              <Sk className="h-4 w-44 mb-2" />
              <Sk className="h-3 w-full mb-1.5" />
              <Sk className="h-3 w-1/2 mb-3" />
              <Sk className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 && !adding ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderKanban size={36} strokeWidth={1} className="text-gray-200 dark:text-gray-700 mb-3" />
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">No projects yet</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-600">Add your first project to start tracking.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="rounded-xl border border-(--border) bg-(--card) pl-6 pr-5 py-4 shadow-sm dark:shadow-none hover:border-(--border-hover) hover:shadow-md transition-all duration-200 group relative overflow-hidden"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${STATUS_DOT[project.status]}`} />
              {editingId === project.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Escape' && cancelEdit()}
                    placeholder="Project name"
                    autoFocus
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Escape' && cancelEdit()}
                    placeholder="Description (optional)"
                    className={inputClass}
                  />
                  <div className="flex gap-2 pt-1">
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
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-snug">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-2.5">
                      Added {formatDate(project.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
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
                        <div className="absolute right-0 top-full mt-1.5 z-20 min-w-[130px] rounded-xl border border-(--border-hover) bg-(--input-bg) shadow-xl py-1.5 overflow-hidden">
                          {STATUS_OPTIONS.map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(project.id, s)}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors duration-100 ${
                                s === project.status
                                  ? STATUS_BADGE[s]
                                  : `text-neutral-600 dark:text-neutral-400 ${STATUS_OPTION_HOVER[s]}`
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[s]}`} />
                              {s}
                              {s === project.status && <Check size={11} strokeWidth={2.5} className="ml-auto" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={() => startEdit(project)}
                        className="text-neutral-400 dark:text-neutral-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-150"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        aria-label="Delete project"
                        className="text-neutral-400 dark:text-neutral-600 hover:text-red-400 dark:hover:text-red-500 transition-colors duration-150"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}



