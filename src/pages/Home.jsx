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
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      <video
        ref={videoRef}
        src="/images/ub-reel.mp4"
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      {/* gradient vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0d0d0d_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0d0d0d] to-transparent" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center gap-5">
        {videoPaused && (
          <button
            onClick={() => { videoRef.current?.play(); setVideoPaused(false) }}
            className="mb-2 text-[#39FF14]/70 hover:text-[#39FF14] transition-colors"
            aria-label="Play video"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 drop-shadow-[0_0_16px_rgba(57,255,20,0.6)]">
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

        <div className="fade-up fade-up-d2 flex flex-col sm:flex-row gap-3 mt-2">
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

      {/* scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
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

      <div className="w-full overflow-hidden">
        <img
          src="/images/hero-product.jpg"
          alt="#43 — three bags and whisky glass"
          className="w-full max-h-[70vh] object-cover object-center"
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
    <section className="noise bg-[#111111] py-24 px-5 sm:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Bear */}
        <div className="flex justify-center md:justify-start order-2 md:order-1">
          <img
            src="/images/bear.png"
            alt="Urban Bourbon Bear mascot"
            className="w-56 sm:w-72 md:w-80 h-auto drop-shadow-[0_0_60px_rgba(57,255,20,0.15)]"
          />
        </div>

        {/* Text */}
        <div className="order-1 md:order-2 flex flex-col gap-8">
          {/* Cycling headline */}
          <div className="overflow-hidden h-[4.5rem] sm:h-[5.5rem] flex items-center">
            <p
              key={idx}
              className="font-['Barlow_Condensed'] font-black text-5xl sm:text-6xl uppercase tracking-tight leading-none transition-all duration-350"
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
            themselves too seriously. Bold flavours. No nonsense. Roasted in Wales.
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
function InstagramSection() {
  const tiles = Array.from({ length: 6 }, (_, i) => i)

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
          {tiles.map(i => (
            <a
              key={i}
              href="https://www.instagram.com/urbanbourboncoffee"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square bg-[#161616] overflow-hidden"
            >
              {/* subtle noise pattern tile */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `radial-gradient(circle at ${30 + i * 13}% ${40 + i * 9}%, #39FF1408 0%, transparent 60%)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity duration-300">
                <svg viewBox="0 0 24 24" fill="#39FF14" className="w-8 h-8">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
              {/* corner label */}
              <span className="absolute bottom-2 left-2 font-['Barlow_Condensed'] text-white/20 text-xs tracking-wider uppercase">
                #{43 + i}
              </span>
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
  const [done, setDone] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (email) setDone(true)
  }

  return (
    <section className="noise bg-[#111111] py-28 px-5 sm:px-8">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
        <h2 className="font-['Barlow_Condensed'] font-black text-white text-6xl sm:text-7xl md:text-8xl uppercase leading-none tracking-tight">
          LET'S BE<br />
          <span className="text-[#39FF14]">PEN PALS</span>
        </h2>
        <p className="text-white/45 font-['Inter'] font-light text-base sm:text-lg leading-relaxed max-w-sm">
          New drops, limited batches, and the occasional bit of nonsense — straight to your inbox.
        </p>

        {done ? (
          <p className="font-['Barlow_Condensed'] text-[#39FF14] text-xl tracking-wider mt-2 border border-[#39FF14]/30 px-8 py-4 rounded-sm">
            WELCOME TO THE FOLD.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3 mt-2">
            <label htmlFor="email-signup" className="sr-only">Email address</label>
            <input
              id="email-signup"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-white/5 border border-white/10 focus:border-[#39FF14] outline-none rounded-sm px-5 py-4 text-white placeholder-white/20 font-['Inter'] text-sm transition-colors duration-200"
            />
            <button
              type="submit"
              className="bg-[#39FF14] text-black font-['Barlow_Condensed'] font-bold text-sm tracking-[0.18em] uppercase px-9 py-4 rounded-sm hover:bg-[#2ce010] transition-colors duration-200 whitespace-nowrap"
            >
              SUBSCRIBE
            </button>
          </form>
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
      <BrandStorySection />
      <SubscriptionsSection />
      <InstagramSection />
      <EmailSection />
    </main>
  )
}
