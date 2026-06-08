import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const DUBLIN = { lng: -6.2603, lat: 53.3498 }

function markerColor(score) {
  if (score == null) return '#94a3b8'
  if (score <= 3) return 'rgb(8,149,43)'
  if (score <= 6) return 'rgb(231,124,10)'
  return '#F83636'
}

function difficultyLabel(score) {
  if (score == null) return null
  if (score <= 3) return 'Easy'
  if (score <= 6) return 'Moderate'
  return 'Hard'
}

export default function GymMap({ gyms, onSelect }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const popup = useRef(null)

  useEffect(() => {
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [DUBLIN.lng, DUBLIN.lat],
      zoom: 11,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    popup.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      anchor: 'bottom',
      offset: 20,
      className: 'dark-popup',
    })

    const validGyms = gyms.filter(g => g.lat && g.lng)

    validGyms.forEach(gym => {
      const slug = gym.slug || gym.gym_name?.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
      const color = markerColor(gym.difficulty_score)

      const el = document.createElement('div')
      el.style.cssText = 'width: 18px; height: 18px; cursor: pointer;'

      const dot = document.createElement('div')
      dot.style.cssText = `
        width: 18px; height: 18px;
        background: ${color};
        border: 2.5px solid white;
        border-radius: 50%;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        transition: transform 0.15s ease;
        transform-origin: center;
      `
      el.appendChild(dot)

      el.addEventListener('mouseenter', () => {
        dot.style.transform = 'scale(1.5)'

        const label = difficultyLabel(gym.difficulty_score)
        const rangeMax = gym.difficulty_score <= 3 ? 3 : gym.difficulty_score <= 6 ? 6 : 10
        const scoreStr = gym.difficulty_score != null ? `${gym.difficulty_score}/${rangeMax}` : ''
        const html = `
          <div style="font-family: Inter, sans-serif;">
            <div style="font-weight: 600; font-size: 15px; color: #fff; letter-spacing: -0.3px;">${gym.gym_name}</div>
            ${label ? `<div style="font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); margin-top: 2px; letter-spacing: -0.3px;">${label} · <span style="font-size: 12px; font-weight: 500;">${scoreStr}</span></div>` : ''}
          </div>
        `

        popup.current
          .setLngLat([gym.lng, gym.lat])
          .setHTML(html)
          .addTo(map.current)
      })

      el.addEventListener('mouseleave', () => {
        dot.style.transform = 'scale(1)'
        popup.current.remove()
      })

      el.addEventListener('click', () => onSelect?.(gym))

      new mapboxgl.Marker({ element: el })
        .setLngLat([gym.lng, gym.lat])
        .addTo(map.current)
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [gyms, onSelect])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-xl" />

      {/* Legend */}
      <div
        className="absolute left-4"
        style={{
          bottom: 36,
          background: '#fff',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
          borderRadius: 12,
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {[
          { label: 'Easy',     range: '0-3',  color: 'rgb(8,149,43)' },
          { label: 'Moderate', range: '4-6',  color: 'rgb(231,124,10)' },
          { label: 'Hard',     range: '7-10', color: '#F83636' },
          { label: 'Unknown',  range: 'N/A',  color: '#94a3b8' },
        ].map(({ label, range, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#1e293b', letterSpacing: '-0.3px', fontFamily: 'Inter, sans-serif', fontWeight: 500, flex: 1 }}>{label}</span>
            <span style={{ fontSize: 13, color: '#7E838A', letterSpacing: '-0.3px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{range}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
