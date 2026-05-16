import { useEffect, useRef, useState } from 'react'

// Bezier control-point ratio derived by matching the superellipse at its 45° parameter.
// n=4 gives Apple's squircle (smooth continuous curvature into the side).
function buildSquirclePath(w, h, r, n = 4) {
  const cr = Math.min(r, w / 2, h / 2)
  if (cr === 0) return `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`
  const f  = Math.pow(Math.SQRT1_2, 2 / n)
  const k  = Math.min((f - 0.5) / 0.375, 1)
  const kc = cr * k
  const p  = v => v.toFixed(2)
  return [
    `M ${p(cr)} 0`,
    `L ${p(w - cr)} 0`,
    `C ${p(w - cr + kc)} 0 ${p(w)} ${p(cr - kc)} ${p(w)} ${p(cr)}`,
    `L ${p(w)} ${p(h - cr)}`,
    `C ${p(w)} ${p(h - cr + kc)} ${p(w - cr + kc)} ${p(h)} ${p(w - cr)} ${p(h)}`,
    `L ${p(cr)} ${p(h)}`,
    `C ${p(cr - kc)} ${p(h)} 0 ${p(h - cr + kc)} 0 ${p(h - cr)}`,
    `L 0 ${p(cr)}`,
    `C 0 ${p(cr - kc)} ${p(cr - kc)} 0 ${p(cr)} 0`,
    `Z`,
  ].join(' ')
}

export default function Squircle({ as: Tag = 'div', r = 32, className, style, children, ...props }) {
  const ref = useRef(null)
  const [clipPath, setClipPath] = useState(undefined)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const w = el.offsetWidth, h = el.offsetHeight
      if (w > 0 && h > 0)
        setClipPath(`path("${buildSquirclePath(w, h, r)}")`)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [r])

  return (
    <Tag
      ref={ref}
      className={className}
      style={clipPath ? { ...style, clipPath, borderRadius: 0 } : style}
      {...props}
    >
      {children}
    </Tag>
  )
}
