export default function DifficultyBadge({ score, large = false }) {
  if (score == null) return (
    <span className="inline-flex items-center font-semibold" style={{ fontSize: 12, padding: '0 8px', height: 26, borderRadius: 8, textTransform: 'uppercase', color: large ? '#fff' : 'oklch(0.59 0 0)', background: large ? 'oklch(0.59 0 0)' : 'oklch(0.59 0 0 / 0.10)' }}>
      Unknown
    </span>
  )

  const label =
    score <= 3 ? 'Easy' :
    score <= 6 ? 'Moderate' :
                 'Hard'

  const glassColor =
    score <= 3 ? 'bg-green-500/30 border-green-300/30' :
    score <= 6 ? 'bg-yellow-500/30 border-yellow-300/30' :
                 'bg-rose-500/35 border-rose-300/30'

  const solidColor = null

  const pillStyle =
    score <= 3 ? { color: 'rgb(8,149,43)', background: 'rgba(8,149,43,0.10)' } :
    score <= 6 ? { color: 'rgb(231,124,10)', background: 'rgba(231,124,10,0.10)' } :
                 { color: '#F83636', background: 'rgba(248,54,54,0.10)' }

  const largeBg =
    score <= 3 ? 'rgba(8,149,43,0.35)' :
    score <= 6 ? 'rgba(231,124,10,0.45)' :
                 'rgb(255 0 0 / 40%)'

  return large ? (
    <span className="inline-flex items-center font-semibold" style={{ fontSize: 12, padding: '0 8px', height: 26, borderRadius: 8, textTransform: 'uppercase', color: '#fff', background: largeBg, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      {label} {score}/10
    </span>
  ) : (
    <span className={`inline-flex items-center font-semibold text-[11px] min-[600px]:text-[12px] ${solidColor ?? ''}`} style={{ padding: '0 8px', height: 26, borderRadius: 8, textTransform: 'uppercase', ...pillStyle }}>
      {label} {score}/10
    </span>
  )
}
