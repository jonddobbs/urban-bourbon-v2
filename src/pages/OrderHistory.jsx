import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function OrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.email) return

    async function fetchOrders() {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false })
      if (fetchError) {
        console.error('[OrderHistory] fetch error:', fetchError)
        setError('Could not load your orders — please try again shortly.')
      }
      setOrders(data ?? [])
      setLoading(false)
    }

    fetchOrders()
  }, [user?.email])

  return (
    <main className="bg-[#0d0d0d] min-h-screen pt-32 pb-24 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <p
          className="font-['Barlow_Condensed'] tracking-[0.45em] uppercase mb-4 text-xs"
          style={{ color: 'rgba(201,168,76,0.7)' }}
        >
          Urban Bourbon · Members
        </p>
        <h1
          className="font-['Bebas_Neue'] leading-none tracking-[0.06em] mb-3"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', color: '#c9a84c' }}
        >
          ORDER HISTORY
        </h1>
        <Link
          to="/lounge"
          className="font-['Barlow_Condensed'] text-white/40 text-sm tracking-widest uppercase hover:text-white/70 transition-colors inline-block mb-12"
        >
          ← Back to the Lounge
        </Link>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-['Barlow_Condensed'] text-white/40 text-sm tracking-widest uppercase">
              Loading your orders…
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="font-['Inter'] text-white/50 text-sm py-10 text-center">{error}</p>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20">
            <p className="font-['Inter'] font-light text-white/45 text-sm leading-relaxed mb-8">
              No orders yet — your history will appear here once you place your first order.
            </p>
            <Link
              to="/coffee"
              className="bg-[#39FF14] text-[#0d0d0d] font-['Bebas_Neue'] text-lg tracking-[0.12em] px-10 py-4 rounded hover:bg-[#2ee010] transition-colors inline-block"
            >
              SHOP COFFEE
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && orders.length > 0 && (
          <div className="flex flex-col gap-5">
            {orders.map(order => (
              <div
                key={order.id}
                className="p-6 sm:p-7"
                style={{ background: '#0a0a0a', border: '1px solid rgba(201,168,76,0.15)' }}
              >
                {/* Order meta row */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <p
                    className="font-['Barlow_Condensed'] tracking-widest uppercase text-xs"
                    style={{ color: 'rgba(201,168,76,0.6)' }}
                  >
                    {new Date(order.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                  <p
                    className="font-['Barlow_Condensed'] tracking-widest uppercase text-xs px-3 py-1"
                    style={{ color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}
                  >
                    {order.status ?? 'pending'}
                  </p>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-2 mb-5">
                  {(order.items ?? []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm font-['Inter']">
                      <span className="text-white/70">
                        {item.name}
                        {item.size ? ` — ${item.size}` : ''}
                        {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                      </span>
                      <span className="text-white/45">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: '1px solid rgba(201,168,76,0.15)' }}
                >
                  <span className="font-['Barlow_Condensed'] tracking-widest uppercase text-xs text-white/40">
                    Total
                  </span>
                  <span className="font-['Bebas_Neue'] tracking-wide text-lg" style={{ color: '#c9a84c' }}>
                    £{Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
