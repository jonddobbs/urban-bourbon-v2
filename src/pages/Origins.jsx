import { useState, useRef } from 'react'
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
    altitude: '1,800–2,200m',
    farmingStory: 'Most Ethiopian coffee grows wild in the ancient forests of Kaffa, Jimma, and Illubabor — farmers don\'t plant it, they tend what already exists. In Yirgacheffe and Sidamo, smallholders hand-pick ripe cherries from ancient, unregistered heirloom trees and carry them to centralised washing stations. There are no large estates here — just thousands of small plots, deep forest shade, and centuries of inherited knowledge passed from generation to generation without paperwork or certification.',
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
    altitude: '1,200–2,000m',
    farmingStory: "Colombia's coffee is built on small family farms — fincas — averaging just two to four hectares each. The Colombian Coffee Growers Federation (FNC) has supported these families for nearly a century, providing technical guidance and a guaranteed purchase price. Most cherries are hand-picked on steep Andean slopes, then wet-processed at on-farm washing stations. The result is one of the most consistent, traceable origins in the world — quality that's structurally built into the supply chain, not left to chance.",
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
    altitude: '800–1,300m',
    farmingStory: 'Brazil operates at a scale no other origin can match — roughly a third of the world\'s coffee comes from here. Behind the statistics are regions like Sul de Minas and the Cerrado Mineiro, where farms range from small family plots to vast mechanised estates. Natural processing dominates: cherries are picked and laid on raised beds or patios to dry whole in the sun for weeks. This long, slow drying is what gives Brazilian coffee its signature sweetness and low acidity — the backbone of almost every espresso blend in the world.',
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
    altitude: '1,300–2,000m',
    farmingStory: "Guatemala's best coffee comes from the volcanic highlands of Huehuetenango and the valley floors around Antigua. Small co-operatives pool their harvests and share access to wet-milling infrastructure that individual farmers couldn't afford alone. Shade-grown under native canopy, the beans develop slowly at altitude, concentrating sugars that give the cup its characteristic depth. The volcanic soil — rich in minerals from ancient eruptions — adds a complexity that's entirely a product of place.",
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
    altitude: '900–1,600m',
    farmingStory: "Indonesia's defining method — wet-hulling, known locally as giling basah — was born from necessity. In Sumatra's humid highland climate, fully drying coffee takes too long and risks mould. Farmers sell their partially dried parchment to local collectors, who strip it while the bean is still wet, then dry it again. This double-handling creates the dense, earthy, low-acid character that defines Sumatran coffee. Smallholders in the Gayo highlands of Aceh and the Mandheling region near Padang are the primary source.",
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
    altitude: '1,400–2,100m',
    farmingStory: 'Kenyan coffee passes through one of the most rigorous quality systems in the world. Smallholder farmers deliver cherry to cooperative washing stations — known locally as factories — where it\'s processed and graded before sale at the Nairobi Coffee Exchange, a weekly auction where buyers from around the world compete for the best lots. The SL28 and SL34 varietals were developed in the 1930s by Scott Agricultural Laboratories specifically for Kenya\'s conditions. That genetic foundation, combined with the auction system, is why Kenyan coffee consistently tops cupping tables globally.',
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
    altitude: '1,500–2,500m',
    farmingStory: "Yemeni farmers have been growing coffee on hand-built stone terraces in the Haraz and Bani Matar mountains for over five centuries — long before anyone else had a commercial coffee industry. No irrigation, no agrochemicals, no certification. The trees grow in thin mountain soil, stressed by altitude and drought, producing tiny yields of intensely flavoured cherries that dry naturally in the mountain air. Sourcing from Yemen is genuinely difficult — ongoing conflict has fractured supply chains and made direct trade relationships nearly impossible — but the coffee that does reach us is extraordinary.",
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
    altitude: '1,200–1,900m',
    farmingStory: "Costa Rica is the only country in the world where cultivating robusta is illegal — a government decision from 1989 to protect the country's premium coffee reputation. Most farms are tiny, family-run operations in the Tarrazú and Central Valley regions. The rise of micro-mills — small, farm-level processing facilities — has transformed quality here. Farmers now control the entire journey from cherry to dried parchment, enabling precise experimentation with honey and washed profiles that would be impossible in a centralised mill.",
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

function AltitudeIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M1 13L5.5 5L9 9.5L11 7L15 13H1Z" stroke="#39FF14" strokeWidth={1.2} strokeLinejoin="round" strokeLinecap="round" />
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
          maxHeight: '90vh',
          overflowY: 'auto',
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
        <DetailRow icon={<FlavorIcon />}  label="Flavour Profile"   value={region.flavour} />
        <DetailRow icon={<LeafIcon />}    label="Varietals"         value={region.varietals} />
        <DetailRow icon={<GearIcon />}    label="Process"           value={region.process} />
        {region.altitude && (
          <DetailRow icon={<AltitudeIcon />} label="Growing Altitude" value={region.altitude} />
        )}

        <p style={{
          fontSize: 13,
          color: '#a1a1aa',
          lineHeight: 1.7,
          marginTop: 16,
          marginBottom: 16,
        }}>
          {region.description}
        </p>

        {region.farmingStory && (
          <div style={{
            marginBottom: 28,
            padding: '14px 16px',
            background: '#0d0b08',
            borderLeft: '2px solid rgba(57,255,20,0.35)',
          }}>
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 10,
              color: '#39FF14',
              letterSpacing: '3px',
              margin: '0 0 8px 0',
            }}>
              SOURCING &amp; FARMING
            </p>
            <p style={{
              fontSize: 12,
              color: '#8a8a8a',
              lineHeight: 1.8,
              margin: 0,
            }}>
              {region.farmingStory}
            </p>
          </div>
        )}

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
  const [connectorLine, setConnectorLine] = useState(null)
  const [animKey, setAnimKey] = useState(0)
  const panelRef = useRef(null)
  const mapRef = useRef(null)
  const outerRef = useRef(null)
  const cardRefs = useRef({})

  function drawConnectorLine(id) {
    const container = outerRef.current
    if (!container) return
    const pinEl = container.querySelector(`[data-pin-id="${id}"]`)
    const cardEl = cardRefs.current[id]
    if (!pinEl || !cardEl) return
    const cRect = container.getBoundingClientRect()
    const pinRect = pinEl.getBoundingClientRect()
    const cardRect = cardEl.getBoundingClientRect()
    const x1 = pinRect.left + pinRect.width / 2 - cRect.left
    const y1 = pinRect.top + pinRect.height / 2 - cRect.top
    const x2 = cardRect.left + cardRect.width / 2 - cRect.left
    const y2 = cardRect.top - cRect.top
    const length = Math.hypot(x2 - x1, y2 - y1)
    setConnectorLine({ x1, y1, x2, y2, length })
    setAnimKey(k => k + 1)
  }

  function handleSelect(id, source = 'map') {
    setSelectedId(id)
    setConnectorLine(null)
    if (window.innerWidth < 768) {
      if (source === 'card') {
        requestAnimationFrame(() => {
          mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
        setTimeout(() => drawConnectorLine(id), 500)
      } else {
        requestAnimationFrame(() => {
          panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    }
  }

  return (
    <main style={{ paddingTop: NAV_H, background: '#0d0d0d' }}>
      <div className="origins-outer" ref={outerRef} style={{ display: 'flex', height: `calc(100vh - ${NAV_H}px)`, overflow: 'hidden', position: 'relative' }}>

        {/* ── TASTING LAB PANEL ────────────────────────────────────────── */}
        <div className="origins-panel-wrap" ref={panelRef}>
          <TastingLabPanel
            selectedId={selectedId}
            region={selectedId !== null ? REGIONS[selectedId] : null}
            onDeselect={() => setSelectedId(null)}
          />
        </div>

        {/* ── MAP AREA ─────────────────────────────────────────────────── */}
        <div className="origins-map-wrap" ref={mapRef} style={{ flex: 1, position: 'relative', height: '100%', minWidth: 0, overflow: 'hidden' }}>

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
                        onClick={() => isHighlighted && handleSelect(id, 'map')}
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
                  <g key={id} className="map-pin-group" onClick={() => handleSelect(id, 'map')}>
                    {/* Annotation — hidden on mobile via CSS (too small to read at reduced scale) */}
                    <g className="map-annotation">
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
                    </g>

                    <Marker coordinates={r.coords}>
                      {/* Invisible tap target — anchored with data-pin-id for connector line calculations */}
                      <circle r={22} fill="transparent" data-pin-id={id} style={{ cursor: 'pointer' }} />
                      {/* Pulse ring — shown when this pin is selected */}
                      {selectedId === id && (
                        <circle r={8} fill="none" stroke="#39FF14" strokeWidth={1.5} className="pin-pulse" />
                      )}
                      {/* Flag emoji */}
                      <text
                        textAnchor="middle"
                        y={-12}
                        style={{ fontSize: '15px', userSelect: 'none' }}
                      >
                        {r.flag}
                      </text>
                      {/* Dot — glowing; enlarged on mobile via .marker-dot CSS */}
                      <circle
                        r={5}
                        fill="#39FF14"
                        opacity={0.95}
                        stroke="#0d0d0d"
                        strokeWidth={1.5}
                        className="glow-dot marker-dot"
                        style={{ animationDelay: GLOW_DELAYS[id] }}
                      />
                      {/* Country name label — hidden on desktop, shown on mobile */}
                      <text
                        textAnchor="middle"
                        y={22}
                        className="pin-label"
                      >
                        {r.name.toUpperCase()}
                      </text>
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

        {/* Mobile country list — inside origins-outer so the SVG overlay spans map + cards */}
        <div className="origins-country-list">
          <p className="origins-list-heading">EXPLORE ORIGINS</p>
          <div className="origins-list-grid">
            {Object.entries(REGIONS).map(([rawId, r]) => {
              const id = Number(rawId)
              return (
                <button
                  key={rawId}
                  ref={el => { if (el) cardRefs.current[id] = el }}
                  className={`origins-country-card${selectedId === id ? ' origins-country-card--active' : ''}`}
                  onClick={() => handleSelect(id, 'card')}
                >
                  <span className="origins-card-flag">{r.flag}</span>
                  <span className="origins-card-name">{r.name.toUpperCase()}</span>
                  <span className="origins-card-flavour">{r.flavour}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* SVG connector — drawn on mobile when a card is tapped */}
        {connectorLine && (
          <svg
            key={animKey}
            className="origins-connector-svg"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              pointerEvents: 'none',
              zIndex: 20,
              overflow: 'visible',
            }}
          >
            {/* Animated dashed line — draws from pin down to card */}
            <line
              x1={connectorLine.x1} y1={connectorLine.y1}
              x2={connectorLine.x2} y2={connectorLine.y2}
              stroke="#39FF14"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray={`${connectorLine.length} ${connectorLine.length}`}
              style={{ strokeDashoffset: connectorLine.length, animation: 'drawConnector 0.55s ease forwards' }}
            />
            {/* Dot at pin end */}
            <circle cx={connectorLine.x1} cy={connectorLine.y1} r={3.5} fill="#39FF14" />
            {/* Dot at card end — fades in once the line arrives */}
            <circle
              cx={connectorLine.x2} cy={connectorLine.y2} r={3.5} fill="#39FF14"
              style={{ opacity: 0, animation: 'dotAppear 0.1s 0.5s ease forwards' }}
            />
          </svg>
        )}

      </div>

    </main>
  )
}
