import { Link } from 'react-router-dom'

export default function OurStory() {
  return (
    <main className="bg-[#0d0d0d] pt-16">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[65vh] overflow-hidden">
          <img
            src="/images/ub-cup-logo.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ opacity: 0.3 }}
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.35) 50%, rgba(13,13,13,1) 100%)'
          }} />
          <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-5 sm:px-8 max-w-7xl mx-auto w-full">
            <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[0.35em] uppercase mb-4">
              Urban Bourbon · Est. 2023
            </p>
            <h1 className="font-['Bebas_Neue'] text-white leading-none tracking-tight"
              style={{ fontSize: 'clamp(4.5rem, 13vw, 10rem)' }}>
              OUR<br />STORY
            </h1>
          </div>
        </div>
      </section>

      {/* Opening statement */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
        <p className="font-['Barlow_Condensed'] font-black text-white leading-[1.1] uppercase tracking-tight"
          style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)' }}>
          Urban Bourbon was never meant to be just another brand. It started as a reflection of the life we're trying to build.
        </p>
      </section>

      {/* Body — split with lifestyle image */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 grid md:grid-cols-2 gap-16 lg:gap-24 items-start">

          <div className="flex flex-col gap-8 order-2 md:order-1">
            <p className="text-white/55 font-['Inter'] font-light text-lg leading-relaxed">
              A slower morning with strong coffee before the world wakes up. Late nights chasing ideas. Music in the background. Clean design. Timeless clothes. Good conversation. Family. Ambition. Creativity. Freedom.
            </p>
            <p className="text-white/55 font-['Inter'] font-light text-lg leading-relaxed">
              Built from South Wales with influences pulled from everywhere — city culture, classic Americana, coffee houses, old bourbon bars, fashion, music, and the mindset of people who want more from life than just surviving the week.
            </p>
            <p className="text-white/55 font-['Inter'] font-light text-lg leading-relaxed">
              The brand was created by someone balancing careers, projects, family, and the constant drive to build something meaningful. Not perfection — purpose.
            </p>
          </div>

          <div className="relative order-1 md:order-2 overflow-hidden min-h-[55vw] md:min-h-0 md:h-[520px]">
            <img
              src="/images/ub-cup-logo.jpg"
              alt="Urban Bourbon lifestyle"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>

        </div>
      </section>

      {/* Pull quote */}
      <section className="noise bg-[#111111] py-24 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="w-10 h-px bg-[#39FF14]" />
          <blockquote
            className="font-['Bebas_Neue'] text-white leading-[1.1] tracking-[2px]"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 3.75rem)' }}
          >
            Quality over noise.<br />
            <span className="text-[#39FF14]">Authenticity over trends.</span><br />
            Experiences over excess.
          </blockquote>
          <div className="w-10 h-px bg-[#39FF14]" />
        </div>
      </section>

      {/* Closing — bear + copy */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 grid md:grid-cols-2 gap-16 items-center">

        <div className="relative flex items-end justify-center min-h-[50vw] md:min-h-[55vh]">
          <img
            src="/images/bear-nobg.png"
            alt="Jack — Urban Bourbon mascot"
            className="h-[55vh] w-auto object-contain drop-shadow-[0_0_80px_rgba(57,255,20,0.15)] relative z-10"
          />
        </div>

        <div className="flex flex-col gap-7">
          <p className="text-white/55 font-['Inter'] font-light text-lg leading-relaxed">
            Coffee became part of the ritual. Urban Bourbon became the home for all of it.
          </p>
          <div className="w-8 h-px bg-[#39FF14]" />
          <p className="text-white/55 font-['Inter'] font-light text-lg leading-relaxed">
            This is for the builders. The thinkers. The late-night planners. The early risers. The people creating a life on their own terms.
          </p>
          <h2
            className="font-['Bebas_Neue'] text-[#39FF14] leading-none"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              textShadow: '0 0 40px rgba(57,255,20,0.2)',
            }}
          >
            Welcome to<br />Urban Bourbon.
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link
              to="/coffee"
              className="bg-[#39FF14] text-black font-['Barlow_Condensed'] font-bold text-sm tracking-[0.2em] uppercase px-10 py-4 hover:bg-[#2ce010] transition-all duration-200 hover:scale-[1.03]"
            >
              SHOP COFFEE
            </Link>
            <Link
              to="/subscriptions"
              className="border border-white/20 text-white/60 font-['Barlow_Condensed'] font-bold text-sm tracking-[0.2em] uppercase px-10 py-4 hover:border-[#39FF14] hover:text-[#39FF14] transition-all duration-200"
            >
              SUBSCRIPTIONS
            </Link>
          </div>
        </div>

      </section>

    </main>
  )
}
