function parseInline(text, baseKey = 0) {
  const parts = []
  let key = baseKey
  let i = 0
  let buf = ''

  while (i < text.length) {
    // Inline code: `code`
    if (text[i] === '`') {
      const end = text.indexOf('`', i + 1)
      if (end !== -1) {
        if (buf) { parts.push(buf); buf = '' }
        parts.push(
          <code key={key++} className="bg-(--hover) dark:bg-[#252525] text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-[0.82em] font-mono">
            {text.slice(i + 1, end)}
          </code>
        )
        i = end + 1; continue
      }
    }
    // Bold: **text**
    if (text.slice(i, i + 2) === '**') {
      const end = text.indexOf('**', i + 2)
      if (end !== -1) {
        if (buf) { parts.push(buf); buf = '' }
        parts.push(<strong key={key++} className="font-semibold text-gray-900 dark:text-white">{text.slice(i + 2, end)}</strong>)
        i = end + 2; continue
      }
    }
    // Italic: *text*
    if (text[i] === '*' && text[i + 1] !== '*') {
      const end = text.indexOf('*', i + 1)
      if (end !== -1 && text[end + 1] !== '*') {
        if (buf) { parts.push(buf); buf = '' }
        parts.push(<em key={key++} className="italic">{text.slice(i + 1, end)}</em>)
        i = end + 1; continue
      }
    }
    buf += text[i]; i++
  }
  if (buf) parts.push(buf)
  return parts
}

export default function MarkdownContent({ content, className = '' }) {
  const lines = (content || '').split('\n')
  const nodes = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block
    if (line.startsWith('```')) {
      const code = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { code.push(lines[i]); i++ }
      nodes.push(
        <pre key={`pre${i}`} className="bg-(--hover) dark:bg-[#252525] text-gray-800 dark:text-gray-200 rounded-lg px-4 py-3 text-xs font-mono overflow-x-auto mb-3 leading-relaxed whitespace-pre">
          {code.join('\n')}
        </pre>
      )
      i++; continue
    }

    // Headings
    const h3 = line.match(/^### (.+)/); if (h3) { nodes.push(<h3 key={`h${i}`} className="text-sm font-semibold mb-1 mt-2">{parseInline(h3[1])}</h3>); i++; continue }
    const h2 = line.match(/^## (.+)/);  if (h2) { nodes.push(<h2 key={`h${i}`} className="text-sm font-bold mb-1 mt-2">{parseInline(h2[1])}</h2>); i++; continue }
    const h1 = line.match(/^# (.+)/);   if (h1) { nodes.push(<h1 key={`h${i}`} className="text-base font-bold mb-1.5 mt-2">{parseInline(h1[1])}</h1>); i++; continue }

    // Blockquote
    if (line.startsWith('> ')) {
      nodes.push(
        <blockquote key={`bq${i}`} className="border-l-2 border-neutral-300 dark:border-neutral-600 pl-3 italic text-neutral-500 dark:text-neutral-400 mb-2">
          {parseInline(line.slice(2))}
        </blockquote>
      )
      i++; continue
    }

    // Unordered list — collect consecutive items
    if (/^[-*+] /.test(line)) {
      const items = []
      while (i < lines.length && /^[-*+] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+] /, '')); i++
      }
      nodes.push(
        <ul key={`ul${i}`} className="list-disc ml-5 mb-2 space-y-0.5">
          {items.map((item, j) => <li key={j} className="leading-relaxed">{parseInline(item)}</li>)}
        </ul>
      )
      continue
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, '')); i++
      }
      nodes.push(
        <ol key={`ol${i}`} className="list-decimal ml-5 mb-2 space-y-0.5">
          {items.map((item, j) => <li key={j} className="leading-relaxed">{parseInline(item)}</li>)}
        </ol>
      )
      continue
    }

    // Empty line — skip
    if (line.trim() === '') { i++; continue }

    // Paragraph
    nodes.push(
      <p key={`p${i}`} className="mb-2 last:mb-0 leading-relaxed">{parseInline(line)}</p>
    )
    i++
  }

  return (
    <div className={`text-neutral-700 dark:text-neutral-300 text-sm ${className}`}>
      {nodes}
    </div>
  )
}
