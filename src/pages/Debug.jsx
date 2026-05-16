import gyms from '../policies.json'
import { BadgeRing, BadgeText, BadgeNumber, BadgeDots, BadgeBar, BadgeChevrons, BadgeColorBlock, BadgeLocks, BadgePillAmberDeep, BadgePillOrangeShift, BadgePillOrangeSolid } from '../components/DifficultyBadgeAlt.jsx'
import DifficultyBadge from '../components/DifficultyBadge.jsx'
import Squircle from '../components/Squircle.jsx'

const HOVER_VARIANTS = [
  { name: '1 — Lift',             cls: 'hover-v1' },
  { name: '2 — Scale',            cls: 'hover-v2' },
  { name: '3 — Lift + scale',     cls: 'hover-v3' },
  { name: '4 — Shadow only',      cls: 'hover-v4' },
  { name: '5 — Border ring',      cls: 'hover-v5' },
  { name: '6 — Glow warm',        cls: 'hover-v6' },
  { name: '7 — Glow cool',        cls: 'hover-v7' },
  { name: '8 — Lift subtle',      cls: 'hover-v8' },
  { name: '9 — Dark glow',        cls: 'hover-v9' },
  { name: '10 — Lift + ring',     cls: 'hover-v10' },
]

const sampleGym = gyms.find(g => g.difficulty_score === 7) || gyms[0]

function HoverDemoCard({ label, cls }) {
  const BASE = import.meta.env.BASE_URL
  const raw = sampleGym.image_urls?.[0] || sampleGym.image_url || null
  const thumb = raw ? BASE + raw.replace(/^\//, '') : null
  return (
    <div className={`hover-base ${cls} bg-white overflow-hidden cursor-pointer`}>
      <div className="w-full h-32 bg-slate-100 overflow-hidden" style={{ borderRadius: '16px 16px 0 0' }}>
        {thumb
          ? <img src={thumb} alt={sampleGym.gym_name} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-slate-200" />
        }
      </div>
      <div style={{ padding: '14px 16px' }}>
        <DifficultyBadge score={sampleGym.difficulty_score} />
        <p style={{ fontSize: 14, fontWeight: 600, marginTop: 8, color: '#000', lineHeight: '20px' }} className="truncate">{sampleGym.gym_name}</p>
        <p style={{ fontSize: 12, marginTop: 4, color: 'rgba(0,0,0,0.6)', lineHeight: '16px' }} className="line-clamp-2">{sampleGym.plain_english_summary?.[0]}</p>
      </div>
      <p className="text-center text-xs text-slate-400 pb-3 font-medium">{label}</p>
    </div>
  )
}

const SAMPLES = [
  { label: 'Easy',     score: 2 },
  { label: 'Moderate', score: 5 },
  { label: 'Hard',     score: 8 },
]

const VARIANTS = [
  { name: 'Current — Pill',         Component: ({ score }) => <DifficultyBadge score={score} /> },
  { name: '2 — Arc ring',           Component: BadgeRing },
  { name: '3 — Text only',          Component: BadgeText },
  { name: '6 — Large number',       Component: BadgeNumber },
  { name: '7 — Segmented dots',     Component: BadgeDots },
  { name: '8 — Progress bar',       Component: BadgeBar },
  { name: '9 — Chevrons',           Component: BadgeChevrons },
  { name: '10 — Color block strip', Component: BadgeColorBlock },
  { name: '11 — Lock icons',        Component: BadgeLocks },
]

const DEMO_COUNT = 136

const COUNT_VARIANTS = [
  {
    name: '1 — Current',
    render: () => <p style={{ fontSize: 14, fontWeight: 700, color: '#000', letterSpacing: '-0.3px' }}>Total {DEMO_COUNT} gym</p>,
  },
  {
    name: '2 — Number first',
    render: () => (
      <p style={{ fontSize: 14, fontWeight: 400, color: 'rgba(0,0,0,0.5)', letterSpacing: '-0.3px' }}>
        <span style={{ fontWeight: 700, color: '#000', fontSize: 15 }}>{DEMO_COUNT}</span> gyms
      </p>
    ),
  },
  {
    name: '3 — Muted prefix',
    render: () => (
      <p style={{ fontSize: 14, letterSpacing: '-0.3px' }}>
        <span style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 400 }}>Showing </span>
        <span style={{ color: '#000', fontWeight: 600 }}>{DEMO_COUNT} gyms</span>
      </p>
    ),
  },
  {
    name: '4 — Dark pill chip',
    render: () => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#000', borderRadius: 6, padding: '2px 8px', letterSpacing: '-0.2px' }}>{DEMO_COUNT}</span>
        <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.45)', letterSpacing: '-0.3px' }}>gyms</span>
      </div>
    ),
  },
  {
    name: '5 — Stacked',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Gyms</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#000', lineHeight: 1, letterSpacing: '-0.5px' }}>{DEMO_COUNT}</span>
      </div>
    ),
  },
  {
    name: '6 — Dot separator',
    render: () => (
      <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)', letterSpacing: '-0.3px' }}>
        <span style={{ fontWeight: 600, color: '#000' }}>{DEMO_COUNT}</span>
        <span style={{ margin: '0 5px' }}>·</span>
        gyms tracked
      </p>
    ),
  },
  {
    name: '7 — Monospace',
    render: () => (
      <p style={{ fontSize: 14, letterSpacing: '-0.3px' }}>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: '#000', fontSize: 15 }}>{DEMO_COUNT}</span>
        <span style={{ color: 'rgba(0,0,0,0.4)', fontWeight: 400 }}> gyms</span>
      </p>
    ),
  },
  {
    name: '8 — Ghost pill',
    render: () => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#000', background: 'rgba(0,0,0,0.07)', borderRadius: 6, padding: '2px 8px', letterSpacing: '-0.2px' }}>{DEMO_COUNT}</span>
        <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.45)', letterSpacing: '-0.3px' }}>gyms</span>
      </div>
    ),
  },
  {
    name: '9 — Sentence case',
    render: () => (
      <p style={{ fontSize: 14, fontWeight: 400, color: 'rgba(0,0,0,0.5)', letterSpacing: '-0.3px' }}>
        {DEMO_COUNT} gyms found
      </p>
    ),
  },
  {
    name: '10 — Accent number',
    render: () => (
      <p style={{ fontSize: 14, letterSpacing: '-0.3px' }}>
        <span style={{ fontWeight: 700, color: 'rgb(8,149,43)', fontSize: 15 }}>{DEMO_COUNT}</span>
        <span style={{ color: 'rgba(0,0,0,0.5)', fontWeight: 400 }}> gyms tracked</span>
      </p>
    ),
  },
]

