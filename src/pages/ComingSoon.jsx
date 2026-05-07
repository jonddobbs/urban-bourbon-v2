import { useState } from 'react'

export default function ComingSoon({ page = 'This Page' }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center pt-16 px-4">
      <div className="text-center max-w-2xl mx-auto">
        <img
          src="/images/bear.png"
          alt="Urban Bourbon Bear"
          className="w-40 h-auto mx-auto mb-8 drop-shadow-[0_0_30px_rgba(57,255,20,0.25)]"
        />
        <p className="font-['Barlow_Condensed'] text-[#39FF14] text-base tracking-[0.35em] uppercase mb-2">
          {page}
        </p>
        <h1 className="font-['Barlow_Condensed'] font-black text-white text-7xl sm:text-8xl leading-none uppercase mb-6">
          COMING<br /><span className="text-[#39FF14]">SOON</span>
        </h1>
        <p className="text-white/50 font-['Inter'] text-lg mb-10">Something good is brewing.</p>

        {submitted ? (
          <p className="font-['Barlow_Condensed'] text-[#39FF14] text-xl tracking-wider border border-[#39FF14]/40 px-8 py-4 rounded">
            YOU'RE ON THE LIST.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Be first to know — your email"
              required
              className="flex-1 bg-white/5 border border-white/10 focus:border-[#39FF14] outline-none rounded px-4 py-3 text-white placeholder-white/25 font-['Inter'] text-sm transition-colors duration-200"
            />
            <button
              type="submit"
              className="bg-[#39FF14] text-black font-['Barlow_Condensed'] font-bold text-sm tracking-widest uppercase px-7 py-3 rounded hover:bg-[#2ce010] transition-colors duration-200 whitespace-nowrap"
            >
              NOTIFY ME
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
