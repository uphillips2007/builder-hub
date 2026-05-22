// Palette uses CSS custom properties set dynamically in ThemeContext.
// All class strings must be complete literals for Tailwind v4 to include them.
export const PALETTE = {
  button:     'bg-(--accent) hover:bg-(--accent-hover)',
  navActive:  'bg-(--accent-subtle) text-(--accent)',
  text:       'text-(--accent)',
  formBorder: 'border-(--accent-muted) bg-(--accent-subtle)',
}

export const FONTS = {
  'dm-sans':        { name: 'DM Sans', family: "'DM Sans', system-ui, sans-serif",  url: null },
  'jetbrains-mono': { name: 'Mono',    family: "'JetBrains Mono', monospace",        url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap' },
}

export const DEFAULT_FONT         = 'dm-sans'
export const DEFAULT_ACCENT_COLOR = '#e11d48'
