import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

const MODEL        = 'claude-sonnet-4-6'
const MAX_TOKENS   = 300
const MAX_MESSAGES = 10

const CHIPS = [
  'Help me choose a blend',
  "Where's the coffee from?",
  "What's coming next?",
  'What is Urban Bourbon?',
]

const RATE_LIMIT_MSG = "I'm off the clock. Come back tomorrow."

const SYSTEM_PROMPT = `You are Jack, the Urban Bourbon bear mascot. You work for Urban Bourbon — a craft coffee brand based in South Wales, established in 2023.

Your personality: deadpan, dry, occasionally sarcastic, never over-enthusiastic. You're a bear. You take coffee seriously but not yourself. Keep responses short — 1 to 3 sentences max. No emojis. No corporate nonsense.

Urban Bourbon products:
- Blend #43: Our debut. Ethiopian origin, fair trade, small batch, whole bean, 250g, £10.99. Bright and fruity. Available now.
- Blend #12 (COMING SOON): Single origin, small batch, 125g. The Original. Cleaner, more balanced.
- Butterscotch Bourbon Macchiato (COMING SOON): Colombian origin, 250g. Butterscotch and toasted almonds.
- Velvet Mocha (COMING SOON): Dark roast. Dark chocolate and caramel. Rich and heavy.

If someone asks what to buy, help them pick based on their preferences. Blend #43 is the only one available now. The others are coming soon — direct people to sign up on the coffee page. If they want something sweeter or more indulgent, point them to Butterscotch Bourbon Macchiato or Velvet Mocha (both coming soon). If they want something lighter and cleaner, Blend #12.

If someone asks where we're based: South Wales. If they ask about subscriptions or merch: coming soon. If they ask something you genuinely don't know: say so, briefly.

Never break character. You are Jack the bear.`

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
    case 'nodding':
      return { animation: 'jackNod 0.5s ease-in-out both', filter: 'drop-shadow(0 0 10px rgba(57,255,20,0.35))', opacity: 1, transition: ft }
    case 'shrugging':
      return { animation: 'jackShrug 0.8s ease-in-out both', filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.25))', opacity: 1, transition: ft }
    default:
      return {}
  }
}

// ─── Typing dots ──────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#39FF14] inline-block"
          style={{ animation: `dotPulse 1.2s ease-in-out ${i * 0.22}s infinite` }}
        />
      ))}
    </div>
  )
}

