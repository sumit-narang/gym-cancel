const COLOR = (score) =>
  score <= 3 ? { text: '#16a34a', ring: '#16a34a', bg: '#dcfce7', muted: '#bbf7d0' } :
  score <= 6 ? { text: '#d97706', ring: '#d97706', bg: '#fef3c7', muted: '#fde68a' } :
               { text: '#dc2626', ring: '#dc2626', bg: '#fee2e2', muted: '#fca5a5' }

const LABEL = (score) =>
  score <= 3 ? 'Easy' : score <= 6 ? 'Moderate' : 'Hard'

// 2 — Arc ring
export function BadgeRing({ score }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>
  const c = COLOR(score)
  const r = 14, circ = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-1.5">
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
        <circle cx="18" cy="18" r={r} fill="none" stroke={c.ring} strokeWidth="3"
          strokeDasharray={`${(score / 10) * circ} ${circ}`}
          strokeLinecap="round" transform="rotate(-90 18 18)" />
        <text x="18" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill={c.text} fontFamily="Inter, sans-serif">{score}</text>
      </svg>
      <span style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>{LABEL(score)}</span>
    </div>
  )
}

// 3 — Text only
export function BadgeText({ score }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>
  const c = COLOR(score)
  return (
    <span style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>
      {LABEL(score)} · {score}/10
    </span>
  )
}

// 6 — Large number
export function BadgeNumber({ score }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>
  const c = COLOR(score)
  return (
    <div className="flex items-baseline gap-0.5">
      <span style={{ fontSize: 22, fontWeight: 700, color: c.text, lineHeight: 1 }}>{score}</span>
      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>/10</span>
    </div>
  )
}

// 7 — Segmented dots (5 dots filled proportionally)
export function BadgeDots({ score }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>
  const c = COLOR(score)
  const filled = Math.round((score / 10) * 5)
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-[3px]">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i < filled ? c.ring : '#e2e8f0',
          }} />
        ))}
      </div>
      <span style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>{LABEL(score)}</span>
    </div>
  )
}

// 8 — Thin progress bar
export function BadgeBar({ score }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>
  const c = COLOR(score)
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>{LABEL(score)}</span>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{score}/10</span>
      </div>
      <div style={{ width: 72, height: 4, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${score * 10}%`, height: '100%', background: c.ring, borderRadius: 99 }} />
      </div>
    </div>
  )
}

// 9 — Chevrons (1–3 arrows)
export function BadgeChevrons({ score }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>
  const c = COLOR(score)
  const count = score <= 3 ? 1 : score <= 6 ? 2 : 3
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: 3 }, (_, i) => (
          <svg key={i} width="10" height="12" viewBox="0 0 10 12" fill="none">
            <path d="M2 2L8 6L2 10" stroke={i < count ? c.ring : '#e2e8f0'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ))}
      </div>
      <span style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>{LABEL(score)}</span>
    </div>
  )
}

// 10 — Color block strip (no text, pure color signal)
export function BadgeColorBlock({ score }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>
  const c = COLOR(score)
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: 28, height: 6, borderRadius: 99, background: c.ring }} />
      <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{LABEL(score)} · {score}/10</span>
    </div>
  )
}

// Moderate color option A — deeper amber (amber-200 bg, amber-800 text)
export function BadgePillAmberDeep({ score }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>
  const label = score <= 3 ? 'Easy' : score <= 6 ? 'Moderate' : 'Hard'
  const color =
    score <= 3 ? 'bg-green-100 text-green-600' :
    score <= 6 ? 'bg-amber-200 text-amber-800' :
                 'bg-red-50 text-red-600'
  return (
    <span className={`inline-flex items-center font-medium ${color}`} style={{ fontSize: 12, padding: '0 8px', height: 26, borderRadius: 5 }}>
      {label} {score}/10
    </span>
  )
}

// Moderate color option B — orange shift (orange-100 bg, orange-600 text)
export function BadgePillOrangeShift({ score }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>
  const label = score <= 3 ? 'Easy' : score <= 6 ? 'Moderate' : 'Hard'
  const color =
    score <= 3 ? 'bg-green-100 text-green-600' :
    score <= 6 ? 'bg-orange-100 text-orange-600' :
                 'bg-red-50 text-red-600'
  return (
    <span className={`inline-flex items-center font-medium ${color}`} style={{ fontSize: 12, padding: '0 8px', height: 26, borderRadius: 5 }}>
      {label} {score}/10
    </span>
  )
}

// Moderate color option C — solid orange (orange-500 bg, white text)
export function BadgePillOrangeSolid({ score }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>
  const label = score <= 3 ? 'Easy' : score <= 6 ? 'Moderate' : 'Hard'
  const color =
    score <= 3 ? 'bg-green-100 text-green-600' :
    score <= 6 ? 'bg-orange-500 text-white' :
                 'bg-red-50 text-red-600'
  return (
    <span className={`inline-flex items-center font-medium ${color}`} style={{ fontSize: 12, padding: '0 8px', height: 26, borderRadius: 5 }}>
      {label} {score}/10
    </span>
  )
}

// 11 — Lock icons (1–3 locks)
export function BadgeLocks({ score }) {
  if (score == null) return <span className="text-xs text-slate-400">—</span>
  const c = COLOR(score)
  const count = score <= 3 ? 1 : score <= 6 ? 2 : 3
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 3 }, (_, i) => (
        <svg key={i} width="12" height="14" viewBox="0 0 12 14" fill="none">
          <rect x="1" y="6" width="10" height="7" rx="2" fill={i < count ? c.ring : '#e2e8f0'} />
          <path d="M3 6V4a3 3 0 016 0v2" stroke={i < count ? c.ring : '#e2e8f0'} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ))}
      <span style={{ fontSize: 12, color: c.text, fontWeight: 500, marginLeft: 4 }}>{LABEL(score)}</span>
    </div>
  )
}
