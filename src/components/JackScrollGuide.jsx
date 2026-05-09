import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const FORMSPREE_URL = 'https://formspree.io/f/xykonvan'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── Mood → inline style ──────────────────────────────────────
function getMoodStyle(mood) {
  const ft = 'filter 0.4s ease, opacity 0.4s ease'
  switch (mood) {
    case 'asleep':
      return { animation: 'jackBreathe 3.5s ease-in-out infinite', filter: 'brightness(0.6) saturate(0.4)', opacity: 0.7, transition: ft }
    case 'awake':
      return { animation: 'none', transform: 'rotate(0deg) translateY(0px) scale(1)', filter: 'none', opacity: 1, transition: `transform 0.45s cubic-bezier(0.34,1.56,0.64,1), ${ft}` }
    case 'alert':
      return { animation: 'none', transform: 'rotate(-8deg) translateY(-9px) scale(1.12)', filter: 'drop-shadow(0 0 12px rgba(57,255,20,0.4))', opacity: 1, transition: `transform 0.25s cubic-bezier(0.34,1.56,0.64,1), ${ft}` }
    case 'excited':
      return { animation: 'jackPoint 2.2s ease-in-out infinite', filter: 'drop-shadow(0 0 18px rgba(57,255,20,0.55))', opacity: 1, transition: ft }
    case 'bouncing':
      return { animation: 'jackBounce 0.7s ease-out both', filter: 'drop-shadow(0 0 14px rgba(57,255,20,0.5))', opacity: 1, transition: ft }
    case 'waving':
      return { animation: 'jackWave 1.3s ease-in-out both', filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.3))', opacity: 1, transition: ft }
    case 'looking-up':
      return { animation: 'none', transform: 'rotate(5deg) translateY(-8px) scale(1.1)', filter: 'drop-shadow(0 0 12px rgba(57,255,20,0.4))', opacity: 1, transition: `transform 0.4s cubic-bezier(0.34,1.56,0.64,1), ${ft}` }
    case 'thumbs-up':
      return { animation: 'jackThumbsUp 0.65s ease-out forwards', filter: 'drop-shadow(0 0 22px rgba(57,255,20,0.65))', opacity: 1, transition: ft }
    default:
      return {}
  }
}

// ─── Quiz recommendation engine ──────────────────────────────
function getRecommendation({ strength, sweetness, milk }) {
  if (strength === 'bold' && sweetness !== 'sweet') {
    return { blend: 'Blend #43', desc: 'Ethiopian origin. Bright, bold, and built for people who mean it.', available: true, link: '/coffee' }
  }
  if (sweetness === 'sweet' && strength === 'bold') {
    return { blend: 'Velvet Mocha', desc: 'Dark roast, chocolate and caramel. Rich and indulgent.', available: false, product: 'VELVET MOCHA' }
  }
  if (sweetness === 'sweet') {
    return { blend: 'Butterscotch Bourbon Macchiato', desc: 'Colombian origin. Butterscotch, toasted almonds, good vibes.', available: false, product: 'BUTTERSCOTCH BOURBON MACCHIATO' }
  }
  if (strength === 'light') {
    return { blend: 'Blend #12', desc: 'Single origin, small batch. A cleaner, gentler cup — coming soon.', available: false, product: 'BLEND #12' }
  }
  return { blend: 'Blend #43', desc: 'Ethiopian origin. Bright, fruity, and unlike anything you\'ve tasted.', available: true, link: '/coffee' }
}

// ─── Panel: shared styles ─────────────────────────────────────
const pill = 'w-full flex items-center gap-3 border border-[#39FF14]/30 hover:border-[#39FF14] hover:bg-[#39FF14]/5 text-white/75 hover:text-white text-left px-4 py-3 rounded-full transition-all duration-200 font-[\'Inter\'] text-sm'
const backBtn = 'text-white/30 hover:text-white/60 transition-colors text-xs self-start mb-1'
const inputCls = 'flex-1 min-w-0 bg-white/5 border border-white/10 focus:border-[#39FF14] outline-none px-3 py-2 text-white placeholder-white/20 font-[\'Inter\'] text-xs transition-colors duration-200 rounded-sm'
const notifyBtn = 'border border-[#39FF14]/50 text-[#39FF14] font-[\'Bebas_Neue\'] text-sm tracking-[2px] px-3 py-2 hover:bg-[#39FF14] hover:text-black transition-all duration-200 whitespace-nowrap disabled:opacity-40 rounded-sm'