const BASE = import.meta.env.BASE_URL

// ── Card title variant demos ─────────────────────────────────────────────────
const LONG_NAME = 'Capital Strength Weightlifting Club'
const SHORT_NAME = 'Kiwifit'
const DESC = 'No pricing, contract, or cancellation terms are publicly available on the website.'
const SCORE = 7

function TitleCard({ name, titleStyle, label }) {
  const gym = gyms.find(g => g.difficulty_score === SCORE) || gyms[0]
  const raw = gym.image_urls?.[0] || gym.image_url || null
  const thumb = raw ? BASE + raw.replace(/^\//, '') : null
  return (
    <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 0 1px rgba(66,71,76,0.32), 0 8px 48px #eee', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', height: 140, overflow: 'hidden', flexShrink: 0 }}>
        {thumb ? <img src={thumb} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: '#e2e8f0' }} />}
      </div>
      <div style={{ padding: 16, flex: 1 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#F83636', background: 'rgba(248,54,54,0.1)', borderRadius: 5, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '-0.2px' }}>Hard 7/10</span>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 10, lineHeight: '22px', letterSpacing: '-0.3px', color: '#000', ...titleStyle }}>{name}</h3>
        <p style={{ fontSize: 13, fontWeight: 400, marginTop: 6, lineHeight: '19px', color: 'rgba(0,0,0,0.6)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{DESC}</p>
      </div>
      <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textAlign: 'center', padding: '0 0 12px' }}>{label}</p>
    </div>
  )
}

const TITLE_VARIANTS = [
  {
    label: '1 — Truncate 1 line',
    style: { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
  },
  {
    label: '2 — Clamp 2 lines',
    style: { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  },
  {
    label: '3 — Clamp 2 + reserve',
    style: { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 44 },
  },
  {
    label: '4 — Smaller font if long',
    styleFn: name => name.length > 24
      ? { fontSize: 13, lineHeight: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
      : {},
  },
  {
    label: '5 — Natural wrap (no fix)',
    style: {},
  },
]

const SUMMARY_POINTS = [
  'A 12-month special offer is advertised at €399, suggesting a fixed-term annual membership.',
  'Terms & Conditions and cancellation pages are linked in the footer but return 404 errors — policy details are inaccessible.',
  'No cancellation method, notice period, or freeze policy is publicly documented on the website.',
  'Pricing is partially visible (the €399 annual offer is shown), but full membership options and contract terms are not clearly disclosed.',
]

const textStyle = { fontSize: 14, color: 'rgba(0,0,0,0.7)', lineHeight: '20px', letterSpacing: '-0.3px' }

function SummaryOption1() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {SUMMARY_POINTS.map((p, i) => <p key={i} style={textStyle}>{p}</p>)}
    </div>
  )
}

function SummaryOption2() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {SUMMARY_POINTS.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.25)', lineHeight: '20px', minWidth: 16 }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <p style={textStyle}>{p}</p>
        </div>
      ))}
    </div>
  )
}

