import { useRef, useEffect } from 'react'

const PATTERN_TEXT = 'Gym '.repeat(300)

export default function HoloSticker({ size = 198, rotate = '0deg', delay = 0, icon = 'exercise.svg', iconInset = '24%', iconMode = 'mask' }) {
  const ref = useRef(null)
  const hovering = useRef(false)
  const t = useRef(Math.random() * Math.PI * 2)
  const freqX = useRef(0.5 + Math.random() * 0.6)
  const freqY = useRef(0.3 + Math.random() * 0.5)

  useEffect(() => {
    let raf

    function tick() {
      if (!hovering.current) {
        t.current += 0.006
        const x = 50 + Math.sin(t.current * freqX.current) * 28
        const y = 50 + Math.cos(t.current * freqY.current) * 22
        const el = ref.current
        if (el) {
          const xPct = (x - 50) / 50
          const yPct = (y - 50) / 50
          el.style.setProperty('--x',       `${x.toFixed(1)}%`)
          el.style.setProperty('--y',       `${y.toFixed(1)}%`)
          el.style.setProperty('--rx',      `${((y - 50) / -7).toFixed(2)}deg`)
          el.style.setProperty('--ry',      `${((x - 50) /  7).toFixed(2)}deg`)
          el.style.setProperty('--sx',      `${(xPct * -8).toFixed(2)}px`)
          el.style.setProperty('--sy',      `${(yPct *  6).toFixed(2)}px`)
          el.style.setProperty('--sweep-x', `${x.toFixed(1)}%`)
          el.style.setProperty('--o',       '0.35')
        }
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  function onMouseMove(e) {
    hovering.current = true
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top)  / rect.height - 0.5
    const gx = (xPct + 0.5) * 100
    const gy = (yPct + 0.5) * 100
    el.style.setProperty('--x',       `${gx.toFixed(1)}%`)
    el.style.setProperty('--y',       `${gy.toFixed(1)}%`)
    el.style.setProperty('--rx',      `${(yPct * -20).toFixed(2)}deg`)
    el.style.setProperty('--ry',      `${(xPct *  20).toFixed(2)}deg`)
    el.style.setProperty('--sx',      `${(xPct * -8).toFixed(2)}px`)
    el.style.setProperty('--sy',      `${(yPct *  6).toFixed(2)}px`)
    el.style.setProperty('--sweep-x', `${gx.toFixed(1)}%`)
    el.style.setProperty('--o',       '1')
  }

  function onMouseLeave() {
    hovering.current = false
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--sx', '0px')
    el.style.setProperty('--sy', '8px')
    el.style.setProperty('--o',  '0')
  }

  return (
    <div style={{
      animation: `stickerFadeIn 550ms cubic-bezier(0.22,1,0.36,1) ${delay}ms both, stickerBobIn 500ms cubic-bezier(0.34,1.35,0.64,1) ${delay}ms both`,
      transform: `rotate(${rotate})`,
      flexShrink: 0,
      perspective: '600px',
    }}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          '--x': '50%', '--y': '50%',
          '--rx': '0deg', '--ry': '0deg',
          '--sx': '0px', '--sy': '8px',
          '--sweep-x': '50%', '--o': '0.35',
          position: 'relative',
          width: size, height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'default',
          userSelect: 'none',
          boxShadow: 'var(--sx) calc(var(--sy) + 8px) 24px rgba(0,0,0,0.2)',
          background: `
            radial-gradient(circle at var(--x) var(--y),
              rgba(255,255,255,1) 0%,
              rgba(255,255,255,0.6) 15%,
              rgba(255,255,255,0) 45%
            ),
            linear-gradient(115deg,
              #ff2a54 0%, #ffbf00 15%, #22c55e 30%,
              #06b6d4 45%, #3b82f6 60%, #a855f7 75%,
              #ff2a54 90%, #ffbf00 100%
            )
          `,
          backgroundSize: '175% 175%',
          backgroundPosition: 'var(--x) var(--y)',
          transform: 'rotateX(var(--rx)) rotateY(var(--ry))',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.12s ease-out, background-position 0.5s ease-out',
        }}
      >
        {/* Gym text pattern */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          overflow: 'hidden',
          borderRadius: '50%',
          zIndex: 1,
        }}>
          <div style={{
            position: 'absolute',
            width: '180%', height: '180%',
            top: '-40%', left: '-40%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            alignContent: 'center',
            gap: '4px 12px',
            transform: 'rotate(-15deg)',
            fontSize: '0.6rem',
            fontWeight: 400,
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: 1.5,
            opacity: 0.65,
            background: `
              radial-gradient(circle at calc(100% - var(--x)) calc(100% - var(--y)),
                rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%),
              linear-gradient(295deg,
                #ffbf00 0%, #ff2a54 10%, #a855f7 25%, #3b82f6 40%,
                #06b6d4 55%, #22c55e 70%, #ffbf00 85%, #ff2a54 100%)
            `,
            backgroundSize: '150% 150%',
            backgroundPosition: 'calc(var(--x) * 0.8) calc(var(--y) * 0.8)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.15))',
          }}>
            {PATTERN_TEXT}
          </div>
        </div>

        {/* Sweep band */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          zIndex: 5,
          pointerEvents: 'none',
          background: `linear-gradient(108deg,
            transparent                      calc(var(--sweep-x) - 22%),
            rgba(255,0,120,0.55)             calc(var(--sweep-x) - 14%),
            rgba(255,160,0,0.55)             calc(var(--sweep-x) -  9%),
            rgba(255,255,0,0.55)             calc(var(--sweep-x) -  4%),
            rgba(0,255,120,0.55)             calc(var(--sweep-x)),
            rgba(0,160,255,0.55)             calc(var(--sweep-x) +  5%),
            rgba(160,0,255,0.55)             calc(var(--sweep-x) + 10%),
            transparent                      calc(var(--sweep-x) + 18%)
          )`,
          mixBlendMode: 'screen',
          opacity: 'calc(var(--o) * 0.7)',
          transition: 'opacity 0.3s ease',
        }} />

        {/* Kettlebell — hologram effect masked to kettle shape */}
        {(() => {
          const src = `${import.meta.env.BASE_URL}${icon}`
          if (iconMode === 'image') {
            return (
              <div style={{ position: 'absolute', inset: iconInset, zIndex: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
              </div>
            )
          }
          const kettleMask = {
            WebkitMaskImage: `url("${src}")`,
            maskImage: `url("${src}")`,
            WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',     maskSize: 'contain',
            WebkitMaskPosition: 'center',  maskPosition: 'center',
          }
          return (
            <div style={{ position: 'absolute', inset: iconInset, zIndex: 6 }}>
              {/* Dark silhouette base — keeps kettle shape readable */}
              <div style={{
                ...kettleMask,
                position: 'absolute', inset: 0,
                background: '#0a0a0f',
              }} />
              {/* Rainbow base */}
              <div style={{
                ...kettleMask,
                position: 'absolute', inset: 0,
                background: `
                  radial-gradient(circle at var(--x) var(--y),
                    rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 20%, rgba(255,255,255,0) 50%),
                  linear-gradient(115deg,
                    #ff2a54 0%, #ffbf00 15%, #22c55e 30%,
                    #06b6d4 45%, #3b82f6 60%, #a855f7 75%,
                    #ff2a54 90%, #ffbf00 100%)
                `,
                backgroundSize: '175% 175%',
                backgroundPosition: 'var(--x) var(--y)',
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))',
                opacity: 0.55,
                mixBlendMode: 'screen',
              }} />
              {/* Sweep shimmer */}
              <div style={{
                ...kettleMask,
                position: 'absolute', inset: 0,
                background: `linear-gradient(108deg,
                  transparent                  calc(var(--sweep-x) - 22%),
                  rgba(255,0,120,0.6)          calc(var(--sweep-x) - 14%),
                  rgba(255,160,0,0.6)          calc(var(--sweep-x) -  9%),
                  rgba(255,255,0,0.6)          calc(var(--sweep-x) -  4%),
                  rgba(0,255,120,0.6)          calc(var(--sweep-x)),
                  rgba(0,160,255,0.6)          calc(var(--sweep-x) +  5%),
                  rgba(160,0,255,0.6)          calc(var(--sweep-x) + 10%),
                  transparent                  calc(var(--sweep-x) + 18%)
                )`,
                mixBlendMode: 'screen',
                opacity: 'calc(var(--o) * 0.8)',
              }} />
              {/* Specular gloss */}
              <div style={{
                ...kettleMask,
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 30%, transparent 60%)',
                mixBlendMode: 'soft-light',
                opacity: 'calc(var(--o) * 0.9)',
              }} />
              {/* Own-color image on top, blended with multiply so SVG colors modulate the holo */}
              {iconMode === 'both' && (
                <img src={src} alt="" style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'contain',
                  mixBlendMode: 'multiply',
                  opacity: 0.75,
                }} />
              )}
            </div>
          )
        })()}

        {/* Cancel symbol */}
        <svg
          viewBox="0 0 100 100"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 7 }}
        >
          <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="5" />
          <line x1="23" y1="23" x2="77" y2="77" stroke="white" strokeWidth="5" strokeLinecap="round" />
        </svg>

      </div>
    </div>
  )
}
