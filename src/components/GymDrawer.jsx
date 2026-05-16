import { useEffect, useState } from 'react'
import DifficultyBadge from './DifficultyBadge.jsx'
import Squircle from './Squircle.jsx'

const DURATION = 300

export default function GymDrawer({ gym, onClose }) {
  const [closing, setClosing] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600)

  useEffect(() => {
    function onResize() { setIsMobile(window.innerWidth < 600) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function dismiss() {
    setClosing(true)
    setTimeout(onClose, DURATION)
  }

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') dismiss() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [])

  const darkPatterns = gym.dark_pattern_flags || []
  const summary = gym.plain_english_summary || []

  const base = import.meta.env.BASE_URL
  const heroImg = (gym.image_urls?.length ? gym.image_urls : gym.image_url ? [gym.image_url] : [])
    .map(u => base + u.replace(/^\//, ''))[0]

  const cancellationMethods = Array.isArray(gym.cancellation_method)
    ? gym.cancellation_method.join(', ')
    : gym.cancellation_method

  const infoRows = [
    { label: 'Pricing visible online', value: gym.pricing_visible_online != null ? (gym.pricing_visible_online ? 'Yes' : 'No') : null },
    { label: 'Monthly price',          value: gym.monthly_price ? `€${gym.monthly_price}` : null },
    { label: 'Joining fee',            value: gym.joining_fee ? `€${gym.joining_fee}` : null },
    { label: 'Contract type',          value: gym.contract_type },
    { label: 'Minimum contract',       value: gym.lock_in_months ? `${gym.lock_in_months} months` : null },
    { label: 'Auto-renewal',           value: gym.auto_renewal != null ? (gym.auto_renewal ? 'Yes' : 'No') : null },
    { label: 'Notice period',          value: gym.notice_period_days ? `${gym.notice_period_days} days` : null },
    { label: 'Cancellation method',    value: cancellationMethods },
    { label: 'In-person required',     value: gym.in_person_required != null ? (gym.in_person_required ? 'Yes' : 'No') : null },
    { label: 'Terms easily found',     value: gym.terms_easily_found != null ? (gym.terms_easily_found ? 'Yes' : 'No') : null },
    { label: 'Freeze / Pause',         value: gym.freeze_allowed != null ? (gym.freeze_allowed ? 'Yes' : 'No') : null },
    { label: 'Cooling-off period',     value: gym.cooling_off_period_days ? `${gym.cooling_off_period_days} days` : null },
  ].filter(r => r.value != null && r.value !== '')

  const animation = closing
    ? isMobile
      ? `slideDownSheet ${DURATION}ms cubic-bezier(0.32, 0.72, 0, 1) forwards`
      : `slideOutRight ${DURATION}ms cubic-bezier(0.32, 0.72, 0, 1) forwards`
    : isMobile
      ? `slideUpSheet ${DURATION}ms cubic-bezier(0.32, 0.72, 0, 1)`
      : `slideInRight ${DURATION}ms cubic-bezier(0.32, 0.72, 0, 1)`

  const backdropAnimation = closing
    ? `backdropOut ${DURATION}ms cubic-bezier(0.32, 0.72, 0, 1) forwards`
    : `backdropIn ${DURATION}ms cubic-bezier(0.32, 0.72, 0, 1)`

  const scrollableContent = (
    <>
      {/* Hero */}
      <div className="relative bg-slate-800 flex-shrink-0" style={{ height: isMobile ? 160 : 224 }}>
        {heroImg && (
          <img src={heroImg} alt={gym.gym_name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-16">
          <DifficultyBadge score={gym.difficulty_score} large />
          <h2 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: '#fff', marginTop: 8, lineHeight: '1.3' }}>{gym.gym_name}</h2>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: isMobile ? '20px 16px' : '24px 20px' }}>
        {summary.length > 0 && (
          <div className="mb-4">
            <p style={{ fontSize: isMobile ? 15 : 16, fontWeight: 600, color: 'rgb(0,0,0)', marginBottom: 12, letterSpacing: '-0.3px' }}>Summary</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {summary.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(0,0,0,0.25)', marginTop: 7, flexShrink: 0 }} />
                  <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.7)', lineHeight: '20px', letterSpacing: '-0.3px' }}>{line}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {darkPatterns.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
            {darkPatterns.map(flag => (
              <span key={flag} style={{ fontSize: 13, padding: '4px 10px', borderRadius: 10, background: 'rgba(60,60,60,0.1)', color: 'rgb(108,108,108)', fontWeight: 500, letterSpacing: '-0.2px' }}>
                {flag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {infoRows.length > 0 && (
          <>
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.10)', margin: '24px 0' }} />
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: isMobile ? 15 : 16, fontWeight: 600, color: 'rgb(0,0,0)', marginBottom: 12, letterSpacing: '-0.3px' }}>Information</p>
              <div style={{ borderRadius: 12, overflow: 'hidden', background: 'rgba(0,0,0,0.04)' }}>
                {infoRows.map((row, i) => (
                  <div key={row.label}>
                    {i > 0 && <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '0 16px' }} />}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                      <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.6)', lineHeight: '20px', letterSpacing: '-0.3px', fontWeight: 400 }}>{row.label}</span>
                      <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.9)', fontWeight: 500, marginLeft: 16, textAlign: 'right', maxWidth: '55%' }}>{row.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.10)', margin: '24px 0' }} />
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          <img src={`${import.meta.env.BASE_URL}info.svg`} alt="" style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.5, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', letterSpacing: '-0.3px', lineHeight: '18px' }}>
            {gym.data_confidence ? `Data Confidence ${gym.data_confidence}. ` : ''}Data extracted automatically. Always verify directly with the gym.
          </p>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" style={{ animation: backdropAnimation }} onClick={dismiss} />

      {isMobile ? (
        /* Mobile: sheet sized to content, capped at 75vh, scrolls when taller */
        <div
          className="fixed z-50 left-0 right-0 bottom-0 flex flex-col"
          style={{
            maxHeight: '75vh',
            borderRadius: '20px 20px 0 0',
            background: '#fff',
            overflow: 'hidden',
            animation,
            willChange: 'transform',
            filter: 'drop-shadow(0 -4px 24px rgba(0,0,0,0.12))',
          }}
        >
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
          >
            <img src={`${import.meta.env.BASE_URL}close.svg`} alt="Close" style={{ height: 12, filter: 'brightness(0) invert(1)' }} />
          </button>
          <div className="styled-scrollbar overflow-y-auto" style={{ flex: 1, minHeight: 0 }}>
            {scrollableContent}
          </div>
        </div>
      ) : (
        /* Desktop: right panel */
        <div
          className="fixed z-50"
          style={{ top: 16, right: 16, bottom: 16, width: 380, animation, willChange: 'transform', filter: 'drop-shadow(0 8px 40px rgba(0,0,0,0.18)) drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
        >
          <Squircle r={20} className="w-full h-full bg-white overflow-hidden">
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
            >
              <img src={`${import.meta.env.BASE_URL}close.svg`} alt="Close" style={{ height: 12, filter: 'brightness(0) invert(1)' }} />
            </button>
            <div className="styled-scrollbar h-full overflow-y-auto">
              {scrollableContent}
            </div>
          </Squircle>
        </div>
      )}
    </>
  )
}
