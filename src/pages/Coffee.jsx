import { useState } from 'react'
import { Link } from 'react-router-dom'
import RadarChart from '../components/RadarChart.jsx'

const FORMSPREE_URL = 'https://formspree.io/f/xykonvan'

const BLEND_43_PROFILE = { Body: 8, Acidity: 3, Sweetness: 5, Bitterness: 7, Finish: 7 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const COMING_SOON = [
  {
    key: 'b12',
    name: 'BLEND #12',
    subtitle: 'THE ORIGINAL',
    origin: 'Single Origin',
    notes: 'Small Batch',
    weight: '125g',
    image: '/images/jack-winter.png',
    imageType: 'fullbleed',
    imageStyle: { objectPosition: 'top', filter: 'grayscale(20%)' },
    profile: { Body: 7, Acidity: 5, Sweetness: 6, Bitterness: 6, Finish: 7 },
  },
  {
    key: 'bbs',
    name: 'BUTTERSCOTCH BOURBON MACCHIATO',
    subtitle: null,
    origin: 'Colombian Origin',
    notes: 'Butterscotch & Toasted Almonds',
    weight: '250g',
    image: '/images/bag-butterscotch.png',
    imageType: 'float',
    imageStyle: { filter: 'grayscale(15%)' },
    profile: { Body: 8, Acidity: 4, Sweetness: 9, Bitterness: 5, Finish: 8 },
  },
  {
    key: 'bvm',
    name: 'VELVET MOCHA',
    subtitle: null,
    origin: 'Dark Roast',
    notes: 'Dark Chocolate & Caramel',
    weight: null,
    image: '/images/bag-velvet.png',
    imageType: 'float',
    imageStyle: { filter: 'grayscale(15%)' },
    profile: { Body: 9, Acidity: 3, Sweetness: 7, Bitterness: 8, Finish: 8 },
  },
]

function NotifyCard({ blend }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) return
    setStatus('loading')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: email.trim(), product: blend.name }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div data-product-card="" className="relative overflow-hidden bg-[#0d0d0d] border border-[#1a1a1a] flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#111]">
        {blend.imageType === 'fullbleed' ? (
          <img
            src={blend.image}
            alt={blend.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={blend.imageStyle}
          />
        ) : (
          <img
            src={blend.image}
            alt={blend.name}
            className="absolute bottom-0 right-0 h-full w-auto object-contain"
            style={blend.imageStyle}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
        <span className="absolute top-4 left-4 border border-white/20 text-white/40 font-['Bebas_Neue'] text-xs tracking-[3px] px-2.5 py-1">
          COMING SOON
        </span>
      </div>

      <div className="flex flex-col gap-4 p-6 flex-1">
        <div>
          <h3 className="font-['Bebas_Neue'] text-white/80 tracking-[2px] leading-tight"
            style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)' }}>
            {blend.name}
          </h3>
          {blend.subtitle && (
            <p className="font-['Barlow_Condensed'] text-[#39FF14] text-xs tracking-[4px] uppercase mt-0.5">
              {blend.subtitle}
            </p>
          )}
        </div>
        <p className="font-['Barlow_Condensed'] text-white/35 text-xs tracking-[2px] uppercase leading-relaxed">
          {blend.origin} · {blend.notes}{blend.weight ? ` · ${blend.weight}` : ''}
        </p>

        <RadarChart values={blend.profile} />

        <div className="mt-auto pt-2">
          {status === 'success' ? (
            <p className="font-['Bebas_Neue'] text-[#39FF14] text-base tracking-[3px] uppercase">
              YOU'RE ON THE LIST.
            </p>
          ) : (
            <>
              {status === 'error' && (
                <p className="font-['Barlow_Condensed'] text-red-400 text-xs tracking-[2px] uppercase mb-2">
                  Something went wrong — try again.
                </p>
              )}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (status !== 'idle') setStatus('idle') }}
                  placeholder="Your email"
                  required
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 focus:border-[#39FF14] outline-none px-3 py-2.5 text-white placeholder-white/20 font-['Inter'] text-xs transition-colors duration-200"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="border border-[#39FF14]/50 text-[#39FF14] font-['Bebas_Neue'] text-sm tracking-[2px] px-4 py-2.5 hover:bg-[#39FF14] hover:text-black transition-all duration-200 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? '…' : 'NOTIFY ME'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Coffee() {
  const [added, setAdded] = useState(false)

  return (
    <main className="bg-[#0d0d0d] pt-16">

      {/* Page header */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-12">
        <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[0.35em] uppercase mb-3">
          Urban Bourbon · Est. 2023
        </p>
        <h1 className="font-['Bebas_Neue'] text-white leading-none tracking-tight"
          style={{ fontSize: 'clamp(5rem, 14vw, 10rem)' }}>
          OUR<br />COFFEE
        </h1>
      </section>

      {/* Featured: Blend #43 */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid md:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* Product image */}
          <div className="relative overflow-hidden bg-[#111] aspect-square md:aspect-auto md:h-[560px]">
            <img
              src="/images/hero-product.jpg"
              alt="Blend #43 — Urban Bourbon"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to top, rgba(13,13,13,0.5) 0%, transparent 55%)'
            }} />
          </div>

          {/* Product details */}
          <div data-product-card="" className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="bg-[#39FF14] text-black font-['Bebas_Neue'] text-xs tracking-[3px] px-3 py-1">
                OUT NOW
              </span>
              <span className="text-white/30 font-['Barlow_Condensed'] text-xs tracking-[3px] uppercase">
                Blend #43
              </span>
            </div>

            <h2 className="font-['Bebas_Neue'] text-white leading-none tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}>
              BLEND<br /><span className="text-[#39FF14]">#43</span>
            </h2>

            <div className="flex flex-col gap-2">
              <p className="font-['Barlow_Condensed'] text-white/55 text-sm tracking-[2px] uppercase">
                Ethiopian Origin · Bright &amp; Fruity
              </p>
              <p className="font-['Inter'] text-white/45 text-base leading-relaxed font-light">
                Our debut blend. A fair trade, small batch Ethiopian whole bean coffee — bright, fruity, and unlike anything you've tasted. The first of many.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Whole Bean', 'Fair Trade', 'Small Batch', '250g'].map(tag => (
                <span key={tag}
                  className="border border-white/12 text-white/35 font-['Barlow_Condensed'] text-[0.65rem] tracking-[3px] uppercase px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>

            <RadarChart values={BLEND_43_PROFILE} />

            <div className="border-t border-white/[0.08] pt-6 flex items-end justify-between flex-wrap gap-5">
              <div>
                <p className="font-['Barlow_Condensed'] text-white/30 text-xs tracking-[3px] uppercase mb-1">Price</p>
                <p className="font-['Bebas_Neue'] text-white leading-none" style={{ fontSize: '3.5rem' }}>
                  £10.99
                </p>
              </div>
              <div>
                {added ? (
                  <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[4px] uppercase">
                    ADDED TO BAG ✓
                  </p>
                ) : (
                  <button
                    data-add-to-bag=""
                    onClick={() => setAdded(true)}
                    className="bg-[#39FF14] text-black font-['Barlow_Condensed'] font-bold text-sm tracking-[0.2em] uppercase px-12 py-4 hover:bg-[#2ce010] transition-all duration-200 hover:scale-[1.03]"
                  >
                    ADD TO BAG
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Coming Soon blends */}
      <section className="border-t border-white/[0.06] bg-[#0a0a0a] py-20 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[0.35em] uppercase mb-2">
                The Range
              </p>
              <h2 className="font-['Bebas_Neue'] text-white leading-none tracking-tight"
                style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}>
                MORE<br /><span className="text-[#39FF14]">DROPPING SOON</span>
              </h2>
            </div>
            <p className="text-white/30 font-['Inter'] font-light text-sm leading-relaxed max-w-xs">
              Register your interest and be first to know when each blend drops.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMING_SOON.map(blend => (
              <NotifyCard key={blend.key} blend={blend} />
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
