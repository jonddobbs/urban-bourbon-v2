import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ─── Hero ─────────────────────────────────────────────── */
function HeroSection() {
  const videoRef = useRef(null)
  const [videoPaused, setVideoPaused] = useState(false)

  useEffect(() => {
    videoRef.current?.play().catch(() => setVideoPaused(true))
  }, [])

  return (
    <section id="jack-asleep" className="relative w-full h-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        src="/images/ub-reel.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* Left-side legibility gradient — covers ~60% width */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.80) 40%, rgba(13,13,13,0.2) 65%, transparent 100%)'
      }} />
      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0d0d0d] to-transparent" />

      {/* Left-aligned content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto w-full px-8 sm:px-12 lg:px-16 flex flex-col items-start gap-5 max-w-[55%]">
          {videoPaused && (
            <button
              onClick={() => { videoRef.current?.play(); setVideoPaused(false) }}
              className="text-[#39FF14]/70 hover:text-[#39FF14] transition-colors"
              aria-label="Play video"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 drop-shadow-[0_0_16px_rgba(57,255,20,0.6)]">
                <path d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" />
              </svg>
            </button>
          )}

          <h1 className="fade-up font-['Barlow_Condensed'] font-black text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight uppercase">
            MAY WE FILL
            <br />YOUR CUP
          </h1>

          <p className="fade-up fade-up-d1 font-['Barlow_Condensed'] font-bold text-[#39FF14] text-lg sm:text-xl tracking-[0.25em] uppercase">
            #43 — OUT NOW
          </p>

          <div className="fade-up fade-up-d2 flex flex-col sm:flex-row gap-3">
            <Link
              to="/coffee"
              className="bg-[#39FF14] text-black font-['Barlow_Condensed'] font-bold text-sm tracking-[0.2em] uppercase px-10 py-3.5 rounded-sm hover:bg-[#2ce010] transition-all duration-200 hover:scale-[1.03]"
            >
              SHOP
            </Link>
            <Link
              to="/our-story"
              className="border border-white/30 text-white font-['Barlow_Condensed'] font-bold text-sm tracking-[0.2em] uppercase px-10 py-3.5 rounded-sm hover:border-[#39FF14] hover:text-[#39FF14] transition-all duration-200 hover:scale-[1.03]"
            >
              OUR STORY
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-8 sm:left-12 lg:left-16 flex flex-col items-start gap-1 opacity-40">
        <span className="font-['Barlow_Condensed'] text-white text-xs tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-white animate-pulse" />
      </div>
    </section>
  )
}

/* ─── Our Coffee ─────────────────────────────────────────── */
function CoffeeSection() {
  return (
    <section id="coffee" className="bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-24 pb-6">
        <h2 className="font-['Barlow_Condensed'] font-black text-white text-6xl sm:text-7xl md:text-8xl uppercase tracking-tight leading-none mb-12">
          OUR COFFEE
        </h2>
      </div>

      <div className="max-w-2xl mx-auto px-5 sm:px-8 w-full">
        <img
          src="/images/urban-43-promo.png"
          alt="Urban Bourbon #43 — Out Now"
          className="w-full h-auto block"
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-10 pb-20 flex flex-col sm:flex-row items-start justify-between gap-6">
        <p className="text-white/60 font-['Inter'] font-light text-base sm:text-lg leading-relaxed max-w-xl">
          #43 is our debut blend — a fair trade, small batch Ethiopian whole bean coffee.
          Bright, fruity and unlike anything you've tasted. The first of many.
        </p>
        <Link
          to="/coffee"
          className="shrink-0 bg-[#39FF14] text-black font-['Barlow_Condensed'] font-bold text-sm tracking-[0.18em] uppercase px-9 py-3.5 rounded-sm hover:bg-[#2ce010] transition-all duration-200 hover:scale-[1.03]"
        >
          ORDER #43
        </Link>
      </div>
    </section>
  )
}

/* ─── Reviews ────────────────────────────────────────────── */

// ✅ APPROVED REVIEWS — add new reviews here after checking Netlify dashboard
const approvedReviews = [
  // { name: "Sarah M.", location: "Bristol", rating: 5, text: "Best morning coffee I've had in years. Smooth, fruity and actually tastes like real coffee." },
]

function StarIcon({ filled, size = 16, dimEmpty = false }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill={filled ? '#39FF14' : 'none'}
        stroke={filled ? '#39FF14' : dimEmpty ? '#1e1e1e' : '#2e2e2e'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarSelector({ rating, onChange }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || rating
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${i} star${i > 1 ? 's' : ''}`}
          className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
        >
          <StarIcon filled={i <= active} size={28} />
        </button>
      ))}
    </div>
  )
}

function ReviewsSection() {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!rating) return
    setSubmitting(true)
    setError(false)
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'form-name': 'reviews',
        'bot-field': '',
        name,
        location,
        rating: String(rating),
        review: reviewText,
      }).toString(),
    })
      .then(() => {
        setSubmitted(true)
        setSubmitting(false)
      })
      .catch(() => {
        setError(true)
        setSubmitting(false)
      })
  }

  return (
    <section className="bg-[#0d0d0d] py-20 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="mb-12">
          <h2 className="font-['Bebas_Neue'] text-white text-7xl sm:text-8xl md:text-9xl tracking-[4px] leading-none">
            WHAT THEY'RE SAYING
          </h2>
          <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[0.3em] uppercase mt-2">
            TRIED IT? TELL US.
          </p>
        </div>

        {/* Reviews grid or empty state */}
        {approvedReviews.length === 0 ? (
          <p className="font-['Inter'] text-white/30 text-sm mb-16 tracking-wide">
            No reviews yet — be the first.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {approvedReviews.map((r, i) => (
              <div key={i} className="bg-[#111111] border border-[#39FF14]/20 p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} filled={s <= r.rating} size={15} dimEmpty />)}
                </div>
                <p className="font-['Inter'] text-white/80 text-sm leading-relaxed flex-1">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div>
                  <p className="font-['Bebas_Neue'] text-[#39FF14] text-sm tracking-[2px]">{r.name}</p>
                  <p className="font-['Inter'] text-white/35 text-xs mt-0.5">{r.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-[#1a1a1a] mb-10" />

        {/* Form */}
        <div className="max-w-xl">
          {submitted ? (
            <p className="font-['Barlow_Condensed'] text-[#39FF14] text-xl tracking-wider border border-[#39FF14]/30 px-8 py-5 inline-block">
              Thanks for your review — we'll get it live soon.
            </p>
          ) : (
            <form
              name="reviews"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              <input type="hidden" name="form-name" value="reviews" />
              <input type="hidden" name="bot-field" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-['Bebas_Neue'] text-white/50 text-xs tracking-[2px]">FIRST NAME</label>
                  <input
                    type="text" name="name" value={name} required
                    placeholder="e.g. Sarah"
                    onChange={e => setName(e.target.value)}
                    className="bg-white/5 border border-white/10 focus:border-[#39FF14] outline-none px-4 py-3 text-white placeholder-white/20 font-['Inter'] text-sm transition-colors duration-200 rounded-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-['Bebas_Neue'] text-white/50 text-xs tracking-[2px]">LOCATION</label>
                  <input
                    type="text" name="location" value={location} required
                    placeholder="e.g. Cardiff"
                    onChange={e => setLocation(e.target.value)}
                    className="bg-white/5 border border-white/10 focus:border-[#39FF14] outline-none px-4 py-3 text-white placeholder-white/20 font-['Inter'] text-sm transition-colors duration-200 rounded-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-['Bebas_Neue'] text-white/50 text-xs tracking-[2px]">YOUR RATING</label>
                <StarSelector rating={rating} onChange={setRating} />
                {!rating && <p className="font-['Inter'] text-white/25 text-xs">Select a star rating to continue</p>}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-baseline">
                  <label className="font-['Bebas_Neue'] text-white/50 text-xs tracking-[2px]">YOUR REVIEW</label>
                  <span className={`font-['Inter'] text-xs ${reviewText.length >= 280 ? 'text-[#39FF14]/70' : 'text-white/25'}`}>
                    {reviewText.length}/300
                  </span>
                </div>
                <textarea
                  name="review" value={reviewText} required rows={4}
                  placeholder="Tell us what you thought..."
                  onChange={e => setReviewText(e.target.value.slice(0, 300))}
                  className="bg-white/5 border border-white/10 focus:border-[#39FF14] outline-none px-4 py-3 text-white placeholder-white/20 font-['Inter'] text-sm transition-colors duration-200 rounded-sm resize-none"
                />
              </div>

              {error && (
                <p className="font-['Barlow_Condensed'] text-red-400 text-sm tracking-wider">
                  Something went wrong — please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !rating}
                className="self-start bg-[#39FF14] text-black font-['Barlow_Condensed'] font-bold text-sm tracking-[0.18em] uppercase px-10 py-4 rounded-sm hover:bg-[#2ce010] transition-all duration-200 hover:scale-[1.03] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#39FF14]"
              >
                {submitting ? 'SUBMITTING…' : 'SUBMIT REVIEW'}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  )
}

/* ─── The Drop ───────────────────────────────────────────── */

const BLENDS = [
  {
    key: 'b43',
    available: true,
    bigLabel: '#43',
    name: 'BLEND #43',
    origin: 'Ethiopian Origin',
    notes: 'Bright & Fruity',
    weight: '125g',
    bg: '/images/hero-product.jpg',
    bgPos: 'center',
    bag: null,
  },
  {
    key: 'b41',
    available: true,
    bigLabel: '#41',
    name: 'COLOMBIAN GOLD',
    origin: 'Colombia Excelso',
    notes: 'Orange, Brown Sugar, Cedar',
    weight: null,
    bg: null,
    bgPos: null,
    bag: '/images/label-41.png',
  },
  {
    key: 'b17',
    available: true,
    bigLabel: '#17',
    name: 'COCOA RIDGE',
    origin: 'Nicaragua Jinotega',
    notes: 'Chocolate, Pear, Caramel',
    weight: null,
    bg: null,
    bgPos: null,
    bag: '/images/label-17.png',
  },
]

function BlendCard({ blend }) {
  const { available, bigLabel, name, origin, notes, weight, bg, bgPos, bag } = blend
  return (
    <div data-product-card="" className="relative aspect-square overflow-hidden bg-[#0d0d0d] border border-[#1a1a1a]">

      {/* Full-bleed background image — #43 uses product shot, #12 uses Jack winter */}
      {bg && (
        <>
          <img
            src={bg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: available ? 0.48 : 0.65,
              objectPosition: bgPos,
              filter: available ? 'none' : 'grayscale(35%)',
            }}
          />
          <div className="absolute inset-0" style={{
            background: available
              ? 'linear-gradient(to right, rgba(13,13,13,0.93) 0%, rgba(13,13,13,0.72) 50%, rgba(13,13,13,0.25) 100%)'
              : 'rgba(13,13,13,0.52)',
          }} />
        </>
      )}

      {/* Floating bag mockup — transparent bg, right-anchored */}
      {bag && (
        <img
          src={bag}
          alt=""
          aria-hidden="true"
          className="absolute right-0 bottom-0 h-[90%] w-auto object-contain"
          style={{ filter: available ? 'none' : 'grayscale(25%) brightness(0.82)', opacity: 0.9 }}
        />
      )}

      {!available && <div className="absolute inset-0 bg-[#0a0a0a]/20" />}

      {available && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 20% 72%, rgba(57,255,20,0.09) 0%, transparent 60%)',
        }} />
      )}

      <div className="relative z-10 h-full flex flex-col justify-between p-7"
        style={{ maxWidth: bag ? '56%' : '100%' }}>

        <div>
          {available ? (
            <span className="inline-block bg-[#39FF14] text-black font-['Bebas_Neue'] text-xs tracking-[3px] px-2.5 py-1">
              OUT NOW
            </span>
          ) : (
            <span className="inline-block border border-white/20 text-white/35 font-['Bebas_Neue'] text-xs tracking-[3px] px-2.5 py-1">
              COMING SOON
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          {bigLabel ? (
            <>
              <p
                className="font-['Bebas_Neue'] leading-none"
                style={{
                  fontSize: 'clamp(4rem, 11vw, 7.5rem)',
                  color: available ? '#39FF14' : 'rgba(255,255,255,0.32)',
                  textShadow: available ? '0 0 50px rgba(57,255,20,0.3)' : 'none',
                }}
              >
                {bigLabel}
              </p>
              <p className="font-['Bebas_Neue'] text-[#39FF14] tracking-[3px]"
                style={{ fontSize: 'clamp(1rem, 2.4vw, 1.5rem)' }}>
                {name}
              </p>
            </>
          ) : (
            <p className="font-['Bebas_Neue'] text-white/80 tracking-[2px] leading-[1.1]"
              style={{ fontSize: 'clamp(1.1rem, 2.8vw, 1.85rem)' }}>
              {name}
            </p>
          )}
          <div className="w-6 h-px bg-[#39FF14]/50 my-1" />
          <p className="font-['Barlow_Condensed'] text-[#e0e0e0] text-[0.8rem] tracking-[2px] uppercase leading-relaxed">
            {origin}<br />{notes}{weight && <><br />{weight}</>}
          </p>
        </div>
      </div>
    </div>
  )
}

function TheDropSection() {
  return (
    <section id="jack-blends" className="bg-[#0d0d0d] py-20 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-['Bebas_Neue'] text-[#39FF14] text-7xl sm:text-8xl md:text-9xl tracking-[4px] leading-none mb-10">
          THE DROP
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BLENDS.map(blend => (
            <BlendCard key={blend.key} blend={blend} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Brand Story ────────────────────────────────────────── */
const cycleLines = ['Our Passion', 'is coffee.', 'Our Mission', 'is community.']

function BrandStorySection() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % cycleLines.length)
        setVisible(true)
      }, 350)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="noise bg-[#111111] overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-[70vh]">

        {/* Lifestyle photo — full-bleed column */}
        <div className="relative order-2 md:order-1 overflow-hidden min-h-[50vw] md:min-h-0">
          <img
            src="/images/ub-cup-logo.jpg"
            alt="Urban Bourbon lifestyle"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Fade into text panel on desktop */}
          <div className="absolute inset-0 hidden md:block" style={{
            background: 'linear-gradient(to right, transparent 60%, #111111 100%)'
          }} />
          {/* Bottom fade on mobile */}
          <div className="absolute inset-0 md:hidden" style={{
            background: 'linear-gradient(to top, #111111 0%, transparent 40%)'
          }} />
        </div>

        {/* Text */}
        <div className="order-1 md:order-2 flex flex-col justify-center gap-8 px-8 sm:px-12 lg:px-20 py-20 md:py-28">
          {/* Cycling headline */}
          <div className="overflow-hidden h-[4.5rem] sm:h-[5.5rem] flex items-center">
            <p
              key={idx}
              className="font-['Barlow_Condensed'] font-black text-5xl sm:text-6xl uppercase tracking-tight leading-none"
              style={{
                color: idx % 2 === 0 ? '#f5f5f5' : '#39FF14',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
              }}
            >
              {cycleLines[idx]}
            </p>
          </div>

          <p className="text-white/55 font-['Inter'] font-light text-base sm:text-lg leading-relaxed max-w-md">
            Urban Bourbon was built for people who take their coffee seriously but never take
            themselves too seriously. Bold flavours. No nonsense.
          </p>

          <Link
            to="/our-story"
            className="self-start font-['Barlow_Condensed'] font-bold text-sm tracking-[0.18em] uppercase text-[#39FF14] border-b border-[#39FF14]/40 pb-0.5 hover:border-[#39FF14] transition-colors duration-200"
          >
            READ OUR STORY →
          </Link>
        </div>

      </div>
    </section>
  )
}

/* ─── Subscriptions ──────────────────────────────────────── */
function SubscriptionsSection() {
  return (
    <section className="bg-[#0d0d0d] py-28 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-7">
        <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[0.35em] uppercase">
          Never run dry
        </p>
        <h2 className="font-['Barlow_Condensed'] font-black text-white text-6xl sm:text-7xl md:text-8xl uppercase leading-none tracking-tight">
          KEEP IT <span className="text-[#39FF14]">FRESH</span>
        </h2>
        <p className="text-white/50 font-['Inter'] font-light text-base sm:text-lg leading-relaxed max-w-lg">
          Get Urban Bourbon delivered as often as you need. Never run out of the good stuff.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Link
            to="/subscriptions"
            className="bg-[#39FF14] text-black font-['Barlow_Condensed'] font-bold text-sm tracking-[0.18em] uppercase px-10 py-4 rounded-sm hover:bg-[#2ce010] transition-all duration-200 hover:scale-[1.03]"
          >
            SHOP SUBSCRIPTIONS
          </Link>
          <Link
            to="/subscriptions"
            className="border border-[#39FF14]/40 text-[#39FF14] font-['Barlow_Condensed'] font-bold text-sm tracking-[0.18em] uppercase px-10 py-4 rounded-sm hover:border-[#39FF14] transition-all duration-200 hover:scale-[1.03]"
          >
            TAKE THE QUIZ
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Instagram Grid ──────────────────────────────────────── */

const igTiles = [
  { src: '/images/hero-product.jpg',       pos: 'object-center', alt: '#43 coffee bags and whisky glass' },
  { src: '/images/urban-43-promo.png',     pos: 'object-center', alt: 'Urban Bourbon #43 promo' },
  { src: '/images/jack-lab-coat-nobg.png', pos: 'object-top',    alt: 'Jack the mascot in lab coat' },
  { src: '/images/bear.png',               pos: 'object-top',    alt: 'Urban Bourbon Bear mascot' },
  { src: '/images/free-30g-promo.png',     pos: 'object-center', alt: 'Free 30g promo' },
  { src: '/images/banner-mobile.png',      pos: 'object-center', alt: 'Urban Bourbon banner' },
]

const igHoverOverlay = (
  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300">
    <svg viewBox="0 0 24 24" fill="#39FF14" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(57,255,20,0.6)]">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  </div>
)

function InstagramSection() {
  return (
    <section className="noise bg-[#0a0a0a] py-20 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <h2 className="font-['Barlow_Condensed'] font-black text-white text-5xl sm:text-6xl uppercase tracking-tight leading-none">
            SEE YA<br className="sm:hidden" /> OUT THERE
          </h2>
          <a
            href="https://www.instagram.com/urbanbourboncoffee"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-['Barlow_Condensed'] text-white/40 hover:text-[#39FF14] text-sm tracking-[0.15em] uppercase transition-colors duration-200"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            @urbanbourboncoffee
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
          {igTiles.map((tile, i) => (
            <a
              key={i}
              href="https://www.instagram.com/urbanbourboncoffee"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-[#0d0d0d]"
            >
              <img
                src={tile.src}
                alt={tile.alt}
                className={`absolute inset-0 w-full h-full object-cover ${tile.pos} transition-transform duration-500 group-hover:scale-105`}
              />
              {igHoverOverlay}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Email Signup ────────────────────────────────────────── */
function EmailSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'done' | 'error'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    try {
      const res = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus('done')
    } catch (err) {
      console.error('Subscribe error:', err)
      setStatus('error')
    }
  }

  return (
    <section id="jack-excited" className="noise bg-[#111111] py-28 px-5 sm:px-8">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
        <h2 className="font-['Barlow_Condensed'] font-black text-white text-6xl sm:text-7xl md:text-8xl uppercase leading-none tracking-tight">
          LET'S BE<br />
          <span className="text-[#39FF14]">PEN PALS</span>
        </h2>
        <p className="text-white/45 font-['Inter'] font-light text-base sm:text-lg leading-relaxed max-w-sm">
          New drops, limited batches, and the occasional bit of nonsense — straight to your inbox.
        </p>

        {status === 'done' ? (
          <p className="font-['Barlow_Condensed'] text-[#39FF14] text-xl tracking-wider mt-2 border border-[#39FF14]/30 px-8 py-4 rounded-sm">
            WELCOME TO THE FOLD.
          </p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3 mt-2">
              <label htmlFor="email-signup" className="sr-only">Email address</label>
              <input
                id="email-signup"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                disabled={status === 'sending'}
                className="flex-1 bg-white/5 border border-white/10 focus:border-[#39FF14] outline-none rounded-sm px-5 py-4 text-white placeholder-white/20 font-['Inter'] text-sm transition-colors duration-200 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-[#39FF14] text-black font-['Barlow_Condensed'] font-bold text-sm tracking-[0.18em] uppercase px-9 py-4 rounded-sm hover:bg-[#2ce010] transition-colors duration-200 whitespace-nowrap disabled:opacity-60"
              >
                {status === 'sending' ? 'SENDING…' : 'SUBSCRIBE'}
              </button>
            </form>
            {status === 'error' && (
              <p className="font-['Barlow_Condensed'] text-red-400 text-sm tracking-wider">
                Something went wrong — try again.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
export default function Home({ scrollTo }) {
  useEffect(() => {
    if (scrollTo === 'coffee') {
      const el = document.getElementById('coffee')
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [scrollTo])

  return (
    <main>
      <HeroSection />
      <CoffeeSection />
      <ReviewsSection />
      <TheDropSection />
      <BrandStorySection />
      <SubscriptionsSection />
      <InstagramSection />
      <EmailSection />
    </main>
  )
}
