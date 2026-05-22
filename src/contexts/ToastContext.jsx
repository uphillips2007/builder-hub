import { createContext, useContext, useState, useCallback } from 'react'
import { Check } from 'lucide-react'

const ToastContext = createContext(null)

function ToastStack({ toasts, dismiss }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col-reverse gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={`pointer-events-auto flex items-center gap-2.5 pl-4 pr-5 py-3 rounded-xl bg-[#1c1c1c] dark:bg-[#2e2e2e] text-white text-sm font-medium shadow-xl shadow-black/20 cursor-default select-none ${t.leaving ? 'toast-leave' : 'toast-enter'}`}
        >
          <Check size={13} strokeWidth={2.5} className="text-emerald-400 shrink-0" />
          {t.message}
        </div>
      ))}
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 220)
  }, [])

  const toast = useCallback((message) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, leaving: false }])
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
    }, 2200)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2420)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
