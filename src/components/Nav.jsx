import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'
import SignUpModal from './SignUpModal'

const links = [
  { label: 'HOME', to: '/' },
  { label: 'COFFEE', to: '/coffee' },
  { label: 'ORIGINS', to: '/origins' },
  { label: 'MERCH', to: '/merch' },
  { label: 'SUBSCRIPTIONS', to: '/subscriptions' },
  { label: 'OUR STORY', to: '/our-story' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [authModal, setAuthModal] = useState(null) // 'login' | 'signup' | null
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  const { pathname } = useLocation()
  const { itemCount, openDrawer } = useCart()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    function onClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function handleSignOut() {
    setUserMenuOpen(false)
    await signOut()
  }

  const emailDisplay = user?.email
    ? user.email.length > 18 ? user.email.slice(0, 15) + '…' : user.email
    : ''

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="font-['Bebas_Neue'] leading-none hover:opacity-80 transition-opacity duration-200"
            style={{ color: pathname === '/lounge' ? '#c9a84c' : '#39FF14', fontSize: '28px', lineHeight: 1.05 }}
          >
            URBAN<br />BOURBON
          </Link>

          <div className="flex items-center gap-3">
            <ul className="hidden md:flex items-center gap-10">
              {links.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`font-['Barlow_Condensed'] font-bold text-base tracking-[0.18em] uppercase transition-colors duration-200 ${
                      pathname === to ? 'text-[#39FF14]' : 'text-white/80 hover:text-[#39FF14]'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {user && (
                <li>
                  <Link
                    to="/lounge"
                    className={`font-['Barlow_Condensed'] font-bold text-base tracking-[0.18em] uppercase transition-colors duration-200 ${
                      pathname === '/lounge' ? '' : ''
                    }`}
                    style={{
                      color: pathname === '/lounge' ? '#c9a84c' : 'rgba(201,168,76,0.7)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#c9a84c' }}
                    onMouseLeave={e => { e.currentTarget.style.color = pathname === '/lounge' ? '#c9a84c' : 'rgba(201,168,76,0.7)' }}
                  >
                    THE LOUNGE
                  </Link>
                </li>
              )}
            </ul>

            {/* Basket icon */}
            <button
              onClick={openDrawer}
              className="relative flex items-center justify-center w-9 h-9 text-white/70 hover:text-[#39FF14] transition-colors duration-200"
              aria-label={`Open basket${itemCount > 0 ? `, ${itemCount} item${itemCount !== 1 ? 's' : ''}` : ''}`}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#39FF14] text-[#0d0d0d] font-['Barlow_Condensed'] font-bold text-[10px] flex items-center justify-center leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Auth — logged out */}
            {!user && (
              <button
                onClick={() => setAuthModal('login')}
                className="hidden md:flex items-center justify-center w-9 h-9 text-white/60 hover:text-[#39FF14] transition-colors duration-200"
                aria-label="Sign in"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            )}

            {/* Auth — logged in */}
            {user && (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-1.5 text-white/60 hover:text-[#39FF14] transition-colors duration-200"
                  aria-label="Account menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-wide">
                    {emailDisplay}
                  </span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}>
                    <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[#111] border border-white/10 rounded shadow-xl py-2">
                    <p className="px-4 py-2 font-['Inter'] text-white/35 text-xs truncate border-b border-white/[0.06] mb-1">
                      {user.email}
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 font-['Barlow_Condensed'] text-white/70 text-sm tracking-wide hover:text-[#39FF14] hover:bg-white/[0.04] transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <span className={`block h-px bg-[#39FF14] transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[7px]' : 'w-full'}`} />
              <span className={`block h-px bg-[#39FF14] transition-all duration-300 ${open ? 'opacity-0 w-0' : 'w-full'}`} />
              <span className={`block h-px bg-[#39FF14] transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : 'w-full'}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-[#0d0d0d]/98 backdrop-blur-sm border-t border-white/5 px-5 pb-6 pt-4">
            <ul className="flex flex-col gap-5">
              {links.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`block font-['Barlow_Condensed'] font-bold text-xl tracking-[0.12em] uppercase transition-colors duration-200 ${
                      pathname === to ? 'text-[#39FF14]' : 'text-white hover:text-[#39FF14]'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {user && (
                <li>
                  <Link
                    to="/lounge"
                    onClick={() => setOpen(false)}
                    className="block font-['Barlow_Condensed'] font-bold text-xl tracking-[0.12em] uppercase transition-colors duration-200"
                    style={{ color: pathname === '/lounge' ? '#c9a84c' : 'rgba(201,168,76,0.75)' }}
                  >
                    THE LOUNGE
                  </Link>
                </li>
              )}
            </ul>

            {/* Mobile auth */}
            <div className="mt-6 pt-5 border-t border-white/[0.06]">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="font-['Inter'] text-white/40 text-sm truncate max-w-[180px]">{user.email}</span>
                  <button
                    onClick={() => { handleSignOut(); setOpen(false) }}
                    className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-widest uppercase"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={() => { setAuthModal('login'); setOpen(false) }}
                    className="font-['Barlow_Condensed'] font-bold text-lg tracking-[0.12em] uppercase text-white/70 hover:text-[#39FF14] transition-colors"
                  >
                    Sign In
                  </button>
                  <span className="text-white/20">·</span>
                  <button
                    onClick={() => { setAuthModal('signup'); setOpen(false) }}
                    className="font-['Barlow_Condensed'] font-bold text-lg tracking-[0.12em] uppercase text-white/70 hover:text-[#39FF14] transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth modals */}
      {authModal === 'login' && (
        <LoginModal
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal('signup')}
        />
      )}
      {authModal === 'signup' && (
        <SignUpModal
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal('login')}
        />
      )}
    </>
  )
}
