import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Returns inline style for each mood.
// Looping moods (asleep, excited, bouncing) use CSS keyframe animations.
// Static moods (awake, alert) use explicit transforms so CSS transition can spring between them.
function getMoodStyle(mood) {
  const baseTransition = 'filter 0.4s ease, opacity 0.4s ease'

  switch (mood) {
    case 'asleep':
      return {
        animation: 'jackBreathe 3.5s ease-in-out infinite',
        filter: 'brightness(0.6) saturate(0.4)',
        opacity: 0.7,
        transition: baseTransition,
      }
    case 'awake':
      return {
        animation: 'none',
        transform: 'rotate(0deg) translateY(0px) scale(1)',
        filter: 'none',
        opacity: 1,
        // Spring easing gives a slight overshoot when snapping back to idle
        transition: `transform 0.45s cubic-bezier(0.34,1.56,0.64,1), ${baseTransition}`,
      }
    case 'alert':
      return {
        animation: 'none',
        // Head tilt left + lift + scale — reads as perking up / tilting head
        transform: 'rotate(-8deg) translateY(-9px) scale(1.12)',
        filter: 'drop-shadow(0 0 12px rgba(57,255,20,0.4))',
        opacity: 1,
        transition: `transform 0.25s cubic-bezier(0.34,1.56,0.64,1), ${baseTransition}`,
      }
    case 'excited':
      return {
        animation: 'jackPoint 2.2s ease-in-out infinite',
        filter: 'drop-shadow(0 0 18px rgba(57,255,20,0.55))',
        opacity: 1,
        transition: baseTransition,
      }
    case 'bouncing':
      return {
        animation: 'jackBounce 0.7s ease-out both',
        filter: 'drop-shadow(0 0 14px rgba(57,255,20,0.5))',
        opacity: 1,
        transition: baseTransition,
      }
    default:
      return {}
  }
}

export default function JackScrollGuide() {
  const [sectionMood, setSectionMood] = useState('awake')
  const [cardHovered, setCardHovered] = useState(false)
  const [bouncing, setBouncing] = useState(false)
  // Ref prevents stale-closure double-fires on the bounce trigger
  const bouncingRef = useRef(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const observers = []

    function watch(id, onEnter, onLeave) {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? onEnter() : onLeave()),
        { threshold: 0.25 },
      )
      obs.observe(el)
      observers.push(obs)
    }

    // Reset on every route change
    setSectionMood('awake')
    setCardHovered(false)

    watch('jack-asleep',
      () => setSectionMood('asleep'),
      () => setSectionMood('awake'),
    )
    watch('jack-excited',
      () => setSectionMood('excited'),
      () => setSectionMood('awake'),
    )

    // Card hover — check relatedTarget so moving between children doesn't flicker
    const onCardOver = e => {
      if (e.target.closest('[data-product-card]')) setCardHovered(true)
    }
    const onCardOut = e => {
      const card = e.target.closest('[data-product-card]')
      if (card && !card.contains(e.relatedTarget)) setCardHovered(false)
    }

    // Add-to-bag bounce — fires once per hover entry via ref guard
    const onBagOver = e => {
      if (e.target.closest('[data-add-to-bag]') && !bouncingRef.current) {
        bouncingRef.current = true
        setBouncing(true)
      }
    }

    document.addEventListener('mouseover', onCardOver)
    document.addEventListener('mouseout',  onCardOut)
    document.addEventListener('mouseover', onBagOver)

    return () => {
      observers.forEach(o => o.disconnect())
      document.removeEventListener('mouseover', onCardOver)
      document.removeEventListener('mouseout',  onCardOut)
      document.removeEventListener('mouseover', onBagOver)
    }
  }, [pathname])

  const mood = bouncing ? 'bouncing' : cardHovered ? 'alert' : sectionMood

  function handleAnimationEnd() {
    if (mood === 'bouncing') {
      bouncingRef.current = false
      setBouncing(false)
    }
  }

  return (
    <div className="hidden md:block fixed bottom-5 right-5 z-40 pointer-events-none select-none">
      <div className="relative">
        <img
          src="/images/bear-nobg.png"
          alt=""
          aria-hidden="true"
          className="w-[90px] h-auto block"
          style={getMoodStyle(mood)}
          onAnimationEnd={handleAnimationEnd}
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
