import { useState } from 'react'

const DISCOUNT = 0.10

const BLENDS = [
  {
    sku: 'ub-43',
    number: '43',
    name: 'BLEND #43',
    subtitle: 'Ethiopian · Bright & Fruity',
    image: '/images/fam-43.png',
    sizes: [
      { label: '125g', price: 6.99 },
      { label: '1kg',  price: 30   },
    ],
    formats: null,
  },
  {
    sku: 'ub-41',
    number: '41',
    name: '#41 COLOMBIAN GOLD',
    subtitle: 'Colombia Excelso · Washed',
    image: '/images/fam-41.png',
    sizes: [
      { label: '125g', price: 7.49 },
      { label: '1kg',  price: 34   },
    ],
    formats: ['Whole Beans', 'Ground Medium'],
  },
  {
    sku: 'ub-17',
    number: '17',
    name: '#17 COCOA RIDGE',
    subtitle: 'Nicaragua Jinotega · Washed',
    image: '/images/fam-17.png',
    sizes: [
      { label: '125g', price: 8.49 },
      { label: '1kg',  price: 36   },
    ],
    formats: null,
  },
]

const FREQUENCIES = [
  { value: '2w', label: 'Every 2 Weeks', sublabel: 'The serious drinker' },
  { value: '4w', label: 'Every 4 Weeks', sublabel: 'The measured approach' },
]

