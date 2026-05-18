import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, Annotation } from 'react-simple-maps'
import TastingLabPanel from '../components/TastingLabPanel'

const GEO_URL = '/countries-110m.json'
const NAV_H = 64

const REGIONS = {
  231: {
    name: 'Ethiopia',
    flag: '🇪🇹',
    coords: [39.5, 9.0],
    dx: -30, dy: -15,
    flavour: 'Floral, Bright, Citrusy',
    varietals: 'Heirloom',
    process: 'Washed',
    story: 'Bright citrus. Floral jasmine. High-altitude complexity. The birthplace of coffee — wild, elegant, and completely unpredictable. Heirloom varieties grown at the edge of what\'s possible.',
    description:
      'Often considered the birthplace of coffee, Ethiopia produces some of the most complex and vibrant coffees in the world. Grown at high altitudes and processed with care, these beans deliver bright acidity, elegant floral notes, and a tea-like clarity.',
  },
  170: {
    name: 'Colombia',
    flag: '🇨🇴',
    coords: [-74.0, 4.5],
    dx: 20, dy: -25,
    flavour: 'Balanced, Caramel, Nutty',
    varietals: 'Castillo, Caturra',
    process: 'Washed',
    story: 'Caramel sweetness. Crisp mountain acidity. Silky, clean body. Where Andean valleys meet near-perfect growing conditions. Colombia doesn\'t gamble with quality — it delivers every single time.',
    description:
      "Colombia's diverse microclimates and dedicated farming traditions produce consistently excellent coffee. Expect well-balanced cups with natural sweetness, medium body, and a clean, caramel finish.",
  },
  76: {
    name: 'Brazil',
    flag: '🇧🇷',
    coords: [-51.9, -14.2],
    dx: 25, dy: 15,
    flavour: 'Chocolatey, Smooth, Low Acidity',
    varietals: 'Mundo Novo, Catuai',
    process: 'Natural',
    story: 'Dark chocolate. Toasted almond. Dense, satisfying body. The engine room of the coffee world. Natural-processed at lower altitudes — full, rich, the backbone of every great espresso blend.',
    description:
      "As the world's largest coffee producer, Brazil sets the standard for espresso bases. Natural processing gives the beans their signature low acidity, full body, and notes of dark chocolate, almonds, and brown sugar.",
  },
  320: {
    name: 'Guatemala',
    flag: '🇬🇹',
    coords: [-90.2, 15.5],
    dx: -20, dy: -25,
    flavour: 'Rich, Cocoa, Spiced',
    varietals: 'Bourbon, Caturra',
    process: 'Washed',
    story: 'Volcanic smoke. Deep cocoa. Bright citrus edge. Ancient eruptions left mineral-rich soil no other region can replicate. Guatemala puts terroir at the centre of every cup.',
    description:
      'Grown on volcanic highlands with rich mineral soils and dramatic climate swings, Guatemalan coffee is bold, complex, and distinctive. Ideal for those who want depth, smoke, and character in every cup.',
  },
  360: {
    name: 'Indonesia',
    flag: '🇮🇩',
    coords: [117.0, -2.5],
    dx: 20, dy: 20,
    flavour: 'Earthy, Dark Chocolate, Dense',
    varietals: 'Typica, Jember',
    process: 'Wet-Hulled',
    story: 'Forest floor. Dark spice. Syrupy, heavy body. Wet-hulled in Sumatra\'s highlands — a process found nowhere else on earth. Not for the timid, but unforgettable for everyone else.',
    description:
      'Indonesian coffee — especially from Sumatra — is unlike anything else. Wet-hulled processing creates a distinctively heavy, earthy cup with a deep, syrupy body. Divisive, but completely unforgettable.',
    jackQuote: "Indonesia divides people. But if you want something genuinely wild and unforgettable — this is it.",
  },
  404: {
    name: 'Kenya',
    flag: '🇰🇪',
    coords: [37.9, 0.5],
    dx: 30, dy: 20,
    flavour: 'Blackcurrant, Wine, Bright Acidity',
    varietals: 'SL28, SL34',
    process: 'Washed',
    story: 'Blackcurrant. Winey complexity. Electric acidity. Kenya produces some of the most sought-after lots on the planet — bold, fruit-forward, and impossible to ignore. This is coffee as a statement.',
    description: 'Blackcurrant. Winey complexity. Electric acidity. Kenya produces some of the most sought-after lots on the planet — bold, fruit-forward, and impossible to ignore. This is coffee as a statement.',
    jackQuote: "Kenya doesn't do subtle. Neither do I.",
  },
  887: {
    name: 'Yemen',
    flag: '🇾🇪',
    coords: [48.5, 15.5],
    dx: 30, dy: -35,
    flavour: 'Wild, Spiced, Ancient',
    varietals: 'Mocha, Dawairi',
    process: 'Natural',
    story: 'Dried fruit. Dark spice. Centuries of history in every cup. Yemen is where coffee began — traded through the ancient port of Mokha, grown on terraced hillsides without irrigation or intervention. Raw, wild, and completely irreplaceable.',
    description: 'Dried fruit. Dark spice. Centuries of history in every cup. Yemen is where coffee began — traded through the ancient port of Mokha, grown on terraced hillsides without irrigation or intervention. Raw, wild, and completely irreplaceable.',
    jackQuote: "This is where it all started. Show some respect.",
  },
  188: {
    name: 'Costa Rica',
    flag: '🇨🇷',
    coords: [-84.0, 9.7],
    dx: -30, dy: 20,
    flavour: 'Honey, Stone Fruit, Clean',
    varietals: 'Caturra, Catuai',
    process: 'Honey',
    story: 'Peach. Honey. Surgical precision. Costa Rica abolished robusta cultivation by law — only arabica allowed. The result is an obsessively clean, fruit-kissed cup that rewards those who pay attention.',
    description: 'Peach. Honey. Surgical precision. Costa Rica abolished robusta cultivation by law — only arabica allowed. The result is an obsessively clean, fruit-kissed cup that rewards those who pay attention.',
    jackQuote: "Only arabica. By law. I respect that kind of commitment.",
  },
}

