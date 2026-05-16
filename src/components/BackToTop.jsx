import { useState, useEffect, useRef } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const lastY = useRef(window.scrollY)

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY
      const threshold = window.innerHeight * 0.3
      const scrollingUp = currentY < lastY.current
      setVisible(currentY > threshold && scrollingUp)
      lastY.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0px' : '16px'})`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
        zIndex: 50,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: '-0.2px',
        padding: '4px 14px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(10,10,10,0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#fff',
        cursor: 'pointer',
        boxShadow: '0 2px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.08)',
        whiteSpace: 'nowrap',
      }}
    >
      Back to top
    </button>
  )
}
