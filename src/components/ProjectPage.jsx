import { useState, useEffect } from 'react'
import { ArrowLeft, Pencil, X } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'
import MarkdownContent from './MarkdownContent'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { formatTimestamp } from '../lib/dates'

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

export default function ProjectPage({ projectId, onBack }) {
  const { palette } = useTheme()
  const { user } = useAuth()
  const { toast } = useToast()

  const [project, setProject] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [preview, setPreview] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    async function load() {
      const [{ data: proj }, { data: logData }] = await Promise.all([
        supabase.from('projects').select('*').eq('id', projectId).eq('user_id', user.id).single(),
        supabase.from('project_logs').select('*').eq('project_id', projectId).eq('user_id', user.id).order('created_at', { ascending: false }),
      ])
      if (proj) setProject(proj)
      if (logData) setLogs(logData)
      setLoading(false)
    }
    load()
  }, [projectId, user.id])

  async function handleAdd(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setText('')
    setPreview(false)
    const { data } = await supabase
      .from('project_logs')
      .insert({ user_id: user.id, project_id: projectId, text: trimmed, created_at: new Date().toISOString() })
      .select()
      .single()
    if (data) {
      setLogs((prev) => [data, ...prev])
      toast('Entry logged')
    }
  }

  async function handleDelete(id) {
    setLogs((prev) => prev.filter((l) => l.id !== id))
    await supabase.from('project_logs').delete().eq('id', id).eq('user_id', user.id)
  }

  function startEdit(log) {
    setEditingId(log.id)
    setEditText(log.text)
  }

  async function saveEdit() {
    const trimmed = editText.trim()
    if (!trimmed) return
    const id = editingId
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, text: trimmed } : l)))
    setEditingId(null)
    toast('Entry updated')
    await supabase.from('project_logs').update({ text: trimmed }).eq('id', id).eq('user_id', user.id)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditText('')
  }

  const inputClass = `w-full rounded-xl border border-(--input-border) bg-(--input-bg) text-gray-900 dark:text-white px-4 py-3 text-sm leading-relaxed resize-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors duration-150`

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-150 mb-6 -ml-0.5"
      >
        <ArrowLeft size={14} />
        Projects
      </button>

      {project && (
        <div className="mb-8">
          <div className="flex items-start gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex-1 leading-tight">
              {project.name}
            </h2>
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-1 shrink-0 ${STATUS_BADGE[project.status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[project.status]}`} />
              {project.status}
            </span>
          </div>
          {project.description && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleAdd} className="mb-10">
        <div className="flex items-center justify-between mb-2.5">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Log an update
          </label>
          <div className="flex items-center gap-0.5 bg-(--hover) rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setPreview(false)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-150 ${
                !preview
                  ? 'bg-(--card) text-gray-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setPreview(true)}
              disabled={!text.trim()}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
                preview
                  ? 'bg-(--card) text-gray-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {preview ? (
          <div className="min-h-[100px] rounded-xl border border-(--input-border) bg-(--input-bg) px-4 py-3">
            <MarkdownContent content={text} />
          </div>
        ) : (
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did you work on? **bold**, `code`, - bullets"
            className={inputClass}
          />
        )}

        <div className="mt-3">
          <button
            type="submit"
            className={`px-5 py-2 ${palette.button} text-white text-sm font-semibold rounded-lg transition-all duration-150 active:scale-95`}
          >
            Log
          </button>
        </div>
      </form>

      {!loading && logs.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4">
            {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
          </p>
          <ul className="space-y-3">
            {logs.map((log, i) => (
              <li
                key={log.id}
                className="rounded-xl border border-(--border) bg-(--card) px-5 py-4 shadow-sm dark:shadow-none hover:border-(--border-hover) hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group item-enter"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {editingId === log.id ? (
                  <div>
                    <textarea
                      rows={3}
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
                        className="px-4 py-1.5 text-neutral-500 dark:text-neutral-400 text-xs font-medium rounded-lg hover:bg-(--hover) transition-colors duration-150"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <MarkdownContent content={log.text} />
                      <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-2">
                        {formatTimestamp(log.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={() => startEdit(log)}
                        className="text-neutral-400 dark:text-neutral-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-150"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(log.id)}
                        aria-label="Delete entry"
                        className="text-neutral-400 dark:text-neutral-600 hover:text-red-400 dark:hover:text-red-500 transition-colors duration-150"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && logs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-neutral-400 dark:text-neutral-600">
            No entries yet — log your first update above.
          </p>
        </div>
      )}
    </div>
  )
}
