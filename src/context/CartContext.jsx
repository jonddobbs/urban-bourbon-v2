import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('ub-cart')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('ub-cart', JSON.stringify(items))
  }, [items])

  function addToCart(product) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsOpen(true)
  }

  function removeFromCart(productId) {
    setItems(prev => prev.filter(i => i.id !== productId))
  }

  function updateQuantity(productId, qty) {
    if (qty <= 0) {
      removeFromCart(productId)
      return
    }
    setItems(prev =>
      prev.map(i => i.id === productId ? { ...i, quantity: qty } : i)
    )
  }

  function clearCart() {
    setItems([])
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isOpen,
      openDrawer: () => setIsOpen(true),
      closeDrawer: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