// ─── Panel sub-views ─────────────────────────────────────────

function MenuView({ onSelect }) {
  return (
    <div className="flex flex-col gap-2">
      {[
        { id: 'quiz',   icon: '☕', label: 'Help me choose a blend' },
        { id: 'teaser', icon: '📦', label: "What's in the next drop?" },
        { id: 'origin', icon: '🌍', label: "Where's the coffee from?" },
        { id: 'brand',  icon: '❓', label: 'What is Urban Bourbon?' },
      ].map(o => (
        <button key={o.id} onClick={() => onSelect(o.id)} className={pill}>
          <span className="text-base leading-none">{o.icon}</span>
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  )
}

const QUIZ_STEPS = [
  { q: 'How do you like your coffee?', key: 'strength',
    opts: [{ v: 'light', l: 'Light & smooth' }, { v: 'medium', l: 'Medium & balanced' }, { v: 'bold', l: 'Bold & strong' }] },
  { q: 'How sweet do you go?', key: 'sweetness',
    opts: [{ v: 'none', l: 'Not at all' }, { v: 'little', l: 'A little' }, { v: 'sweet', l: 'Pretty sweet' }] },
  { q: 'Black or with milk?', key: 'milk',
    opts: [{ v: 'black', l: 'Black all day' }, { v: 'milk', l: 'With milk / oat' }] },
]

function QuizView({ onResult, onBack }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const { q, key, opts } = QUIZ_STEPS[step]

  function pick(value) {
    const next = { ...answers, [key]: value }
    if (step < QUIZ_STEPS.length - 1) { setAnswers(next); setStep(s => s + 1) }
    else onResult(getRecommendation(next))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className={backBtn}>← back</button>
        <span className="text-white/20 text-xs ml-auto">{step + 1} / {QUIZ_STEPS.length}</span>
      </div>
      <p className="font-['Barlow_Condensed'] font-bold text-white text-sm tracking-widest uppercase">{q}</p>
      <div className="flex flex-col gap-2">
        {opts.map(o => (
          <button key={o.v} onClick={() => pick(o.v)} className={pill}>{o.l}</button>
        ))}
      </div>
    </div>
  )
}

function NotifyForm({ product }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  async function submit(e) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) return
    setStatus('loading')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: email.trim(), product }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'success') return <p className="font-['Bebas_Neue'] text-[#39FF14] text-sm tracking-[3px] uppercase">YOU'RE ON THE LIST.</p>
  return (
    <div className="flex flex-col gap-2">
      {status === 'error' && <p className="text-red-400 font-['Barlow_Condensed'] text-xs tracking-[2px] uppercase">Something went wrong — try again.</p>}
      <form onSubmit={submit} className="flex gap-2">
        <input type="email" value={email} onChange={e => { setEmail(e.target.value); if (status !== 'idle') setStatus('idle') }}
          placeholder="Your email" required className={inputCls} />
        <button type="submit" disabled={status === 'loading'} className={notifyBtn}>
          {status === 'loading' ? '…' : 'NOTIFY ME'}
        </button>
      </form>
    </div>
  )
}

function ResultView({ result, onBack, onClose }) {
  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className={backBtn}>← try again</button>
      <div>
        <p className="font-['Barlow_Condensed'] text-[#39FF14] text-[10px] tracking-[3px] uppercase mb-0.5">Your match</p>
        <p className="font-['Bebas_Neue'] text-white text-2xl tracking-wider leading-none">{result.blend}</p>
      </div>
      <p className="text-white/55 font-['Inter'] text-xs leading-relaxed">{result.desc}</p>
      {result.available ? (
        <Link to={result.link} onClick={onClose}
          className="w-full bg-[#39FF14] text-black font-['Barlow_Condensed'] font-bold text-sm tracking-[0.18em] uppercase px-4 py-3 rounded-sm text-center hover:bg-[#2ce010] transition-colors duration-200 block">
          SHOP NOW →
        </Link>
      ) : (
        <>
          <p className="text-white/35 font-['Inter'] text-xs">Dropping soon — join the waitlist.</p>
          <NotifyForm product={result.product} />
        </>
      )}
    </div>
  )
}

