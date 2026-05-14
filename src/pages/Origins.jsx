import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, Annotation } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const NAV_H = 64

const REGIONS = {
  231: {
    name: 'Ethiopia',
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
const DEFAULT_ID = 231

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

// ── Sidebar detail panel ───────────────────────────────────────────────────────

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

// ── Main ───────────────────────────────────────────────────────────────────────

export default function Origins() {
  const [selectedId, setSelectedId] = useState(DEFAULT_ID)

  function handleSelect(id) {
    if (id !== selectedId) setSelectedId(id)
  }

  const region = REGIONS[selectedId]

  return (
    <main style={{
      paddingTop: NAV_H,
      height: '100vh',
      overflow: 'hidden',
      background: '#0d0d0d',
    }}>
      <div style={{ display: 'flex', width: '100%', height: `calc(100vh - ${NAV_H}px)` }}>

        {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
        <aside style={{
          width: 300,
          flexShrink: 0,
          height: '100%',
          background: '#0d0d0d',
          borderRight: '1px solid #1f1f1f',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>

          {/* Jack image */}
          <div style={{ flexShrink: 0 }}>
            <img
              src="/images/jack-lecturer.png"
              alt="Jack the Lecturer"
              style={{
                width: '100%',
                maxHeight: 240,
                objectFit: 'contain',
                objectPosition: 'bottom',
                display: 'block',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          </div>

          {/* Region detail */}
          <div style={{ flex: 1, padding: 24, overflowY: 'auto', overflowX: 'hidden' }}>
            <div key={selectedId} style={{ animation: 'modalFadeIn 0.2s ease both' }}>

              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 36,
                color: '#39FF14',
                letterSpacing: '0.05em',
                marginBottom: 16,
                lineHeight: 1,
              }}>
                {region.name.toUpperCase()}
              </h2>

              <DetailRow icon={<FlavorIcon />} label="Flavour Profile" value={region.flavour} />
              <DetailRow icon={<LeafIcon />}   label="Varietals"       value={region.varietals} />
              <DetailRow icon={<GearIcon />}   label="Process"         value={region.process} />

              <p style={{
                fontSize: 12,
                color: '#71717a',
                lineHeight: 1.6,
                marginTop: 16,
                marginBottom: 20,
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
                  padding: '10px 0',
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

          {/* Instruction — flush to bottom */}
          <div style={{ padding: '16px 24px', flexShrink: 0 }}>
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 10,
              color: '#3f3f46',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: 0,
              lineHeight: 1.4,
            }}>
              CLICK A HIGHLIGHTED REGION ON THE MAP TO LEARN MORE
            </p>
          </div>
        </aside>

        {/* ── MAP AREA ─────────────────────────────────────────────────── */}
        <div style={{ flex: 1, position: 'relative', height: '100%', minWidth: 0 }}>

          <div style={{ width: '100%', height: '100%' }}>
            <ComposableMap
              projectionConfig={{ scale: 155, center: [20, 10] }}
              style={{ width: '100%', height: '100%' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const id = Number(geo.id)
                    const isHighlighted = REGION_IDS.includes(id)
                    const isSelected = selectedId === id

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => isHighlighted && handleSelect(id)}
                        style={{
                          default: {
                            fill: isSelected
                              ? 'rgba(57,255,20,0.65)'
                              : isHighlighted ? '#1e3d10' : '#161616',
                            stroke: '#262626',
                            strokeWidth: 0.4,
                            outline: 'none',
                            transition: 'fill 150ms ease',
                            cursor: isHighlighted ? 'pointer' : 'default',
                          },
                          hover: {
                            fill: isSelected
                              ? 'rgba(57,255,20,0.65)'
                              : isHighlighted ? '#2d5a1b' : '#161616',
                            stroke: '#262626',
                            strokeWidth: 0.4,
                            outline: 'none',
                            cursor: isHighlighted ? 'pointer' : 'default',
                          },
                          pressed: {
                            fill: isHighlighted ? 'rgba(57,255,20,0.75)' : '#161616',
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
                  <g key={id}>
                    <Annotation
                      subject={r.coords}
                      dx={r.dx}
                      dy={r.dy}
                      connectorProps={{
                        stroke: 'rgba(255,255,255,0.35)',
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
                        fill="rgba(255,255,255,0.7)"
                        textAnchor={anchor}
                        fontFamily="sans-serif"
                      >
                        {r.flavour}
                      </text>
                      <text
                        y={22}
                        fontSize={7.5}
                        fill="rgba(255,255,255,0.42)"
                        textAnchor={anchor}
                        fontFamily="sans-serif"
                      >
                        {`Varietals:  ${r.varietals}`}
                      </text>
                      <text
                        y={31}
                        fontSize={7.5}
                        fill="rgba(255,255,255,0.42)"
                        textAnchor={anchor}
                        fontFamily="sans-serif"
                      >
                        {`Process:  ${r.process}`}
                      </text>
                    </Annotation>

                    <Marker coordinates={r.coords}>
                      <circle
                        r={4}
                        fill="#39FF14"
                        opacity={0.9}
                        stroke="#0d0d0d"
                        strokeWidth={1}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSelect(id)}
                      />
                    </Marker>
                  </g>
                )
              })}
            </ComposableMap>
          </div>

          {/* Bottom-centre hint pill */}
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
              CLICK A HIGHLIGHTED REGION TO LEARN MORE ABOUT ITS COFFEE
            </span>
          </div>

          {/* Bottom-right legend */}
          <div style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 6,
          }}>
            <img
              src="/images/jack-lecturer.png"
              alt=""
              aria-hidden="true"
              style={{
                height: 55,
                width: 'auto',
                objectFit: 'contain',
                objectPosition: 'bottom',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 9,
              color: '#52525b',
              letterSpacing: '0.08em',
              paddingBottom: 3,
            }}>
              ● = CURRENTLY VIEWING
            </span>
          </div>

        </div>
      </div>
    </main>
  )
}
