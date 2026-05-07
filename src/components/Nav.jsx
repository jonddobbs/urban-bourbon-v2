import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { label: 'HOME', to: '/' },
  { label: 'COFFEE', to: '/coffee' },
  { label: 'MERCH', to: '/merch' },
  { label: 'SUBSCRIPTIONS', to: '/subscriptions' },
  { label: 'OUR STORY', to: '/our-story' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" onClick={() => setOpen(false)}>
          <img src="/images/logo.png" alt="Urban Bourbon" className="h-9 w-auto" />
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className={`font-['Barlow_Condensed'] font-bold text-sm tracking-[0.15em] uppercase transition-colors duration-200 ${
                  pathname === to ? 'text-[#39FF14]' : 'text-white/80 hover:text-[#39FF14]'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

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
          </ul>
        </div>
      )}
    </nav>
  )
}
