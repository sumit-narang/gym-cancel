import { useState } from 'react'
import DifficultyBadge from './DifficultyBadge.jsx'
import Squircle from './Squircle.jsx'

const MAP_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
  </svg>
)

const WEB_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M10 .5a9.5 9.5 0 100 19A9.5 9.5 0 0010 .5zM2.6 10.9a7.98 7.98 0 011.1-3.1C4.6 6.4 6.1 5.3 7.8 5c-.2.7-.3 1.5-.3 2.3 0 1.8.5 3.5 1.3 4.8H4.1c-.5-.6-.9-1.3-1.1-2.1-.1-.4-.2-.7-.4-1.1zm1.5 2.7H8c.5 1 1.2 1.9 2 2.6a7.99 7.99 0 01-5.9-2.6zm10.8 0a8 8 0 01-5.8 2.6c.8-.7 1.5-1.6 2-2.6h3.8zm1.5-2.7c-.2.4-.3.7-.4 1.1-.3.8-.7 1.5-1.2 2.1h-4.6c.9-1.3 1.3-3 1.3-4.8 0-.8-.1-1.6-.3-2.3 1.7.3 3.2 1.4 4.1 2.8a8 8 0 011.1 3.1z" />
  </svg>
)

const PLACEHOLDER = (
  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
    </svg>
  </div>
)

function ImageCarousel({ images, name }) {
  const [idx, setIdx] = useState(0)
  const [errored, setErrored] = useState({})

  const validImages = images.filter((_, i) => !errored[i])

  if (validImages.length === 0) return PLACEHOLDER

  function prev(e) {
    e.preventDefault()
    e.stopPropagation()
    setIdx(i => (i - 1 + validImages.length) % validImages.length)
  }
  function next(e) {
    e.preventDefault()
    e.stopPropagation()
    setIdx(i => (i + 1) % validImages.length)
  }

  const src = images[idx]
  const originalIdx = images.indexOf(src)

  return (
    <div className="relative w-full h-full group">
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setErrored(e => ({ ...e, [originalIdx]: true }))}
      />
      {validImages.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
          >
            ›
          </button>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
            {validImages.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function GymCard({ gym, onSelect }) {
  const base = import.meta.env.BASE_URL
  const toUrl = p => base + p.replace(/^\//, '')
  const images = gym.image_urls?.length
    ? gym.image_urls.map(toUrl)
    : gym.image_url
      ? [toUrl(gym.image_url)]
      : []

  return (
    <div className="grid-card" style={{ borderRadius: 28 }}>
    <Squircle
      r={28}
      onClick={() => onSelect(gym)}
      className="block bg-white no-underline overflow-hidden cursor-pointer"
    >
      {/* Hero image — clean, no overlays */}
      <div className="w-full h-44 min-[420px]:h-[148px] min-[600px]:h-44 overflow-hidden">
        {images[0]
          ? <img src={images[0]} alt={gym.gym_name} className="w-full h-full object-cover" />
          : PLACEHOLDER
        }
      </div>

      <div className="p-5 min-[420px]:p-4 min-[600px]:p-5">
        <DifficultyBadge score={gym.difficulty_score} />
        <h3 className="text-[15px] min-[600px]:text-base" style={{ fontWeight: 600, marginTop: 12, lineHeight: '24px', letterSpacing: '-0.3px', color: '#000', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{gym.gym_name}</h3>
        {gym.plain_english_summary?.[0] && (
          <p className="line-clamp-3 text-[14px] min-[600px]:text-sm" style={{ fontWeight: 400, marginTop: 6, lineHeight: '20px', letterSpacing: '-0.3px', color: 'rgba(0,0,0,0.7)' }}>
            {gym.plain_english_summary[0]}
          </p>
        )}
      </div>
    </Squircle>
    </div>
  )
}
