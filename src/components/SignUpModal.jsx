import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function SignUpModal({ onClose, onSwitch }) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await signUp(email, password)
      setDone(true)
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

        {done ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="font-['Bebas_Neue'] text-[#39FF14] text-3xl tracking-wide mb-2">CHECK YOUR EMAIL</h2>
            <p className="text-white/50 font-['Inter'] text-sm leading-relaxed mb-6">
              We&apos;ve sent a confirmation link to <span className="text-white/80">{email}</span>.
              Click it to activate your account.
            </p>
            <button
              onClick={onClose}
              className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-widest uppercase hover:underline underline-offset-2"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-['Bebas_Neue'] text-[#39FF14] text-3xl tracking-wide mb-1">CREATE ACCOUNT</h2>
            <p className="text-white/40 font-['Inter'] text-sm mb-7">Join the Urban Bourbon community.</p>

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
                  placeholder="Min. 6 characters"
                  className="w-full bg-[#111] border border-white/15 text-white font-['Inter'] text-sm px-4 py-3 rounded focus:outline-none focus:border-[#39FF14]/50 transition-colors placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="font-['Barlow_Condensed'] text-white/45 text-xs tracking-[3px] uppercase block mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
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
                {loading ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <p className="text-white/35 font-['Inter'] text-sm text-center mt-6">
              Already have an account?{' '}
              <button
                onClick={onSwitch}
                className="text-[#39FF14] hover:underline underline-offset-2"
              >
                Sign in
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
