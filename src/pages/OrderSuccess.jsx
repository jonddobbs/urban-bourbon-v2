import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function OrderSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="bg-[#0d0d0d] min-h-screen pt-16 flex items-center justify-center px-5">
      <div className="max-w-lg w-full text-center py-20">

        {/* Icon */}
        <div className="w-20 h-20 rounded-full border-2 border-[#39FF14] flex items-center justify-center mx-auto mb-8">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M6 16l7 7 13-13"
              stroke="#39FF14"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[0.35em] uppercase mb-3">
          Order Confirmed
        </p>

        <h1
          className="font-['Bebas_Neue'] text-white leading-none tracking-tight mb-5"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 6.5rem)' }}
        >
          THANK YOU
        </h1>

        <p className="font-['Inter'] text-white/50 text-base leading-relaxed mb-2">
          Your order is on its way. We'll send a confirmation to your email shortly.
        </p>

        {sessionId && (
          <p className="font-['Barlow_Condensed'] text-white/25 text-xs tracking-widest uppercase mt-3 mb-8">
            Ref: {sessionId.slice(-12).toUpperCase()}
          </p>
        )}

        {!sessionId && <div className="mb-8" />}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <Link
            to="/coffee"
            className="bg-[#39FF14] text-[#0d0d0d] font-['Bebas_Neue'] text-lg tracking-[0.12em] px-10 py-4 rounded hover:bg-[#2ee010] transition-colors"
          >
            SHOP MORE COFFEE
          </Link>
          <Link
            to="/"
            className="font-['Barlow_Condensed'] text-white/50 text-sm tracking-widest uppercase hover:text-white/80 transition-colors"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </main>
  )
}
