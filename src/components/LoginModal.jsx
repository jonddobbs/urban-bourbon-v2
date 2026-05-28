import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginModal({ onClose, onSwitch }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ animation: 'modalFadeIn 0.2s ease both' }}
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div
        className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-md p-8 rounded"
        style={{ animation: 'modalSlideUp 0.25s ease both' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/35 hover:text-white/70 transition-colors"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <h2 className="font-['Bebas_Neue'] text-[#39FF14] text-3xl tracking-wide mb-1">SIGN IN</h2>
        <p className="text-white/40 font-['Inter'] text-sm mb-7">Welcome back to Urban Bourbon.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-['Barlow_Condensed'] text-white/45 text-xs tracking-[3px] uppercase block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="you@example.com"
              className="w-full bg-[#111] border border-white/15 text-white font-['Inter'] text-sm px-4 py-3 rounded focus:outline-none focus:border-[#39FF14]/50 transition-colors placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="font-['Barlow_Condensed'] text-white/45 text-xs tracking-[3px] uppercase block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#111] border border-white/15 text-white font-['Inter'] text-sm px-4 py-3 rounded focus:outline-none focus:border-[#39FF14]/50 transition-colors placeholder:text-white/20"
            />
          </div>

          {error && (
            <p className="text-red-400 font-['Inter'] text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#39FF14] text-[#0d0d0d] font-['Bebas_Neue'] text-xl tracking-[0.12em] py-4 rounded hover:bg-[#2ee010] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {loading ? 'SIGNING IN…' : 'SIGN IN'}
          </button>
        </form>

        <p className="text-white/35 font-['Inter'] text-sm text-center mt-6">
          Don&apos;t have an account?{' '}
          <button
            onClick={onSwitch}
            className="text-[#39FF14] hover:underline underline-offset-2"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}