export default function Subscriptions() {
  const [blend, setBlend]         = useState(BLENDS[0])
  const [size, setSize]           = useState(BLENDS[0].sizes[0].label)
  const [format, setFormat]       = useState(null)
  const [frequency, setFrequency] = useState('4w')
  const [email, setEmail]         = useState('')
  const [status, setStatus]       = useState('idle')

  function selectBlend(b) {
    setBlend(b)
    setSize(b.sizes[0].label)
    setFormat(b.formats?.[0] ?? null)
  }

  const selectedSize    = blend.sizes.find(s => s.label === size) ?? blend.sizes[0]
  const fullPrice       = selectedSize.price
  const subPrice        = +(fullPrice * (1 - DISCOUNT)).toFixed(2)
  const saving          = +(fullPrice - subPrice).toFixed(2)
  const freqLabel       = FREQUENCIES.find(f => f.value === frequency)?.label ?? ''

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const formRes = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'subscription-waitlist',
          email,
          blend: blend.name,
          size,
          format: format ?? 'N/A',
          frequency: freqLabel,
        }).toString(),
      })
      fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(err => console.error('Subscribe email error:', err))
      setStatus(formRes.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="bg-[#0d0d0d] pt-16 min-h-screen">

      {/* Page header */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-12">
        <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[0.35em] uppercase mb-3">
          Urban Bourbon · Subscriptions
        </p>
        <h1
          className="font-['Bebas_Neue'] text-white leading-none tracking-tight"
          style={{ fontSize: 'clamp(4rem, 12vw, 9rem)' }}
        >
          JACK'S<br />PICK
        </h1>
        <div className="flex gap-5 items-start mt-8 max-w-lg">
          <img
            src="/images/bear-nobg.png"
            alt=""
            aria-hidden="true"
            className="w-12 h-auto shrink-0 mt-1 opacity-75"
          />
          <p className="font-['Inter'] text-white/50 text-base leading-relaxed font-light">
            I pick the blend. You tell me how often and how you brew it. It shows up.
            That's the deal — and ten percent off every delivery because you committed.
            I respect that.
          </p>
        </div>
      </section>

      {/* Configurator */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 xl:gap-20 items-start">

            {/* ── Left: selectors ── */}
            <div className="flex flex-col gap-10">

              {/* Blend */}
              <div>
                <p className="font-['Barlow_Condensed'] text-white/30 text-xs tracking-[3px] uppercase mb-4">
                  Choose your blend
                </p>
                <div className="flex flex-col gap-3">
                  {BLENDS.map(b => (
                    <button
                      key={b.sku}
                      onClick={() => selectBlend(b)}
                      className={`flex items-center gap-4 border px-5 py-4 text-left transition-all duration-150 ${
                        blend.sku === b.sku
                          ? 'border-[#39FF14] bg-[#39FF14]/[0.04]'
                          : 'border-white/10 hover:border-white/25'
                      }`}
                    >
                      <img src={b.image} alt="" className="w-10 h-10 object-contain shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-['Bebas_Neue'] text-white text-lg tracking-wide leading-none">
                          {b.name}
                        </p>
                        <p className="font-['Barlow_Condensed'] text-white/40 text-xs tracking-[2px] uppercase mt-0.5">
                          {b.subtitle}
                        </p>
                      </div>
                      {blend.sku === b.sku && (
                        <span className="shrink-0 font-['Bebas_Neue'] text-[#39FF14] text-xs tracking-[3px]">
                          SELECTED
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grind (only when formats exist) */}
              {blend.formats && blend.formats.length > 1 && (
                <div>
                  <p className="font-['Barlow_Condensed'] text-white/30 text-xs tracking-[3px] uppercase mb-3">
                    Grind
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {blend.formats.map(f => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`font-['Barlow_Condensed'] font-bold text-sm tracking-[2px] px-5 py-2 border transition-all duration-150 ${
                          format === f
                            ? 'bg-[#39FF14] border-[#39FF14] text-black'
                            : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/70'
                        }`}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              <div>
                <p className="font-['Barlow_Condensed'] text-white/30 text-xs tracking-[3px] uppercase mb-3">
                  Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {blend.sizes.map(s => (
                    <button
                      key={s.label}
                      onClick={() => setSize(s.label)}
                      className={`font-['Barlow_Condensed'] font-bold text-sm tracking-[2px] px-5 py-2 border transition-all duration-150 ${
                        size === s.label
                          ? 'bg-[#39FF14] border-[#39FF14] text-black'
                          : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/70'
                      }`}
                    >
                      {s.label} — £{s.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <p className="font-['Barlow_Condensed'] text-white/30 text-xs tracking-[3px] uppercase mb-3">
                  Delivery frequency
                </p>
                <div className="flex gap-3 flex-wrap">
                  {FREQUENCIES.map(f => (
                    <button
                      key={f.value}
                      onClick={() => setFrequency(f.value)}
                      className={`flex flex-col items-start px-5 py-4 border transition-all duration-150 ${
                        frequency === f.value
                          ? 'border-[#39FF14] bg-[#39FF14]/[0.04]'
                          : 'border-white/10 hover:border-white/25'
                      }`}
                    >
                      <span className={`font-['Bebas_Neue'] text-base tracking-wide ${
                        frequency === f.value ? 'text-[#39FF14]' : 'text-white'
                      }`}>
                        {f.label}
                      </span>
                      <span className="font-['Barlow_Condensed'] text-white/35 text-xs tracking-[1px] uppercase mt-0.5">
                        {f.sublabel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Right: summary + CTA ── */}
            <div className="border border-white/[0.08] p-8 flex flex-col gap-7">

              {/* Summary */}
              <div>
                <p className="font-['Barlow_Condensed'] text-white/30 text-xs tracking-[3px] uppercase mb-5">
                  Your subscription
                </p>
                <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-5 mb-5">
                  <div>
                    <p className="font-['Bebas_Neue'] text-white text-xl tracking-wide leading-tight">
                      {blend.name}
                    </p>
                    <p className="font-['Barlow_Condensed'] text-white/35 text-xs tracking-[2px] uppercase mt-1.5">
                      {size}{format ? ` · ${format}` : ''} · {freqLabel}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-['Barlow_Condensed'] text-white/30 text-sm line-through">
                      £{fullPrice.toFixed(2)}
                    </p>
                    <p className="font-['Bebas_Neue'] text-[#39FF14] leading-none" style={{ fontSize: '2.5rem' }}>
                      £{subPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-['Barlow_Condensed'] text-white/35 text-xs tracking-[2px] uppercase">
                    You save
                  </span>
                  <span className="font-['Bebas_Neue'] text-[#39FF14]/70 text-xl tracking-wide">
                    £{saving.toFixed(2)} per delivery
                  </span>
                </div>
              </div>

              {/* Incentive callout */}
              <div className="border border-[#39FF14]/15 bg-[#39FF14]/[0.03] px-5 py-4">
                <p className="font-['Barlow_Condensed'] text-[#39FF14]/70 text-xs tracking-[2px] uppercase mb-1">
                  10% off every delivery
                </p>
                <p className="font-['Inter'] text-white/40 text-xs leading-relaxed">
                  Locked-in rate. Cancel any time. No drama.
                </p>
              </div>

              {/* CTA */}
              {status === 'success' ? (
                <div className="text-center py-4">
                  <p className="font-['Bebas_Neue'] text-[#39FF14] text-xl tracking-[3px]">
                    YOU'RE ON THE LIST
                  </p>
                  <p className="font-['Inter'] text-white/35 text-sm mt-2">
                    We'll be in touch when subscriptions go live.
                  </p>
                </div>
              ) : (
                <form
                  name="subscription-waitlist"
                  method="POST"
                  data-netlify="true"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3"
                >
                  <input type="hidden" name="form-name"  value="subscription-waitlist" />
                  <input type="hidden" name="blend"      value={blend.name} />
                  <input type="hidden" name="size"       value={size} />
                  <input type="hidden" name="format"     value={format ?? 'N/A'} />
                  <input type="hidden" name="frequency"  value={freqLabel} />

                  {status === 'error' && (
                    <p className="font-['Barlow_Condensed'] text-red-400 text-xs tracking-[2px] uppercase">
                      Something went wrong — try again.
                    </p>
                  )}

                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                    className="bg-transparent border border-white/20 text-white font-['Inter'] text-sm px-4 py-3 placeholder:text-white/25 focus:outline-none focus:border-[#39FF14]/50 transition-colors duration-150"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-[#39FF14] text-black font-['Barlow_Condensed'] font-bold text-sm tracking-[0.2em] uppercase px-12 py-4 hover:bg-[#2ce010] transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {status === 'loading' ? '…' : 'JOIN THE WAITLIST'}
                  </button>
                  <p className="font-['Inter'] text-white/20 text-xs text-center leading-relaxed">
                    Stripe subscription billing isn't live yet — this saves your preference
                    and we'll confirm everything by email when it launches.
                  </p>
                </form>
              )}

            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
