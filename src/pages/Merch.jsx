import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Merch() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      // Save to signups table tagged as merch — fire and forget
      supabase.from('signups').insert({ email: email.trim(), source: 'merch' })
        .then(({ error }) => { if (error) console.error('[Merch] signups insert:', error) })

      setStatus('success')
    } catch (err) {
      console.error('[Merch] subscribe error:', err)
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] pt-16">

      {/* Lifestyle hero */}
      <div className="relative w-full h-[65vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
        <img
          src="/images/better-days-person.png"
          alt="Better Coffee Better Days — Urban Bourbon"
          className="absolute inset-0 w-full h-full object-cover [object-position:30%_50%] sm:object-center"
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(13,13,13,0.15) 0%, transparent 40%, rgba(13,13,13,0.85) 100%)'
        }} />
      </div>

      {/* Merch preview — heading and subtitle are baked into the image */}
      <img
        src="/images/merch-coming-soon.png"
        alt="Urban Bourbon merch coming soon — t-shirts, hoodies, hats, mugs and more"
        className="w-full max-w-5xl mx-auto block"
      />

      {/* Notify Me form */}
      <div className="px-4 py-14 flex flex-col items-center gap-3 max-w-md mx-auto">
        {status === 'success' ? (
          <p className="font-['Bebas_Neue'] text-[#39FF14] text-xl tracking-wider border border-[#39FF14]/40 px-8 py-4">
            YOU'RE ON THE LIST.
          </p>
        ) : (
          <>
            {status === 'error' && (
              <p className="font-['Barlow_Condensed'] text-red-400 text-sm tracking-[2px] uppercase">
                Something went wrong — try again.
              </p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (status !== 'idle') setStatus('idle') }}
                placeholder="Be first to know — your email"
                required
                className="flex-1 bg-white/5 border border-white/10 focus:border-[#39FF14] outline-none rounded px-4 py-3 text-white placeholder-white/25 font-['Inter'] text-sm transition-colors duration-200"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#39FF14] text-black font-['Barlow_Condensed'] font-bold text-sm tracking-widest uppercase px-7 py-3 rounded hover:bg-[#2ce010] transition-colors duration-200 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? '…' : 'NOTIFY ME'}
              </button>
            </form>
          </>
        )}
      </div>

    </main>
  )
}