function SummaryOption3() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {SUMMARY_POINTS.map((p, i) => (
        <div key={i} style={{ paddingLeft: 12, borderLeft: '2px solid rgba(0,0,0,0.08)' }}>
          <p style={textStyle}>{p}</p>
        </div>
      ))}
    </div>
  )
}

function SummaryOption4() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {SUMMARY_POINTS.map((p, i) => (
        <div key={i} style={{ background: 'rgba(0,0,0,0.03)', borderRadius: 8, padding: '10px 12px' }}>
          <p style={textStyle}>{p}</p>
        </div>
      ))}
    </div>
  )
}

function SummaryOption5() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {SUMMARY_POINTS.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(0,0,0,0.25)', marginTop: 7, flexShrink: 0 }} />
          <p style={textStyle}>{p}</p>
        </div>
      ))}
    </div>
  )
}

const SUMMARY_VARIANTS = [
  { name: '1 — Plain paragraphs',   Component: SummaryOption1 },
  { name: '2 — Numbered (01 02)',   Component: SummaryOption2 },
  { name: '3 — Left border accent', Component: SummaryOption3 },
  { name: '4 — Subtle cards',       Component: SummaryOption4 },
  { name: '5 — Small dot',          Component: SummaryOption5 },
]

// Pick one gym per difficulty tier for card previews
const cardSamples = [2, 5, 8].map(target =>
  gyms.find(g => g.difficulty_score === target) ||
  gyms.reduce((best, g) => Math.abs((g.difficulty_score ?? 99) - target) < Math.abs((best.difficulty_score ?? 99) - target) ? g : best)
)

