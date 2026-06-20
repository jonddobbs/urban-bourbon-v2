import { useState } from 'react'

const TEST_ITEM = {
  name:     '[INTERNAL TEST] Do Not Buy',
  size:     'Test item — not a real product',
  price:    0.50,
  quantity: 1,
}

export default function TestCheckout() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleCheckout() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [TEST_ITEM] }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || `Error ${res.status}`)
      }
      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <main className="bg-[#0d0d0d] min-h-screen pt-16 flex items-center justify-center px-5">
      <div className="max-w-md w-full py-20">

        {/* Internal badge */}
        <div className="inline-flex items-center gap-2 border border-yellow-500/40 bg-yellow-500/[0.06] px-3 py-1.5 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          <span className="font-['Barlow_Condensed'] text-yellow-400 text-xs tracking-[3px] uppercase">
            Internal test page — not linked from the site
          </span>
        </div>

        <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[0.35em] uppercase mb-3">
          End-to-end test
        </p>
        <h1
          className="font-['Bebas_Neue'] text-white leading-none tracking-tight mb-10"
          style={{ fontSize: 'clamp(3rem, 10vw, 5.5rem)' }}
        >
          TEST<br />CHECKOUT
        </h1>

        {/* What this tests */}
        <div className="border border-white/[0.08] p-6 mb-8 space-y-3">
          <p className="font-['Barlow_Condensed'] text-white/30 text-xs tracking-[3px] uppercase mb-4">
            This run will verify
          </p>
          {[
            'Stripe Checkout session creation',
            '£3.50 shipping applied (£0.50 < £25 threshold)',
            'Webhook receives checkout.session.completed',
            'Order written to Supabase orders table',
            'Customer confirmation email (to address entered at checkout)',
            'Admin notification to hello@urbanbourbon.co.uk + jonnydd4@googlemail.com',
          ].map(item => (
            <div key={item} className="flex items-start gap-3">
              <span className="text-[#39FF14] mt-0.5 shrink-0 text-xs">✓</span>
              <span className="font-['Inter'] text-white/50 text-sm leading-snug">{item}</span>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="border border-white/[0.06] bg-white/[0.02] p-5 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-['Barlow_Condensed'] text-white text-sm font-semibold tracking-wide">
                {TEST_ITEM.name}
              </p>
              <p className="font-['Barlow_Condensed'] text-white/30 text-xs tracking-[1px] mt-0.5">
                {TEST_ITEM.size}
              </p>
            </div>
            <span className="font-['Barlow_Condensed'] text-white/50 text-sm">
              £{TEST_ITEM.price.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-white/[0.06] pt-4 text-sm">
            <span className="font-['Barlow_Condensed'] text-white/30 tracking-[1px]">Shipping</span>
            <span className="font-['Barlow_Condensed'] text-white/50">£3.50</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-['Barlow_Condensed'] text-white/50 tracking-[1px] text-sm">Total</span>
            <span className="font-['Bebas_Neue'] text-[#39FF14] text-2xl tracking-wide">£4.00</span>
          </div>
        </div>

        {error && (
          <p className="font-['Inter'] text-red-400 text-xs mb-4 leading-snug">{error}</p>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-[#39FF14] text-[#0d0d0d] font-['Bebas_Neue'] text-xl tracking-[0.12em] py-4 hover:bg-[#2ee010] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'REDIRECTING…' : 'PROCEED TO STRIPE →'}
        </button>

        <p className="font-['Inter'] text-white/20 text-xs text-center mt-4 leading-relaxed">
          Uses your live Stripe keys and charges a real card £4.00.
          Use a personal card and refund from the Stripe dashboard afterwards.
        </p>

      </div>
    </main>
  )
}
