import { useState } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const COMING_SOON = [
  {
    key: 'b12',
    name: 'BLEND #12',
    subtitle: 'THE WINTER ROAST',
    notes: 'Single Origin · Small Batch · 125g',
  },
  {
    key: 'bbs',
    name: 'BUTTERSCOTCH BOURBON MACCHIATO',
    subtitle: null,
    notes: 'Colombian Origin · Butterscotch & Toasted Almonds · 250g',
  },
  {
    key: 'bvm',
    name: 'VELVET MOCHA',
    subtitle: null,
    notes: 'Dark Roast · Dark Chocolate & Caramel',
  },
]

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) return
    setStatus('loading')
    try {
      const res = await fetch('/.netlify/functions/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), blendId: 'waitlist' }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="bg-[#0d0d0d] pt-16 min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">

          {/* Left: copy + form */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[0.35em] uppercase mb-4">
                Urban Bourbon · Limited Offer
              </p>
              <h1 className="font-['Bebas_Neue'] text-white leading-none tracking-tight"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
                THE FIRST<br />SIP IS<br /><span className="text-[#39FF14]">ON US.</span>
              </h1>
            </div>

            <p className="font-['Inter'] text-white/55 text-base leading-relaxed font-light max-w-md">
              Three new blends are coming. Join the waitlist and we'll send you a free 30g sample of Blend #43 to keep you going while you wait. You just cover the postage.
            </p>

            <div className="flex flex-wrap gap-3">
              {['Free 30g Sample', 'Blend #43', 'Just Pay Postage', 'Early Access'].map(tag => (
                <span key={tag}
                  className="border border-white/12 text-white/35 font-['Barlow_Condensed'] text-[0.65rem] tracking-[3px] uppercase px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>

            {/* Form */}
            <div className="border border-white/[0.08] p-6 bg-[#111]">
              {status === 'success' ? (
                <div className="flex flex-col gap-2">
                  <p className="font-['Bebas_Neue'] text-[#39FF14] text-2xl tracking-[3px]">
                    YOU'RE ON THE LIST.
                  </p>
                  <p className="font-['Inter'] text-white/40 text-sm leading-relaxed">
                    We'll be in touch with your sample details shortly. In the meantime — check out Blend #43.
                  </p>
                </div>
              ) : (
                <>
                  <p className="font-['Barlow_Condensed'] text-white/50 text-xs tracking-[3px] uppercase mb-4">
                    Claim your free sample
                  </p>
                  {status === 'error' && (
                    <p className="font-['Barlow_Condensed'] text-red-400 text-xs tracking-[2px] uppercase mb-3">
                      Something went wrong — try again.
                    </p>
                  )}
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); if (status !== 'idle') setStatus('idle') }}
                      placeholder="Your email address"
                      required
                      className="flex-1 min-w-0 bg-white/5 border border-white/10 focus:border-[#39FF14] outline-none px-4 py-3.5 text-white placeholder-white/20 font-['Inter'] text-sm transition-colors duration-200"
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="bg-[#39FF14] text-black font-['Bebas_Neue'] text-base tracking-[3px] px-8 py-3.5 hover:bg-[#2ce010] transition-all duration-200 hover:scale-[1.02] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? '...' : "I'M IN"}
                    </button>
                  </form>
                  <p className="font-['Inter'] text-white/20 text-xs mt-3 leading-relaxed">
                    No spam. Unsubscribe any time. Sample subject to availability.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right: product image */}
          <div className="relative hidden md:block">
            <div className="relative aspect-square overflow-hidden bg-[#111]">
              <img
                src="/images/hero-product.jpg"
                alt="Blend #43 — Urban Bourbon"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="bg-[#39FF14] text-black font-['Bebas_Neue'] text-xs tracking-[3px] px-3 py-1 block w-fit mb-2">
                  YOUR FREE SAMPLE
                </span>
                <p className="font-['Bebas_Neue'] text-white text-4xl leading-none tracking-tight">
                  BLEND <span className="text-[#39FF14]">#43</span>
                </p>
                <p className="font-['Barlow_Condensed'] text-white/40 text-xs tracking-[3px] uppercase mt-1">
                  Ethiopian Origin · 30g
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── What's coming ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="mb-12">
          <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[0.35em] uppercase mb-3">
            On the way
          </p>
          <h2 className="font-['Bebas_Neue'] text-white leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            THREE BLENDS.<br />ALL DROPPING SOON.
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-px bg-white/[0.06]">
          {COMING_SOON.map(blend => (
            <div key={blend.key} className="bg-[#0d0d0d] p-8 flex flex-col gap-3">
              <span className="font-['Barlow_Condensed'] text-[#39FF14]/50 text-[10px] tracking-[4px] uppercase">
                Coming Soon
              </span>
              <h3 className="font-['Bebas_Neue'] text-white leading-tight tracking-wide"
                style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                {blend.name}
              </h3>
              {blend.subtitle && (
                <p className="font-['Barlow_Condensed'] text-[#39FF14] text-xs tracking-[4px] uppercase">
                  {blend.subtitle}
                </p>
              )}
              <p className="font-['Barlow_Condensed'] text-white/30 text-xs tracking-[2px] uppercase leading-relaxed">
                {blend.notes}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-white/[0.06] bg-[#111]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-['Bebas_Neue'] text-white text-3xl tracking-wide leading-tight">
              ALREADY TRIED BLEND #43?
            </p>
            <p className="font-['Inter'] text-white/35 text-sm mt-1">
              It's available now — 250g whole bean, £10.99.
            </p>
          </div>
          <a
            href="/coffee"
            className="border border-[#39FF14]/50 text-[#39FF14] font-['Bebas_Neue'] text-base tracking-[3px] px-10 py-4 hover:bg-[#39FF14] hover:text-black transition-all duration-200 whitespace-nowrap"
          >
            SHOP NOW
          </a>
        </div>
      </section>

    </main>
  )
}