function PreviewCard({ gym, BadgeComp }) {
  const raw = gym.image_urls?.[0] || gym.image_url || null
  const thumb = raw ? BASE + raw.replace(/^\//, '') : null
  return (
    <Squircle r={20} className="bg-white overflow-hidden" style={{ filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.10)) drop-shadow(0 4px 24px rgba(0,0,0,0.08))' }}>
      <div className="w-full h-36 bg-slate-100 overflow-hidden">
        {thumb
          ? <img src={thumb} alt={gym.gym_name} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-slate-200" />
        }
      </div>
      <div style={{ padding: '16px 14px' }}>
        <BadgeComp score={gym.difficulty_score} />
        <p style={{ fontSize: 14, fontWeight: 600, marginTop: 10, lineHeight: '1.3' }} className="text-slate-900">{gym.gym_name}</p>
        {gym.plain_english_summary?.[0] && (
          <p style={{ fontSize: 13, marginTop: 6, lineHeight: '1.4' }} className="text-slate-500 line-clamp-2">{gym.plain_english_summary[0]}</p>
        )}
      </div>
    </Squircle>
  )
}

export default function Debug() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-xl font-bold text-slate-900 mb-1">Card title — long name handling</h1>
      <p className="text-sm text-slate-500 mb-6">Each variant shown with a short name (Kiwifit) and a long name (Capital Strength Weightlifting Club)</p>
      <div className="grid grid-cols-5 gap-6 mb-14">
        {TITLE_VARIANTS.map(({ label, style, styleFn }) => (
          <div key={label} className="flex flex-col gap-4">
            <TitleCard name={SHORT_NAME} label={`${label} · short`} titleStyle={styleFn ? styleFn(SHORT_NAME) : style} />
            <TitleCard name={LONG_NAME}  label={`${label} · long`}  titleStyle={styleFn ? styleFn(LONG_NAME)  : style} />
          </div>
        ))}
      </div>

      <h1 className="text-xl font-bold text-slate-900 mb-1">Gym count label variants</h1>
      <p className="text-sm text-slate-500 mb-6">10 ways to display the gym count</p>
      <div className="grid grid-cols-5 gap-4 mb-14">
        {COUNT_VARIANTS.map(({ name, render }) => (
          <div key={name} className="bg-white rounded-2xl p-5 flex flex-col gap-4" style={{ boxShadow: '0 0 1px rgba(66,71,76,0.32), 0 8px 48px #eeeeee' }}>
            <p className="text-xs font-semibold text-slate-400">{name}</p>
            <div>{render()}</div>
          </div>
        ))}
      </div>

      <h1 className="text-xl font-bold text-slate-900 mb-1">Hover state variants</h1>
      <p className="text-sm text-slate-500 mb-6">Hover each card to preview the effect</p>
      <div className="grid grid-cols-5 gap-4 mb-14">
        {HOVER_VARIANTS.map(({ name, cls }) => (
          <HoverDemoCard key={cls} label={name} cls={cls} />
        ))}
      </div>

      <h1 className="text-xl font-bold text-slate-900 mb-1">Summary style variants</h1>
      <p className="text-sm text-slate-500 mb-6">5 ways to show summary points without bullet points</p>
      <div className="grid grid-cols-5 gap-4 mb-14">
        {SUMMARY_VARIANTS.map(({ name, Component }) => (
          <div key={name} className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 0 1px rgba(66,71,76,0.32), 0 8px 48px #eeeeee' }}>
            <p className="text-xs font-semibold text-slate-400 mb-4">{name}</p>
            <Component />
          </div>
        ))}
      </div>

      <h1 className="text-xl font-bold text-slate-900 mb-1">Difficulty badge variants</h1>
      <p className="text-sm text-slate-500 mb-10">Compare styles across Easy / Moderate / Hard</p>

      {/* Moderate pill color options */}
      <h2 className="text-base font-semibold text-slate-800 mb-3">Moderate pill — color options</h2>
      <Squircle r={20} className="bg-white mb-10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-5 py-3 text-slate-400 font-medium text-xs uppercase tracking-wide">Option</th>
              <th className="text-left px-5 py-3 text-slate-400 font-medium text-xs uppercase tracking-wide">Easy (2)</th>
              <th className="text-left px-5 py-3 text-slate-400 font-medium text-xs uppercase tracking-wide">Moderate (5)</th>
              <th className="text-left px-5 py-3 text-slate-400 font-medium text-xs uppercase tracking-wide">Hard (8)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="px-5 py-4 text-slate-500 font-medium">Current (amber-100)</td>
              <td className="px-5 py-4"><DifficultyBadge score={2} /></td>
              <td className="px-5 py-4"><DifficultyBadge score={5} /></td>
              <td className="px-5 py-4"><DifficultyBadge score={8} /></td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-5 py-4 text-slate-500 font-medium">A — amber-200 / amber-800</td>
              <td className="px-5 py-4"><BadgePillAmberDeep score={2} /></td>
              <td className="px-5 py-4"><BadgePillAmberDeep score={5} /></td>
              <td className="px-5 py-4"><BadgePillAmberDeep score={8} /></td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-5 py-4 text-slate-500 font-medium">B — orange-100 / orange-600</td>
              <td className="px-5 py-4"><BadgePillOrangeShift score={2} /></td>
              <td className="px-5 py-4"><BadgePillOrangeShift score={5} /></td>
              <td className="px-5 py-4"><BadgePillOrangeShift score={8} /></td>
            </tr>
            <tr>
              <td className="px-5 py-4 text-slate-500 font-medium">C — orange-500 / white (solid)</td>
              <td className="px-5 py-4"><BadgePillOrangeSolid score={2} /></td>
              <td className="px-5 py-4"><BadgePillOrangeSolid score={5} /></td>
              <td className="px-5 py-4"><BadgePillOrangeSolid score={8} /></td>
            </tr>
          </tbody>
        </table>
      </Squircle>

      {/* Badge-only comparison table */}
      <Squircle r={20} className="bg-white mb-10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-5 py-3 text-slate-400 font-medium text-xs uppercase tracking-wide">Variant</th>
              {SAMPLES.map(s => (
                <th key={s.score} className="text-left px-5 py-3 text-slate-400 font-medium text-xs uppercase tracking-wide">{s.label} ({s.score})</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VARIANTS.map(({ name, Component }) => (
              <tr key={name} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-4 text-slate-500 font-medium whitespace-nowrap">{name}</td>
                {SAMPLES.map(s => (
                  <td key={s.score} className="px-5 py-4">
                    <Component score={s.score} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Squircle>

      {/* Card previews for each variant */}
      {VARIANTS.map(({ name, Component }) => (
        <div key={name} className="mb-10">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">{name}</h2>
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            {cardSamples.map(gym => (
              <PreviewCard key={gym.gym_name} gym={gym} BadgeComp={Component} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
