import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CODE = 'CWMCARN10'

export default function Qr() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) return
    setStatus('loading')
    const trimmedEmail = email.trim()
    const { error } = await supabase.from('signups').insert({ email: trimmedEmail, source: 'qr' })
    if (!error) {
      fetch('/.netlify/functions/qr-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      }).catch(err => console.error('QR signup email error:', err))
    }
    setStatus(error ? 'error' : 'success')
  }

  return (
    <main className="bg-[#0d0d0d] min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      {status === 'success' ? (
        <div className="flex flex-col items-center gap-4 max-w-sm">
          <p className="font-['Bebas_Neue'] text-[#39FF14] text-4xl sm:text-5xl tracking-wide">
            YOU'RE IN.
          </p>
          <p className="font-['Inter'] text-white/60 text-base leading-relaxed">
            Keep an eye on your inbox — your code's on its way. Can't wait? Here it is:
          </p>
          <p className="font-['Bebas_Neue'] text-[#39FF14] text-3xl tracking-[4px] border border-[#39FF14] bg-[#39FF14]/[0.04] px-8 py-3">
            {CODE}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <img src="/images/logo.png" alt="Urban Bourbon" className="h-14 w-auto" />

          <h1 className="font-['Bebas_Neue'] text-white text-5xl sm:text-6xl leading-none tracking-tight">
            URBAN <span className="text-[#39FF14]">BOURBON</span>
          </h1>

          <p className="font-['Inter'] text-white/70 text-lg leading-snug">
            Sign up now for <span className="text-[#39FF14] font-semibold">10% off your first bag</span>.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-2">
            <label htmlFor="qr-email" className="sr-only">Email address</label>
            <input
              id="qr-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (status !== 'idle') setStatus('idle') }}
              placeholder="Your email address"
              required
              className="w-full bg-white/5 border border-white/15 focus:border-[#39FF14] outline-none rounded-sm px-5 py-5 text-white placeholder-white/25 font-['Inter'] text-lg transition-colors duration-200"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#39FF14] text-black font-['Bebas_Neue'] text-2xl tracking-[3px] py-5 rounded-sm hover:bg-[#2ce010] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? '...' : 'GET 10% OFF'}
            </button>
            {status === 'error' && (
              <p className="font-['Barlow_Condensed'] text-red-400 text-sm tracking-wide uppercase">
                Something went wrong — try again.
              </p>
            )}
          </form>
        </div>
      )}
    </main>
  )
}
