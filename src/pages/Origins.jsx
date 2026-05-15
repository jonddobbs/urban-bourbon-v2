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
    dx: 25, dy: -20,
    flavour: 'Floral, Bright, Citrusy',
    varietals: 'Heirloom',
    process: 'Washed',
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
    description:
      'Indonesian coffee — especially from Sumatra — is unlike anything else. Wet-hulled processing creates a distinctively heavy, earthy cup with a deep, syrupy body. Divisive, but completely unforgettable.',
  },
}

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
      <div style={{ display: 'flex', height: `calc(100vh - ${NAV_H}px)`, overflow: 'hidden' }}>

        {/* ── TASTING LAB PANEL ────────────────────────────────────────── */}
        <TastingLabPanel
          selectedId={selectedId}
          region={selectedId !== null ? REGIONS[selectedId] : null}
        />

        {/* ── MAP AREA ─────────────────────────────────────────────────── */}
        <div style={{ flex: 1, position: 'relative', height: '100%', minWidth: 0, overflow: 'hidden' }}>

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
                        onClick={() => isHighlighted && handleSelect(id)}
                        style={{
                          default: {
                            fill: isHighlighted ? '#1e3d10' : '#161616',
                            stroke: '#262626',
                            strokeWidth: 0.4,
                            outline: 'none',
                            transition: 'fill 150ms ease',
                            cursor: isHighlighted ? 'pointer' : 'default',
                          },
                          hover: {
                            fill: isHighlighted ? '#2d5a1b' : '#161616',
                            stroke: '#262626',
                            strokeWidth: 0.4,
                            outline: 'none',
                            cursor: isHighlighted ? 'pointer' : 'default',
                          },
                          pressed: {
                            fill: isHighlighted ? 'rgba(57,255,20,0.6)' : '#161616',
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
                  <g key={id} style={{ cursor: 'pointer' }} onClick={() => handleSelect(id)}>
                    <Annotation
                      subject={r.coords}
                      dx={r.dx}
                      dy={r.dy}
                      connectorProps={{
                        stroke: 'rgba(255,255,255,0.25)',
                        strokeWidth: 0.5,
                        strokeLinecap: 'round',
                      }}
                    >
                      <text
                        fontFamily="'Bebas Neue', sans-serif"
                        fontSize={10}
                        fill="#C9A84C"
                        letterSpacing={1}
                        textAnchor={anchor}
                      >
                        {r.name.toUpperCase()}
                      </text>
                      <text
                        y={12}
                        fontSize={8}
                        fill="rgba(255,255,255,0.6)"
                        textAnchor={anchor}
                        fontFamily="sans-serif"
                      >
                        {r.flavour}
                      </text>
                    </Annotation>

                    <Marker coordinates={r.coords}>
                      {/* Flag emoji */}
                      <text
                        textAnchor="middle"
                        y={-10}
                        style={{ fontSize: '13px', userSelect: 'none' }}
                      >
                        {r.flag}
                      </text>
                      {/* Dot */}
                      <circle
                        r={4}
                        fill="#39FF14"
                        opacity={0.9}
                        stroke="#0d0d0d"
                        strokeWidth={1}
                      />
                    </Marker>
                  </g>
                )
              })}
            </ComposableMap>
          </div>

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