function TeaserView({ onBack }) {
  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className={backBtn}>← back</button>
      <div className="relative overflow-hidden rounded-sm bg-[#111] aspect-video">
        <img src="/images/jack-winter.png" alt="Blend #12" className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ filter: 'grayscale(25%)', opacity: 0.7 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="border border-white/20 text-white/40 font-['Bebas_Neue'] text-[10px] tracking-[3px] px-2 py-0.5">COMING SOON</span>
          <p className="font-['Bebas_Neue'] text-white text-3xl leading-none mt-1">BLEND #12</p>
          <p className="font-['Barlow_Condensed'] text-[#39FF14] text-xs tracking-[3px] uppercase">THE ORIGINAL</p>
        </div>
      </div>
      <p className="text-white/50 font-['Inter'] text-xs leading-relaxed">Single origin, small batch. A cleaner, more balanced cup. First of the original series.</p>
      <NotifyForm product="BLEND #12" />
    </div>
  )
}

function OriginView({ onBack }) {
  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className={backBtn}>← back</button>
      <p className="font-['Bebas_Neue'] text-[#39FF14] text-xl tracking-wider">WHERE WE SOURCE</p>
      <div className="flex flex-col gap-3">
        <div className="border border-white/8 p-3 rounded-sm">
          <p className="font-['Bebas_Neue'] text-white tracking-wider text-sm mb-1">BLEND #43 — ETHIOPIA</p>
          <p className="text-white/45 font-['Inter'] text-xs leading-relaxed">Sourced from small farms in the Ethiopian highlands. Fair trade, single origin. Expect bright stone fruit and floral notes.</p>
        </div>
        <div className="border border-white/8 p-3 rounded-sm">
          <p className="font-['Bebas_Neue'] text-white/55 tracking-wider text-sm mb-1">BUTTERSCOTCH BOURBON — COLOMBIA <span className="text-[#39FF14]/50 text-[10px]">SOON</span></p>
          <p className="text-white/45 font-['Inter'] text-xs leading-relaxed">Colombian beans known for their smooth body and natural sweetness — the base for our flavoured macchiato range.</p>
        </div>
      </div>
    </div>
  )
}

function BrandView({ onBack, onClose }) {
  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className={backBtn}>← back</button>
      <p className="font-['Bebas_Neue'] text-[#39FF14] text-xl tracking-wider">URBAN BOURBON</p>
      <p className="text-white/65 font-['Inter'] text-xs leading-relaxed">A craft coffee brand built in South Wales — for people who take their coffee seriously but never take themselves too seriously.</p>
      <p className="text-white/65 font-['Inter'] text-xs leading-relaxed">Bold flavours. No nonsense. Roasted in Wales.</p>
      <Link to="/our-story" onClick={onClose}
        className="self-start font-['Barlow_Condensed'] font-bold text-xs tracking-[0.18em] uppercase text-[#39FF14] border-b border-[#39FF14]/40 pb-0.5 hover:border-[#39FF14] transition-colors duration-200">
        READ OUR STORY →
      </Link>
    </div>
  )
}