const GLOW_DELAYS = { 231: '0s', 170: '0.7s', 76: '1.4s', 320: '2.1s', 360: '2.8s', 404: '3.5s', 887: '4.2s', 188: '4.9s' }

const REGION_IDS = Object.keys(REGIONS).map(Number)

// ── Icons ──────────────────────────────────────────────────────────────────────

function FlavorIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="2" fill="#39FF14" />
      {[0, 60, 120, 180, 240, 300].map(a => {
        const rad = (a * Math.PI) / 180
        return (
          <line
            key={a}
            x1={8 + 3 * Math.cos(rad)} y1={8 + 3 * Math.sin(rad)}
            x2={8 + 6 * Math.cos(rad)} y2={8 + 6 * Math.sin(rad)}
            stroke="#39FF14" strokeWidth={1.2} strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path
        d="M8 14C8 14 2 10.5 2 5.5C2 5.5 6 2 12 4C12 4 14 10 8 14Z"
        stroke="#39FF14" strokeWidth={1.2} strokeLinejoin="round"
      />
      <line x1="8" y1="14" x2="8" y2="7" stroke="#39FF14" strokeWidth={0.9} />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="2.5" stroke="#39FF14" strokeWidth={1.2} />
      <circle cx="8" cy="8" r="5.8" stroke="#39FF14" strokeWidth={1.2} strokeDasharray="2.4 1.8" />
    </svg>
  )
}

// ── Detail row ─────────────────────────────────────────────────────────────────

function DetailRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
      {icon}
      <div>
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 11,
          color: '#C9A84C',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          margin: '0 0 2px 0',
        }}>
          {label}
        </p>
        <p style={{ fontSize: 13, color: '#ffffff', margin: 0 }}>{value}</p>
      </div>
    </div>
  )
}

// ── Region modal ───────────────────────────────────────────────────────────────

