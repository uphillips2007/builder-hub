// "2026-05-21" → "Wednesday, May 21, 2026"
export function formatPageDate(isoDate) {
  const d = new Date(isoDate + 'T12:00:00')
  return d.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

// "2026-05-21" → "May 21, 2026"
export function formatDate(isoDate) {
  const d = new Date(isoDate + 'T12:00:00')
  return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

// ISO timestamp → "Today at 2:34 PM" / "Yesterday" / "May 21, 2026"
export function formatTimestamp(iso) {
  const d = new Date(iso)
  const todayStr = new Date().toISOString().slice(0, 10)
  const dStr = d.toISOString().slice(0, 10)
  const yStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  if (dStr === todayStr)
    return `Today at ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`
  if (dStr === yStr) return 'Yesterday'
  return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

// "2026-W21" → "May 18 – 24, 2026"
export function formatWeekRange(isoWeek) {
  const [year, w] = isoWeek.split('-W')
  const y = parseInt(year, 10)
  const weekNum = parseInt(w, 10)

  // Monday of ISO week 1 = Monday on or before Jan 4
  const jan4 = new Date(y, 0, 4)
  const jan4Day = jan4.getDay() || 7
  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - (jan4Day - 1) + (weekNum - 1) * 7)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fmt = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `${fmt(monday)} – ${fmt(sunday)}, ${year}`
}
