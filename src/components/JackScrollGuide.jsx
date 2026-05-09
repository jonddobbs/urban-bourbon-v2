import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const MOOD_STYLES = {
  asleep: {
    transform: 'rotate(-13deg) translateY(10px)',
    filter: 'brightness(0.6) saturate(0.4)',
    opacity: 0.7,
  },
  awake: {
    transform: 'rotate(0deg) translateY(0px) scale(1)',
    filter: 'none',
    opacity: 1,
  },
  alert: {
    transform: 'rotate(6deg) translateY(-7px) scale(1.07)',
    filter: 'drop-shadow(0 0 10px rgba(57,255,20,0.35))',
    opacity: 1,
  },
  excited: {
    transform: 'translateY(-12px) scale(1.12)',
    filter: 'drop-shadow(0 0 18px rgba(57,255,20,0.55))',
    opacity: 1,
  },
}

export default function JackScrollGuide() {
  const [sectionMood, setSectionMood] = useState('awake')
  const [cardHovered, setCardHovered] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const observers = []

    function watch(id, onEnter, onLeave) {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? onEnter() : onLeave()),
        { threshold: 0.25 }
      )
      obs.observe(el)
      observers.push(obs)
    }

    setSectionMood('awake')

    watch('jack-asleep',
      () => setSectionMood('asleep'),
      () => setSectionMood('awake'),
    )
    watch('jack-excited',
      () => setSectionMood('excited'),
      () => setSectionMood('awake'),
    )

    // Hover delegation — listens on the document, no prop-drilling needed
    const onOver = e => { if (e.target.closest('[data-product-card]')) setCardHovered(true) }
    const onOut  = e => { if (e.target.closest('[data-product-card]')) setCardHovered(false) }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout',  onOut)

    return () => {
      observers.forEach(o => o.disconnect())
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout',  onOut)
    }
  }, [pathname])

  const mood = cardHovered ? 'alert' : sectionMood

  return (
    <div className="hidden md:block fixed bottom-5 right-5 z-40 pointer-events-none select-none">
      <div className="relative">
        <img
          src="/images/bear-nobg.png"
          alt=""
          aria-hidden="true"
          className="w-[90px] h-auto block"
          style={{
            ...MOOD_STYLES[mood],
            transition: [
              'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)',
              'filter 0.45s ease',
              'opacity 0.45s ease',
            ].join(', '),
          }}
        />
        {mood === 'asleep' && (
          <span
            className="absolute -top-2 -right-1 font-['Inter'] text-white/35 leading-none"
            style={{ fontSize: '11px', letterSpacing: '3px' }}
            aria-hidden="true"
          >
            z z z
          </span>
        )}
      </div>
    </div>
  )
}
