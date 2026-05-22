// All class strings are complete literals so Tailwind v4 includes them in the build.
export const ACCENTS = {
  charcoal: {
    name: 'Charcoal',
    swatch: '#374151',
    button: 'bg-gray-900 hover:bg-black dark:bg-[#3a3a3a] dark:hover:bg-[#454545]',
    navActive: 'bg-gray-900 text-white dark:bg-[#1e1e1e] dark:text-white',
    ring: 'ring-neutral-500',
    text: 'text-gray-900 dark:text-neutral-300',
    formBorder: 'border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#111]',
  },
  indigo: {
    name: 'Indigo',
    swatch: '#6366f1',
    button: 'bg-indigo-600 hover:bg-indigo-700',
    navActive: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400',
    ring: 'focus:ring-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-400',
    formBorder: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30',
  },
  violet: {
    name: 'Violet',
    swatch: '#7c3aed',
    button: 'bg-violet-600 hover:bg-violet-700',
    navActive: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400',
    ring: 'focus:ring-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
    formBorder: 'border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30',
  },
  emerald: {
    name: 'Emerald',
    swatch: '#059669',
    button: 'bg-emerald-600 hover:bg-emerald-700',
    navActive: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
    ring: 'focus:ring-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    formBorder: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30',
  },
  rose: {
    name: 'Rose',
    swatch: '#e11d48',
    button: 'bg-rose-600 hover:bg-rose-700',
    navActive: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400',
    ring: 'focus:ring-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    formBorder: 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30',
  },
  amber: {
    name: 'Amber',
    swatch: '#d97706',
    button: 'bg-amber-600 hover:bg-amber-700',
    navActive: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
    ring: 'focus:ring-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    formBorder: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30',
  },
  sky: {
    name: 'Sky',
    swatch: '#0284c7',
    button: 'bg-sky-600 hover:bg-sky-700',
    navActive: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400',
    ring: 'focus:ring-sky-500',
    text: 'text-sky-600 dark:text-sky-400',
    formBorder: 'border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30',
  },
  teal: {
    name: 'Teal',
    swatch: '#0d9488',
    button: 'bg-teal-600 hover:bg-teal-700',
    navActive: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400',
    ring: 'focus:ring-teal-500',
    text: 'text-teal-600 dark:text-teal-400',
    formBorder: 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/30',
  },
}

export const DEFAULT_ACCENT = 'charcoal'

export const FONTS = {
  'dm-sans':        { name: 'DM Sans',        family: "'DM Sans', system-ui, sans-serif",    url: null },
  'inter':          { name: 'Inter',           family: "'Inter', system-ui, sans-serif",      url: 'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap' },
  'lora':           { name: 'Lora',            family: "'Lora', Georgia, serif",              url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap' },
  'jetbrains-mono': { name: 'Mono',            family: "'JetBrains Mono', monospace",         url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap' },
}

export const DEFAULT_FONT = 'dm-sans'
