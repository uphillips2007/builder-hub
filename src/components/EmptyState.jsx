function EmptyState({ illustration: Illustration, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center select-none">
      <div className="mb-5 text-neutral-300 dark:text-neutral-700">
        <Illustration />
      </div>
      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5">{title}</p>
      <p className="text-xs text-neutral-400 dark:text-neutral-600 max-w-[200px] leading-relaxed">{description}</p>
    </div>
  )
}

/* Open notebook — left page filled, right page blank with dashed lines */
function JournalIllustration() {
  return (
    <svg width="100" height="88" viewBox="0 0 100 88" fill="none" aria-hidden="true">
      {/* Left page */}
      <rect x="6" y="14" width="42" height="58" rx="4" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1.5" />
      {/* Right page */}
      <rect x="52" y="14" width="42" height="58" rx="4" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1.5" />
      {/* Spine */}
      <line x1="49" y1="14" x2="49" y2="72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left page — solid lines (written) */}
      <line x1="14" y1="28" x2="42" y2="28" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="14" y1="36" x2="42" y2="36" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="14" y1="44" x2="36" y2="44" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="14" y1="52" x2="42" y2="52" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="14" y1="60" x2="28" y2="60" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* Right page — dashed lines (blank, waiting to be filled) */}
      <line x1="59" y1="28" x2="86" y2="28" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="4 3" opacity="0.4" />
      <line x1="59" y1="36" x2="86" y2="36" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="4 3" opacity="0.3" />
      <line x1="59" y1="44" x2="78" y2="44" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="4 3" opacity="0.22" />
      {/* Bookmark ribbon */}
      <path d="M82 14 L90 14 L90 30 L86 26 L82 30 Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

/* Three-column kanban — mirrors the real project card style with left accent bars */
function ProjectsIllustration() {
  return (
    <svg width="100" height="88" viewBox="0 0 100 88" fill="none" aria-hidden="true">
      {/* Column 1 */}
      <rect x="4" y="16" width="26" height="62" rx="4" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="16" width="26" height="10" rx="4" fill="currentColor" fillOpacity="0.14" />
      <line x1="4" y1="26" x2="30" y2="26" stroke="currentColor" strokeWidth="1" />
      {/* Cards in col 1 */}
      <rect x="8" y="31" width="18" height="12" rx="2" fill="currentColor" fillOpacity="0.14" />
      <rect x="8" y="31" width="2.5" height="12" rx="1" fill="currentColor" fillOpacity="0.5" />
      <rect x="8" y="47" width="18" height="12" rx="2" fill="currentColor" fillOpacity="0.11" />
      <rect x="8" y="47" width="2.5" height="12" rx="1" fill="currentColor" fillOpacity="0.5" />

      {/* Column 2 */}
      <rect x="37" y="16" width="26" height="62" rx="4" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" />
      <rect x="37" y="16" width="26" height="10" rx="4" fill="currentColor" fillOpacity="0.14" />
      <line x1="37" y1="26" x2="63" y2="26" stroke="currentColor" strokeWidth="1" />
      {/* Card in col 2 */}
      <rect x="41" y="31" width="18" height="12" rx="2" fill="currentColor" fillOpacity="0.12" />
      <rect x="41" y="31" width="2.5" height="12" rx="1" fill="currentColor" fillOpacity="0.5" />

      {/* Column 3 — empty */}
      <rect x="70" y="16" width="26" height="62" rx="4" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="1.5" />
      <rect x="70" y="16" width="26" height="10" rx="4" fill="currentColor" fillOpacity="0.1" />
      <line x1="70" y1="26" x2="96" y2="26" stroke="currentColor" strokeWidth="1" />
      {/* Dashed placeholder card */}
      <rect x="74" y="31" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" fill="none" opacity="0.35" />
      {/* Plus hint */}
      <line x1="83" y1="35" x2="83" y2="39" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <line x1="81" y1="37" x2="85" y2="37" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

/* Lightbulb with radiating glow lines and filament */
function IdeasIllustration() {
  return (
    <svg width="100" height="88" viewBox="0 0 100 88" fill="none" aria-hidden="true">
      {/* Glow circle */}
      <circle cx="50" cy="36" r="26" fill="currentColor" fillOpacity="0.04" />
      {/* Bulb glass */}
      <circle cx="50" cy="34" r="20" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" />
      {/* Neck / base */}
      <path d="M40 50 L40 58 Q40 65 50 66 Q60 65 60 58 L60 50 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Base lines */}
      <line x1="40" y1="66" x2="60" y2="66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="42" y1="70" x2="58" y2="70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="44" y1="74" x2="56" y2="74" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Filament */}
      <path d="M44 42 L44 32 Q50 27 56 32 L56 42" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Radiating lines */}
      <line x1="50" y1="9" x2="50" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="67" y1="14" x2="70" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="78" y1="28" x2="83" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="33" y1="14" x2="30" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="28" x2="17" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="78" y1="42" x2="83" y2="44" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
      <line x1="22" y1="42" x2="17" y2="44" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

/* Calendar with ring binders and a sparkle for weekly reflection */
function ReflectionIllustration() {
  return (
    <svg width="100" height="88" viewBox="0 0 100 88" fill="none" aria-hidden="true">
      {/* Calendar body */}
      <rect x="10" y="18" width="80" height="62" rx="5" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" />
      {/* Header bar */}
      <rect x="10" y="18" width="80" height="16" rx="5" fill="currentColor" fillOpacity="0.13" />
      <line x1="10" y1="34" x2="90" y2="34" stroke="currentColor" strokeWidth="1" />
      {/* Ring binders */}
      <line x1="30" y1="11" x2="30" y2="23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="11" x2="70" y2="23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Day dots — row 1 */}
      <circle cx="22" cy="45" r="3.5" fill="currentColor" fillOpacity="0.22" />
      <circle cx="35" cy="45" r="3.5" fill="currentColor" fillOpacity="0.22" />
      <circle cx="48" cy="45" r="3.5" fill="currentColor" fillOpacity="0.22" />
      <circle cx="61" cy="45" r="3.5" fill="currentColor" fillOpacity="0.22" />
      <circle cx="74" cy="45" r="3.5" fill="currentColor" fillOpacity="0.22" />
      {/* Day dots — row 2 */}
      <circle cx="22" cy="58" r="3.5" fill="currentColor" fillOpacity="0.15" />
      <circle cx="35" cy="58" r="3.5" fill="currentColor" fillOpacity="0.15" />
      <circle cx="48" cy="58" r="3.5" fill="currentColor" fillOpacity="0.15" />
      <circle cx="61" cy="58" r="3.5" fill="currentColor" fillOpacity="0.1" />
      {/* Day dots — row 3 partial */}
      <circle cx="22" cy="71" r="3.5" fill="currentColor" fillOpacity="0.1" />
      <circle cx="35" cy="71" r="3.5" fill="currentColor" fillOpacity="0.08" />
      {/* Sparkle / star */}
      <path d="M76 60 L78 66 L84 68 L78 70 L76 76 L74 70 L68 68 L74 66 Z" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export { EmptyState, JournalIllustration, ProjectsIllustration, IdeasIllustration, ReflectionIllustration }
