import { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react'
import BackToTop from '../components/BackToTop.jsx'
import gyms from '../policies.json'
import GymCard from '../components/GymCard.jsx'
import GymMap from '../components/GymMap.jsx'
import HoloSticker from '../components/HoloSticker.jsx'
import DifficultyBadge from '../components/DifficultyBadge.jsx'
import GymDrawer from '../components/GymDrawer.jsx'
import Squircle from '../components/Squircle.jsx'

const VIEW_ORDER = ['list', 'grid', 'map']

const SORT_OPTIONS = [
  { value: 'difficulty_desc', label: 'Hardest to cancel' },
  { value: 'difficulty_asc', label: 'Easiest to cancel' },
]

// Merge lat/lng from gyms_with_website for map markers
// (policies.json doesn't include lat/lng, so we default to Dublin centre)
const DUBLIN_LAT = 53.3498
const DUBLIN_LNG = -6.2603

const gymsWithCoords = gyms.map(g => ({
  ...g,
  lat: g.lat ?? null,
  lng: g.lng ?? null,
}))

export default function Home() {
  const [view, setView] = useState('grid') // 'list' | 'grid' | 'map'
  const [isStuck, setIsStuck] = useState(false)
  const sentinelRef = useRef(null)
  const slideDir = useRef('right')
  const tabRefs = useRef({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const barRef = useRef(null)
  const [barHeight, setBarHeight] = useState(52)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [sheetClosing, setSheetClosing] = useState(false)

  function openSheet() { setSheetClosing(false); setFilterSheetOpen(true) }
  function closeSheet() {
    setSheetClosing(true)
    setTimeout(() => { setFilterSheetOpen(false); setSheetClosing(false) }, 280)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => setIsStuck(!e.isIntersecting), { threshold: 0 })
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!barRef.current) return
    const ro = new ResizeObserver(([entry]) => setBarHeight(entry.contentRect.height))
    ro.observe(barRef.current)
    return () => ro.disconnect()
  }, [])

  // Set initial indicator position before first paint (no flash)
  useLayoutEffect(() => {
    const btn = tabRefs.current[view]
    if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Slide indicator on tab change (runs after paint so CSS transition fires)
  useEffect(() => {
    const btn = tabRefs.current[view]
    if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, [view])

  // Recalculate indicator on resize (breakpoint changes alter button size)
  useEffect(() => {
    function onResize() {
      const btn = tabRefs.current[view]
      if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [view])

  function changeView(v) {
    slideDir.current = VIEW_ORDER.indexOf(v) > VIEW_ORDER.indexOf(view) ? 'right' : 'left'
    setView(v)
  }
  const [selectedGym, setSelectedGym] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('difficulty_desc')
  const [filterAutoRenew, setFilterAutoRenew] = useState(false)
  const [filterInPerson, setFilterInPerson] = useState(false)

  const filtered = useMemo(() => {
    let list = gymsWithCoords.filter(g =>
      g.gym_name?.toLowerCase().includes(search.toLowerCase())
    )
    if (filterAutoRenew) list = list.filter(g => g.auto_renewal === true)
    if (filterInPerson) list = list.filter(g => g.in_person_required === true)

    list.sort((a, b) => {
      if (sort === 'difficulty_desc') return (b.difficulty_score ?? -1) - (a.difficulty_score ?? -1)
      if (sort === 'difficulty_asc') return (a.difficulty_score ?? 99) - (b.difficulty_score ?? 99)
      if (sort === 'name_asc') return a.gym_name?.localeCompare(b.gym_name)
      if (sort === 'price_asc') return (a.monthly_price ?? 999) - (b.monthly_price ?? 999)
      return 0
    })
    return list
  }, [search, sort, filterAutoRenew, filterInPerson])

  return (
    <>
      {/* ── Hero ── */}
      <div className="text-center px-4 pt-6 min-[600px]:pt-10 pb-6 min-[480px]:pb-8 min-[600px]:pb-10 md:pb-[72px]">
        <div className="sticker-group flex items-center justify-center mb-6 gap-0" style={{ perspective: '800px' }}>
          <div style={{ marginRight: -24, marginTop: 24 }}>
            <HoloSticker size={109} rotate="0deg" delay={0} icon="exercise.svg" iconMode="both" iconInset="27%" />
          </div>
          <div style={{ zIndex: 1 }}>
            <HoloSticker size={147} rotate="2deg" delay={80} icon="bar.svg" iconMode="both" iconInset="24%" />
          </div>
          <div style={{ marginLeft: -24, marginTop: 20 }}>
            <HoloSticker size={116} rotate="0deg" delay={160} icon="kettle.svg" iconMode="both" iconInset="25%" />
          </div>
        </div>
        <h1 className="text-xl min-[480px]:text-2xl min-[600px]:text-3xl font-bold" style={{ color: '#000', letterSpacing: '-0.5px' }}>Cancel Gym Membership</h1>
        <p className="mt-2 text-sm min-[600px]:text-base" style={{ color: 'rgba(0,0,0,0.7)', letterSpacing: '-0.3px' }}>
          Find out how hard it is to cancel a gym membership in Dublin
        </p>
      </div>

      {/* sentinel — when scrolled past, bar becomes "stuck" */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {/* ── Sticky controls ── */}
      <div ref={barRef} className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm transition-shadow duration-200" style={{ boxShadow: isStuck ? '0 1px 0 rgba(0,0,0,0.14)' : 'none' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Showing count — 480px+ */}
          <p className="shrink-0 hidden min-[480px]:block" style={{ fontSize: 15, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
            <span style={{ color: 'rgba(0,0,0,0.45)', fontWeight: 400 }}>Showing </span>
            <span style={{ color: '#000', fontWeight: 600 }}>{filtered.length} gyms</span>
          </p>

          {/* Tabs — left on <480px, right group on 480px+, far right on desktop */}
          <div className="relative flex items-center rounded-full p-1 min-[480px]:ml-auto md:ml-0 md:order-last" style={{ background: 'rgba(0,0,0,0.05)' }}>
            <div
              className="absolute bg-white rounded-full shadow-sm"
              style={{
                left: indicator.left,
                width: indicator.width,
                top: 4,
                bottom: 4,
                transition: 'left 280ms cubic-bezier(0.32,0.72,0,1), width 280ms cubic-bezier(0.32,0.72,0,1)',
              }}
            />
            {['list', 'grid', 'map'].map(v => (
              <button
                key={v}
                ref={el => tabRefs.current[v] = el}
                onClick={() => changeView(v)}
                className={`relative z-10 px-3 min-[480px]:px-4 py-1.5 text-xs min-[480px]:text-sm font-medium rounded-full cursor-pointer transition-colors duration-[280ms] ${view === v ? 'text-black' : 'text-black/30 hover:text-black/70'}`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          {/* Desktop: search + sort */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <input
              type="text"
              placeholder="Search gyms..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-[200px] shrink-0 bg-white border border-black/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/10"
            />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-white border border-black/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/10 appearance-none pr-8 cursor-pointer"
              style={{ backgroundImage: `url("${import.meta.env.BASE_URL}arrow-down.svg")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '12px 12px' }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Filter button — mobile only, extreme right */}
          <button
            onClick={openSheet}
            className="md:hidden flex items-center justify-center cursor-pointer ml-auto min-[480px]:ml-0"
            style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,0,0,0.05)' }}
          >
            <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
              <line x1="0.75" y1="1" x2="14.25" y2="1" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2.75" y1="6" x2="12.25" y2="6" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="4.75" y1="11" x2="10.25" y2="11" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Gym listing ── */}
      <main
        key={view}
        className={`max-w-4xl mx-auto px-4 ${view === 'map' ? 'pt-0 pb-4' : 'pt-3 min-[480px]:pt-6 pb-6'}`}
        style={{ animation: `${slideDir.current === 'right' ? 'slideContentFromRight' : 'slideContentFromLeft'} 360ms cubic-bezier(0.22, 1, 0.36, 1)` }}
      >
        {/* Showing count — mobile only, above list */}
        <p className="min-[480px]:hidden mb-3" style={{ fontSize: 14, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
          <span style={{ color: 'rgba(0,0,0,0.45)', fontWeight: 400 }}>Showing </span>
          <span style={{ color: '#000', fontWeight: 600 }}>{filtered.length} gyms</span>
        </p>

        {view === 'grid' && (
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(gym => (
              <GymCard key={gym.slug || gym.gym_name} gym={gym} onSelect={setSelectedGym} />
            ))}
          </div>
        )}

        {view === 'list' && (
          <div className="flex flex-col gap-2 min-[480px]:gap-3">
            {filtered.map(gym => {
              const slug = gym.slug || gym.gym_name?.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
              const base = import.meta.env.BASE_URL
              const rawThumb = gym.image_urls?.[0] || gym.image_url || null
              const thumb = rawThumb ? base + rawThumb.replace(/^\//, '') : null
              return (
                <div
                  key={slug}
                  onClick={() => setSelectedGym(gym)}
                  className="list-card flex items-center gap-3 min-[480px]:gap-4 bg-white cursor-pointer text-slate-900 p-3 min-[480px]:p-5"
                  style={{ borderRadius: 16 }}
                >
                  <div className="w-20 h-20 min-[600px]:w-16 min-[600px]:h-16 overflow-hidden flex-shrink-0 bg-slate-100" style={{ borderRadius: 12 }}>
                    {thumb
                      ? <img src={thumb} alt={gym.gym_name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-slate-200" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between gap-[6px] min-[600px]:gap-3">
                      <div className="min-[600px]:order-last shrink-0">
                        <DifficultyBadge score={gym.difficulty_score} />
                      </div>
                      <p className="truncate text-[15px] min-[600px]:text-base" style={{ fontWeight: 600, lineHeight: '24px', letterSpacing: '-0.3px', color: '#000' }}>{gym.gym_name}</p>
                    </div>
                    {gym.plain_english_summary?.[0] && (
                      <p className="line-clamp-1 text-[14px] min-[600px]:text-sm" style={{ fontSize: 14, fontWeight: 400, marginTop: 6, lineHeight: '20px', letterSpacing: '-0.3px', color: 'rgba(0,0,0,0.7)' }}>{gym.plain_english_summary[0]}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === 'map' && (
          <Squircle r={24} className="overflow-hidden" style={{ height: `calc(100vh - ${barHeight}px - 16px)` }}>
            <GymMap gyms={filtered} onSelect={setSelectedGym} />
          </Squircle>
        )}
      </main>

    {selectedGym && (
      <GymDrawer gym={selectedGym} onClose={() => setSelectedGym(null)} />
    )}
    {view !== 'map' && <BackToTop />}

    {/* ── Filter bottom sheet (mobile) ── */}
    {filterSheetOpen && (
      <>
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.2)', animation: sheetClosing ? 'backdropOut 280ms cubic-bezier(0.32,0.72,0,1) forwards' : 'backdropIn 280ms cubic-bezier(0.32,0.72,0,1)' }}
          onClick={closeSheet}
        />
        <div
          className="fixed bottom-0 left-0 right-0 z-50 bg-white md:hidden"
          style={{
            borderRadius: '24px 24px 0 0',
            padding: '12px 20px 48px',
            animation: sheetClosing ? 'slideDownSheet 280ms cubic-bezier(0.32,0.72,0,1) forwards' : 'slideUpSheet 280ms cubic-bezier(0.32,0.72,0,1)',
          }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.10)', margin: '0 auto 28px' }} />

          <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.45)', letterSpacing: '-0.2px', marginBottom: 8 }}>Search</p>
          <input
            type="text"
            placeholder="Search gyms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 12, padding: '10px 14px', fontSize: 14, outline: 'none', marginBottom: 20, fontFamily: 'Inter, system-ui, sans-serif', color: '#000' }}
          />

          <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.45)', letterSpacing: '-0.2px', marginBottom: 8 }}>Sort by</p>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ width: '100%', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 12, padding: '10px 14px', fontSize: 14, outline: 'none', appearance: 'none', cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif', color: '#000', backgroundImage: `url("${import.meta.env.BASE_URL}arrow-down.svg")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', backgroundSize: '12px 12px' }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </>
    )}
</>
  )
}