function RegionModal({ region, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        animation: 'modalFadeIn 0.25s ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111111',
          border: '1px solid #2a2a2a',
          borderRadius: 12,
          padding: '40px 48px 36px',
          maxWidth: 520,
          width: '90%',
          position: 'relative',
          animation: 'modalSlideUp 0.3s ease both',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 18,
            background: 'transparent',
            border: 'none',
            color: '#52525b',
            fontSize: 28,
            lineHeight: 1,
            cursor: 'pointer',
            padding: 4,
            transition: 'color 150ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ffffff' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#52525b' }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Flag + name */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 60, lineHeight: 1, marginBottom: 12 }}>{region.flag}</div>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 48,
            color: '#39FF14',
            letterSpacing: '0.05em',
            margin: 0,
            lineHeight: 1,
          }}>
            {region.name.toUpperCase()}
          </h2>
        </div>

        {/* Details */}
        <DetailRow icon={<FlavorIcon />} label="Flavour Profile" value={region.flavour} />
        <DetailRow icon={<LeafIcon />}   label="Varietals"       value={region.varietals} />
        <DetailRow icon={<GearIcon />}   label="Process"         value={region.process} />

        <p style={{
          fontSize: 13,
          color: '#71717a',
          lineHeight: 1.7,
          marginTop: 16,
          marginBottom: 28,
        }}>
          {region.description}
        </p>

        <button
          style={{
            display: 'block',
            width: '100%',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 14,
            color: '#ffffff',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
            padding: '11px 0',
            cursor: 'pointer',
            transition: 'background 200ms, border-color 200ms, color 200ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#39FF14'
            e.currentTarget.style.borderColor = '#39FF14'
            e.currentTarget.style.color = '#0d0d0d'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
            e.currentTarget.style.color = '#ffffff'
          }}
        >
          SHOP {region.name.toUpperCase()} COFFEE
        </button>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function Origins() {
  const [selectedId, setSelectedId] = useState(null)

  function handleSelect(id) {
    setSelectedId(id)
  }

  return (
    <main style={{ paddingTop: NAV_H, background: '#0d0d0d' }}>
      <div className="origins-outer" style={{ display: 'flex', height: `calc(100vh - ${NAV_H}px)`, overflow: 'hidden' }}>

        {/* ── TASTING LAB PANEL ────────────────────────────────────────── */}
        <div className="origins-panel-wrap">
          <TastingLabPanel
            selectedId={selectedId}
            region={selectedId !== null ? REGIONS[selectedId] : null}
            onDeselect={() => setSelectedId(null)}
          />
        </div>

        {/* ── MAP AREA ─────────────────────────────────────────────────── */}
        <div className="origins-map-wrap" style={{ flex: 1, position: 'relative', height: '100%', minWidth: 0, overflow: 'hidden' }}>

          <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <ComposableMap
              projectionConfig={{ scale: 155, center: [20, 10] }}
              style={{ width: '100%', height: '100%' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const id = Number(geo.id)
                    const isHighlighted = REGION_IDS.includes(id)

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        className={isHighlighted ? 'geo-highlighted' : undefined}
                        onClick={() => isHighlighted && handleSelect(id)}
                        style={{
                          default: {
                            fill: isHighlighted ? '#1e3d10' : '#161616',
                            stroke: isHighlighted ? '#2a4a1a' : '#222222',
                            strokeWidth: isHighlighted ? 0.6 : 0.4,
                            outline: 'none',
                            transition: 'fill 200ms ease',
                            cursor: isHighlighted ? 'pointer' : 'default',
                            animationDelay: isHighlighted ? GLOW_DELAYS[id] : undefined,
                          },
                          hover: {
                            fill: isHighlighted ? '#3a7022' : '#1a1a1a',
                            stroke: isHighlighted ? '#39FF14' : '#222222',
                            strokeWidth: isHighlighted ? 0.8 : 0.4,
                            outline: 'none',
                            cursor: isHighlighted ? 'pointer' : 'default',
                            filter: isHighlighted ? 'drop-shadow(0 0 6px rgba(57,255,20,0.4))' : 'none',
                          },
                          pressed: {
                            fill: isHighlighted ? 'rgba(57,255,20,0.55)' : '#161616',
                            outline: 'none',
                          },
                        }}
                      />
                    )
                  })
                }
              </Geographies>

              {/* Annotations + Markers */}
              {Object.entries(REGIONS).map(([rawId, r]) => {
                const id = Number(rawId)
                const anchor = r.dx < 0 ? 'end' : 'start'

                return (
                  <g key={id} className="map-pin-group" onClick={() => handleSelect(id)}>
                    <Annotation
                      subject={r.coords}
                      dx={r.dx}
                      dy={r.dy}
                      connectorProps={{
                        stroke: 'rgba(57,255,20,0.3)',
                        strokeWidth: 0.6,
                        strokeLinecap: 'round',
                      }}
                    >
                      <text
                        fontFamily="'Bebas Neue', sans-serif"
                        fontSize={13}
                        fill="#E8D5A3"
                        letterSpacing={2}
                        textAnchor={anchor}
                      >
                        {r.name.toUpperCase()}
                      </text>
                      <text
                        y={14}
                        fontSize={9}
                        fill="rgba(255,255,255,0.75)"
                        textAnchor={anchor}
                        fontFamily="'Inter', sans-serif"
                        letterSpacing={0.5}
                      >
                        {r.flavour}
                      </text>
                    </Annotation>

                    <Marker coordinates={r.coords}>
                      {/* Flag emoji */}
                      <text
                        textAnchor="middle"
                        y={-12}
                        style={{ fontSize: '15px', userSelect: 'none' }}
                      >
                        {r.flag}
                      </text>
                      {/* Dot — glowing */}
                      <circle
                        r={5}
                        fill="#39FF14"
                        opacity={0.95}
                        stroke="#0d0d0d"
                        strokeWidth={1.5}
                        className="glow-dot"
                        style={{ animationDelay: GLOW_DELAYS[id] }}
                      />
                    </Marker>
                  </g>
                )
              })}
            </ComposableMap>
          </div>

          {/* Grain overlay */}
          <div style={{
            position: 'absolute',
            inset: '-10%',
            pointerEvents: 'none',
            zIndex: 4,
            opacity: 0.045,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: '300px 300px',
            animation: 'grainDrift 0.35s steps(1) infinite',
          }} />

          {/* Fog overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 3,
            animation: 'fogFloat 28s ease-in-out infinite',
            background: [
              'radial-gradient(ellipse 55% 45% at 18% 55%, rgba(57,255,20,0.028) 0%, transparent 70%)',
              'radial-gradient(ellipse 40% 55% at 78% 28%, rgba(57,255,20,0.018) 0%, transparent 60%)',
              'radial-gradient(ellipse 35% 40% at 50% 80%, rgba(57,255,20,0.012) 0%, transparent 55%)',
            ].join(', '),
          }} />

          {/* Hint pill */}
          <div style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            border: '1px solid #2a2a2a',
            borderRadius: 999,
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#39FF14',
              flexShrink: 0,
              display: 'inline-block',
            }} />
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 10,
              color: '#ffffff',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              CLICK A HIGHLIGHTED REGION TO EXPLORE ITS COFFEE
            </span>
          </div>

        </div>
      </div>

    </main>
  )
}