// ─── Main widget ──────────────────────────────────────────────
export default function JackScrollGuide() {
  // Scroll / hover mood system
  const [sectionMood,  setSectionMood]  = useState('awake')
  const [cardHovered,  setCardHovered]  = useState(false)
  const [bouncing,     setBouncing]     = useState(false)
  const bouncingRef = useRef(false)

  // Panel open/close
  const [panelOpen,  setPanelOpen]  = useState(false)
  const [isClosing,  setIsClosing]  = useState(false)

  // Chat state
  const [messages,     setMessages]     = useState([])
  const [inputVal,     setInputVal]     = useState('')
  const [isTyping,     setIsTyping]     = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [hasSentMsg,   setHasSentMsg]   = useState(false)

  // Transient moods
  const [waving,    setWaving]    = useState(false)
  const [nodding,   setNodding]   = useState(false)
  const [shrugging, setShrugging] = useState(false)

  const hasWavedRef    = useRef(false)
  const waveTimerRef   = useRef(null)
  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)

  const { pathname } = useLocation()

  // Scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input on panel open
  useEffect(() => {
    if (panelOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 120)
      return () => clearTimeout(t)
    }
  }, [panelOpen])

  // Scroll / section observers
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
    setPanelOpen(true)
  }

  function closePanel() {
    setIsClosing(true)
  }

  function handlePanelAnimEnd() {
    if (isClosing) {
      setPanelOpen(false)
      setIsClosing(false)
    }
  }

  function handleJackAnimEnd(e) {
    if (e.animationName === 'jackBounce')  { bouncingRef.current = false; setBouncing(false) }
    if (e.animationName === 'jackWave')    setWaving(false)
    if (e.animationName === 'jackNod')     setNodding(false)
    if (e.animationName === 'jackShrug')   setShrugging(false)
  }

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || isTyping || messageCount >= MAX_MESSAGES) return

    const newCount = messageCount + 1
    setMessageCount(newCount)

    const userMsg = { role: 'user', content: trimmed }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInputVal('')
    setHasSentMsg(true)
    setNodding(true)

    if (newCount >= MAX_MESSAGES) {
      setMessages(prev => [...prev, { role: 'assistant', content: RATE_LIMIT_MSG }])
      setShrugging(true)
      return
    }

    setIsTyping(true)
    try {
      const history = updatedMessages.slice(-6)
      let reply

      if (import.meta.env.DEV) {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: SYSTEM_PROMPT,
            messages: history,
          }),
        })
        if (!res.ok) {
          const errBody = await res.text()
          console.error('Jack API error:', res.status, errBody)
          throw new Error(`${res.status}`)
        }
        const data = await res.json()
        reply = data.content?.[0]?.text ?? '...'
      } else {
        const res = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        })
        if (!res.ok) {
          const errBody = await res.text()
          console.error('Jack function error:', res.status, errBody)
          throw new Error(`${res.status}`)
        }
        const data = await res.json()
        reply = data.reply ?? '...'
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      console.error('Jack fetch error:', err)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Try again.' }])
    } finally {
      setIsTyping(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputVal)
    }
  }

  // Derive mood — panel state takes priority over scroll state
  let mood
  if (panelOpen) {
    if (nodding)        mood = 'nodding'
    else if (shrugging) mood = 'shrugging'
    else                mood = 'looking-up'
  } else if (shrugging)  mood = 'shrugging'
  else if (nodding)      mood = 'nodding'
  else if (bouncing)     mood = 'bouncing'
  else if (waving)       mood = 'waving'
  else if (cardHovered)  mood = 'alert'
  else                   mood = sectionMood

  const rateLimitHit = messageCount >= MAX_MESSAGES

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none flex flex-col items-end gap-3 pointer-events-none">

      {/* ── Chat panel ── */}
      {panelOpen && (
        <div
          className="pointer-events-auto bg-[#1a1a1a] border border-[#39FF14]/50 rounded-lg overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.7)] flex flex-col fixed bottom-28 left-3 right-3 max-h-[420px] z-50 md:static md:w-80 md:left-auto md:right-auto md:bottom-auto md:z-auto"
          style={{ animation: `${isClosing ? 'panelSlideDown' : 'panelSlideUp'} 0.28s ease-out both` }}
          onAnimationEnd={handlePanelAnimEnd}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] shrink-0">
            <div className="flex items-center gap-2.5">
              <img src="/images/bear-nobg.png" alt="" aria-hidden="true" className="w-7 h-auto" />
              <span className="font-['Bebas_Neue'] text-[#39FF14] text-base tracking-[3px]">ASK JACK</span>
            </div>
            <button
              onClick={closePanel}
              aria-label="Close"
              className="text-white/30 hover:text-white/70 transition-colors text-sm w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/5"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5 min-h-0">
            {messages.length === 0 && (
              <p className="font-['Inter'] text-white/25 text-xs text-center pt-2 leading-relaxed">
                Ask me anything about Urban Bourbon.
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-lg font-['Inter'] text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#39FF14]/12 text-[#39FF14] border border-[#39FF14]/20'
                    : 'text-white/75'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start px-3 py-2">
                <TypingDots />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion chips — shown before first send */}
          {!hasSentMsg && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="font-['Inter'] text-[10px] border border-[#39FF14]/25 text-white/45 hover:border-[#39FF14]/60 hover:text-white/75 px-2.5 py-1.5 rounded-full transition-all duration-200"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-white/[0.07] shrink-0">
            {rateLimitHit ? (
              <p className="font-['Barlow_Condensed'] text-white/25 text-xs tracking-[2px] uppercase text-center py-1">
                Back tomorrow.
              </p>
            ) : (
              <form onSubmit={e => { e.preventDefault(); sendMessage(inputVal) }} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Jack..."
                  disabled={isTyping}
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 focus:border-[#39FF14]/60 outline-none px-3 py-2 text-white placeholder-white/20 font-['Inter'] text-xs transition-colors duration-200 rounded-sm disabled:opacity-40"
                />
                <button
                  type="submit"
                  disabled={isTyping || !inputVal.trim()}
                  className="border border-[#39FF14]/50 text-[#39FF14] font-['Bebas_Neue'] text-sm tracking-[2px] px-3 py-2 hover:bg-[#39FF14] hover:text-black transition-all duration-200 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
                >
                  SEND
                </button>
              </form>
            )}
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

        {mood === 'asleep' && (
          <span
            className="absolute -top-2 -right-1 font-['Inter'] text-white/35 leading-none pointer-events-none"
            style={{ fontSize: '11px', letterSpacing: '3px' }}
            aria-hidden="true"
          >
            z z z
          </span>
        )}

        {!panelOpen && (
          <span
            className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-[#39FF14] border-2 border-[#0d0d0d] animate-pulse"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  )
}
