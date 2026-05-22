import { useState, useEffect } from 'react'
import { Lightbulb, Pencil } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { formatTimestamp } from '../lib/dates'

export default function IdeaDump() {
  const { palette } = useTheme()
  const { user } = useAuth()

  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (data) setIdeas(data)
      setLoading(false)
    }
    load()
  }, [user.id])

  async function handleAdd(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    setInput('')
    const { data } = await supabase
      .from('ideas')
      .insert({ user_id: user.id, text: trimmed, created_at: new Date().toISOString() })
      .select()
      .single()
    if (data) setIdeas((prev) => [data, ...prev])
  }

  async function handleDelete(id) {
    setIdeas((prev) => prev.filter((i) => i.id !== id))
    await supabase.from('ideas').delete().eq('id', id).eq('user_id', user.id)
  }

  function startEdit(idea) {
    setEditingId(idea.id)
    setEditText(idea.text)
  }

  async function saveEdit() {
    const trimmed = editText.trim()
    if (!trimmed) return
    const id = editingId
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, text: trimmed } : i)))
    setEditingId(null)
    await supabase.from('ideas').update({ text: trimmed }).eq('id', id).eq('user_id', user.id)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditText('')
  }

  const inputClass = `w-full rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1c1c1c] text-gray-900 dark:text-white px-3 py-2 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-150 ${palette.ring}`

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Idea Dump</h2>
      <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-8">
        {ideas.length > 0 ? `${ideas.length} ${ideas.length === 1 ? 'idea' : 'ideas'}` : 'Capture anything worth remembering'}
      </p>

      <form onSubmit={handleAdd} className="flex gap-2 mb-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Drop an idea..."
          autoFocus
          className={`flex-1 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-white px-4 py-2.5 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-150 ${palette.ring}`}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className={`px-5 py-2.5 ${palette.button} disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 text-white text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95`}
        >
          Add
        </button>
      </form>

      {loading ? (
        <div className="py-8 text-center text-sm text-neutral-400 dark:text-neutral-600">Loading…</div>
      ) : ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Lightbulb size={36} strokeWidth={1} className="text-gray-200 dark:text-gray-700 mb-3" />
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Nothing here yet</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-600">Type an idea above and hit Add to capture it.</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {ideas.map((idea) => (
            <li
              key={idea.id}
              className="rounded-xl border border-gray-200 dark:border-gray-800/60 bg-white dark:bg-[#161616] px-5 py-4 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-150 group"
            >
              {editingId === idea.id ? (
                <div>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
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
                      className="px-4 py-1.5 text-neutral-500 dark:text-neutral-400 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">{idea.text}</p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1.5">{formatTimestamp(idea.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => startEdit(idea)}
                      className="text-neutral-400 dark:text-neutral-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-150"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="text-neutral-400 dark:text-neutral-600 hover:text-red-400 dark:hover:text-red-500 transition-colors duration-150 text-lg leading-none"
                      title="Delete"
                    >
                      ×
                    </button>
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

