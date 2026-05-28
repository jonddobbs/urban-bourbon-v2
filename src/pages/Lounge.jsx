import { useAuth } from '../context/AuthContext'

const benefits = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </svg>
    ),
    title: 'EARLY ACCESS',
    copy: 'Be the first to know about new coffees, limited batches and special invitations — before they go public.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
      </svg>
    ),
    title: 'EXCLUSIVE DROPS',
    copy: 'Members-only coffees and collaborations. Built for those at the top table. Not available anywhere else.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: 'ORDER HISTORY',
    copy: 'View your past orders, sizes and notes. Track everything in one place and reorder your favourites with ease.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    title: 'REWARDS',
    copy: 'Earn points on every order. Unlock exclusives, free bags and member-only perks the more you brew with us.',
  },
]

export default function Lounge() {
  const { user } = useAuth()

  return (
    <main className="bg-[#0d0d0d]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background image */}
        <img
          src="/images/Welcome to the Lounge.png?v=2"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Blur layer — smears the baked-in concept text in the image */}
        <div
          className="absolute inset-0"
          style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        />
        {/* Dark overlay — 25% on mobile, 35% on desktop */}
        <div className="absolute inset-0 sm:hidden" style={{ background: 'rgba(3,2,1,0.25)' }} />
        <div className="absolute inset-0 hidden sm:block" style={{ background: 'rgba(3,2,1,0.35)' }} />
        {/* Edge vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(3,2,1,0.2) 0%, rgba(3,2,1,0) 20%, rgba(3,2,1,0) 70%, rgba(3,2,1,0.5) 100%)',
          }}
        />

        {/* Hero content — full width so heading is unconstrained */}
        <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-10 py-24 w-full">

          {/* Eyebrow */}
          <p
            className="font-['Barlow_Condensed'] tracking-[0.45em] uppercase mb-5 text-xs"
            style={{ color: 'rgba(201,168,76,0.7)' }}
          >
            Urban Bourbon · Members
          </p>

          {/* Heading — single line, scales with viewport */}
          <h1
            className="font-['Bebas_Neue'] leading-none tracking-[0.06em] mb-6"
            style={{
              fontSize: 'clamp(3rem, 11vw, 9.5rem)',
              whiteSpace: 'nowrap',
              color: '#c9a84c',
              textShadow: '0 0 60px rgba(201,168,76,0.25), 0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            THE LOUNGE
          </h1>

          {/* Everything below the heading — constrained width */}
          <div className="flex flex-col items-center max-w-md w-full">

            {/* Subtitle — serif italic */}
            <p
              className="text-white/90 mb-5"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic',
                fontSize: 'clamp(1.05rem, 2vw, 1.35rem)',
                letterSpacing: '0.02em',
              }}
            >
              Members Only. You&rsquo;re in.
            </p>

            {/* Thin gold rule */}
            <div
              className="w-16 mb-6"
              style={{ height: '1px', background: 'rgba(201,168,76,0.5)' }}
            />

            {/* Body copy */}
            <p
              className="font-['Inter'] font-light leading-relaxed mb-4"
              style={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.95rem' }}
            >
              A private space for our most loyal community. Exclusive coffees.
              First access. Rewarded loyalty. Pull up a chair — you belong here.
            </p>

            {/* Personalised greeting */}
            {user?.email && (
              <p
                className="font-['Barlow_Condensed'] tracking-widest uppercase mb-8 text-sm"
                style={{ color: 'rgba(201,168,76,0.65)' }}
              >
                Welcome back, {user.email}
              </p>
            )}

            {/* CTA — gold outline button */}
            <button
              className="font-['Bebas_Neue'] tracking-[0.18em] text-lg px-10 py-3.5 transition-all duration-200 whitespace-nowrap"
              style={{
                color: '#c9a84c',
                border: '1px solid rgba(201,168,76,0.6)',
                background: 'rgba(201,168,76,0.06)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.14)'
                e.currentTarget.style.borderColor = '#c9a84c'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.06)'
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'
              }}
            >
              WELCOME BACK, MEMBER
            </button>

          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0d0d0d] py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Section label */}
          <p
            className="font-['Barlow_Condensed'] text-center tracking-[0.4em] uppercase text-xs mb-14"
            style={{ color: 'rgba(201,168,76,0.5)' }}
          >
            Your Member Benefits
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map(({ icon, title, copy }) => (
              <div
                key={title}
                className="flex flex-col gap-5 p-7 transition-all duration-300 group"
                style={{
                  background: '#0a0a0a',
                  border: '1px solid rgba(201,168,76,0.15)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                  e.currentTarget.style.background = '#0d0a04'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'
                  e.currentTarget.style.background = '#0a0a0a'
                }}
              >
                {/* Icon */}
                <div style={{ color: '#c9a84c' }}>{icon}</div>

                {/* Title */}
                <h3
                  className="font-['Bebas_Neue'] tracking-[0.1em]"
                  style={{ color: '#c9a84c', fontSize: '1.35rem' }}
                >
                  {title}
                </h3>

                {/* Copy */}
                <p
                  className="font-['Inter'] font-light leading-relaxed text-sm"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer strip ─────────────────────────────────────────────────── */}
      <div
        className="px-5 sm:px-10 py-7"
        style={{ borderTop: '1px solid rgba(201,168,76,0.15)' }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center sm:text-left">

          <p
            className="font-['Barlow_Condensed'] tracking-[0.22em] uppercase text-xs"
            style={{ color: 'rgba(201,168,76,0.4)', fontVariant: 'small-caps' }}
          >
            Good Coffee. Properly Made. No Compromises.
          </p>

          <p
            className="font-['Barlow_Condensed'] tracking-[0.3em] uppercase text-xs text-center"
            style={{ color: 'rgba(201,168,76,0.5)' }}
          >
            ✦&ensp;Served With Purpose&ensp;✦
          </p>

          <p
            className="font-['Barlow_Condensed'] tracking-[0.22em] uppercase text-xs sm:text-right"
            style={{ color: 'rgba(201,168,76,0.4)', fontVariant: 'small-caps' }}
          >
            From Wales. For the World.
          </p>
        </div>
      </div>

    </main>
  )
}