// ─── Main widget ──────────────────────────────────────────────
export default function JackScrollGuide() {
  // Scroll / hover mood system (existing)
  const [sectionMood, setSectionMood]   = useState('awake')
  const [cardHovered, setCardHovered]   = useState(false)
  const [bouncing,    setBouncing]      = useState(false)
  const bouncingRef = useRef(false)

  // Panel
  const [panelOpen,  setPanelOpen]  = useState(false)
  const [isClosing,  setIsClosing]  = useState(false)
  const [view,       setView]       = useState('menu')
  const [result,     setResult]     = useState(null)

  // One-time wave invite
  const [waving,     setWaving]     = useState(false)
  const hasWavedRef  = useRef(false)
  const waveTimerRef = useRef(null)

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

    setSectionMood('awake')
    setCardHovered(false)

    watch('jack-asleep',  () => setSectionMood('asleep'),  () => setSectionMood('awake'))
    watch('jack-excited', () => setSectionMood('excited'), () => setSectionMood('awake'))

    const onCardOver = e => {
      if (e.target.closest('[data-product-card]')) setCardHovered(true)
    }
    const onCardOut = e => {
      const card = e.target.closest('[data-product-card]')
      if (card && !card.contains(e.relatedTarget)) setCardHovered(false)
    }
    const onBagOver = e => {
      if (e.target.closest('[data-add-to-bag]') && !bouncingRef.current) {
        bouncingRef.current = true
        setBouncing(true)
      }
    }

    document.addEventListener('mouseover', onCardOver)
    document.addEventListener('mouseout',  onCardOut)
    document.addEventListener('mouseover', onBagOver)

    // 8-second idle invite — fires once per session
    if (!hasWavedRef.current) {
      waveTimerRef.current = setTimeout(() => {
        if (!hasWavedRef.current) {
          hasWavedRef.current = true
          setWaving(true)
        }
      }, 8000)
    }

    return () => {
      observers.forEach(o => o.disconnect())
      document.removeEventListener('mouseover', onCardOver)
      document.removeEventListener('mouseout',  onCardOut)
      document.removeEventListener('mouseover', onBagOver)
      clearTimeout(waveTimerRef.current)
    }
  }, [pathname])

  function openPanel() {
    hasWavedRef.current = true
    clearTimeout(waveTimerRef.current)
    setWaving(false)
    bouncingRef.current = false
    setBouncing(false)
    setIsClosing(false)
    setView('menu')
    setResult(null)
    setPanelOpen(true)
  }

  function closePanel() {
    setIsClosing(true)
  }

  function handlePanelAnimEnd() {
    if (isClosing) {
      setPanelOpen(false)
      setIsClosing(false)
      setView('menu')
      setResult(null)
    }
  }

  function handleJackAnimEnd(e) {
    if (e.animationName === 'jackBounce') { bouncingRef.current = false; setBouncing(false) }
    if (e.animationName === 'jackWave')   setWaving(false)
    // jackThumbsUp uses `forwards` fill — no reset needed while panel is open
  }

  // Derive Jack's current mood — panel state takes priority over scroll state
  let mood
  if (panelOpen)       mood = view === 'result' ? 'thumbs-up' : 'looking-up'
  else if (bouncing)   mood = 'bouncing'
  else if (waving)     mood = 'waving'
  else if (cardHovered) mood = 'alert'
  else                 mood = sectionMood

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none flex flex-col items-end gap-3 pointer-events-none">

      {/* ── Panel ── */}
      {panelOpen && (
        <div
          className="pointer-events-auto w-72 sm:w-80 max-w-[calc(100vw-2.5rem)] bg-[#1a1a1a] border border-[#39FF14]/50 rounded-lg overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
          style={{ animation: `${isClosing ? 'panelSlideDown' : 'panelSlideUp'} 0.28s ease-out both` }}
          onAnimationEnd={handlePanelAnimEnd}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <div className="flex items-center gap-2.5">
              <img src="/images/bear-nobg.png" alt="" aria-hidden="true" className="w-7 h-auto" />
              <span className="font-['Bebas_Neue'] text-[#39FF14] text-base tracking-[3px]">ASK JACK</span>
            </div>
            <button onClick={closePanel} aria-label="Close"
              className="text-white/30 hover:text-white/70 transition-colors text-sm w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/5">
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-4">
            {view === 'menu'   && <MenuView   onSelect={setView} />}
            {view === 'quiz'   && <QuizView   onResult={r => { setResult(r); setView('result') }} onBack={() => setView('menu')} />}
            {view === 'teaser' && <TeaserView onBack={() => setView('menu')} />}
            {view === 'origin' && <OriginView onBack={() => setView('menu')} />}
            {view === 'brand'  && <BrandView  onBack={() => setView('menu')} onClose={closePanel} />}
            {view === 'result' && result &&
              <ResultView result={result} onBack={() => { setView('quiz'); setResult(null) }} onClose={closePanel} />
            }
          </div>
        </div>
      )}

      {/* ── Jack ── */}
      <button
        onClick={panelOpen ? closePanel : openPanel}
        aria-label={panelOpen ? 'Close panel' : 'Chat with Jack'}
        className="pointer-events-auto relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39FF14]/50 rounded-full"
      >
        <img
          src="/images/bear-nobg.png"
          alt=""
          aria-hidden="true"
          className="w-[78px] sm:w-[90px] h-auto block"
          style={getMoodStyle(mood)}
          onAnimationEnd={handleJackAnimEnd}
        />

        {/* Sleeping zzz */}
        {mood === 'asleep' && (
          <span className="absolute -top-2 -right-1 font-['Inter'] text-white/35 leading-none pointer-events-none"
            style={{ fontSize: '11px', letterSpacing: '3px' }} aria-hidden="true">
            z z z
          </span>
        )}

        {/* Online indicator dot — pulses when panel is closed */}
        {!panelOpen && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-[#39FF14] border-2 border-[#0d0d0d] animate-pulse"
            aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
