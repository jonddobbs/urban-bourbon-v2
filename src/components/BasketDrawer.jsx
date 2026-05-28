import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function BasketDrawer() {
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const { user } = useAuth()
  const {
    items,
    itemCount,
    subtotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    isOpen,
    closeDrawer,
  } = useCart()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  async function handleCheckout() {
    setCheckoutError('')
    setCheckoutLoading(true)
    try {
      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            name: i.name,
            size: i.size,
            price: i.price,
            quantity: i.quantity,
          })),
          customerEmail: user?.email ?? undefined,
        }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || `Error ${res.status}`)
      }
      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      setCheckoutError(err.message)
      setCheckoutLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-[90] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#0d0d0d] border-l border-white/10 z-[100] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping basket"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="font-['Bebas_Neue'] text-[#39FF14] text-2xl tracking-wide">
            YOUR BAG{' '}
            {itemCount > 0 && (
              <span className="text-white/40 text-base ml-1 font-['Barlow_Condensed']">
                ({itemCount})
              </span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-[#39FF14] transition-colors"
            aria-label="Close basket"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-5xl mb-4 opacity-50">☕</div>
              <p className="font-['Barlow_Condensed'] text-white/40 text-lg tracking-widest uppercase">
                Your bag is empty
              </p>
              <p className="text-white/25 text-sm mt-2">Add some coffee to get started</p>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map(item => (
                <li key={item.id} className="flex gap-4 pb-5 border-b border-white/[0.08]">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded bg-[#111] border border-white/10 flex items-center justify-center shrink-0">
                    <span className="font-['Bebas_Neue'] text-[#39FF14] text-[11px] text-center leading-tight px-1">
                      BLEND<br />#{item.id.includes('43') ? '43' : '12'}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-['Barlow_Condensed'] text-white font-semibold text-base tracking-wide leading-tight">
                      {item.name}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">{item.size}</p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded border border-white/20 text-white/60 hover:border-[#39FF14] hover:text-[#39FF14] transition-colors flex items-center justify-center leading-none"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="font-['Barlow_Condensed'] text-white w-5 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded border border-white/20 text-white/60 hover:border-[#39FF14] hover:text-[#39FF14] transition-colors flex items-center justify-center leading-none"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Line price */}
                      <span className="font-['Barlow_Condensed'] text-white font-semibold tracking-wide">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="shrink-0 self-start mt-1 text-white/25 hover:text-red-400 transition-colors"
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-white/10 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="font-['Barlow_Condensed'] text-white/50 uppercase tracking-widest text-sm">
                Subtotal
              </span>
              <span className="font-['Bebas_Neue'] text-white text-3xl tracking-wide">
                £{subtotal.toFixed(2)}
              </span>
            </div>
            <p className="text-white/25 text-xs">Shipping calculated at checkout</p>

            {checkoutError && (
              <p className="text-red-400 font-['Inter'] text-xs leading-snug">{checkoutError}</p>
            )}

            <button
              id="checkout-btn"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full bg-[#39FF14] text-[#0d0d0d] font-['Bebas_Neue'] text-xl tracking-[0.12em] py-4 rounded hover:bg-[#2ee010] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? 'REDIRECTING…' : 'CHECKOUT'}
            </button>

            <button
              onClick={clearCart}
              className="w-full text-white/25 font-['Barlow_Condensed'] text-sm tracking-widest uppercase hover:text-white/50 transition-colors"
            >
              Clear bag
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
