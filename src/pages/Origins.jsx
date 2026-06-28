import { useState, useRef } from 'react'
import { ComposableMap, Geographies, Geography, Marker, Annotation } from 'react-simple-maps'
import TastingLabPanel from '../components/TastingLabPanel'
import { BLEND_ORIGINS, BLEND_GEO_IDS } from '../data/origins'

const GEO_URL = '/countries-110m.json'
const NAV_H = 64

// Non-blend informational regions — no dossier, use fallback panel
const INFO_REGIONS = {
  76: {
    name: 'Brazil',
    flag: '🇧🇷',
    coords: [-51.9, -14.2],
    dx: 25, dy: 15,
    flavour: 'Chocolatey, Smooth, Low Acidity',
    varietals: 'Mundo Novo, Catuai',
    process: 'Natural',
    story: 'Dark chocolate. Toasted almond. Dense, satisfying body. The engine room of the coffee world. Natural-processed at lower altitudes — full, rich, the backbone of every great espresso blend.',
    description: "As the world's largest coffee producer, Brazil sets the standard for espresso bases. Natural processing gives the beans their signature low acidity, full body, and notes of dark chocolate, almonds, and brown sugar.",
    altitude: '800–1,300m',
    farmingStory: "Brazil operates at a scale no other origin can match — roughly a third of the world's coffee comes from here. Behind the statistics are regions like Sul de Minas and the Cerrado Mineiro, where farms range from small family plots to vast mechanised estates. Natural processing dominates: cherries are picked and laid on raised beds or patios to dry whole in the sun for weeks. This long, slow drying is what gives Brazilian coffee its signature sweetness and low acidity — the backbone of almost every espresso blend in the world.",
  },
  320: {
    name: 'Guatemala',
    flag: '🇬🇹',
    coords: [-90.2, 15.5],
    dx: -55, dy: -40,
    flavour: 'Rich, Cocoa, Spiced',
    varietals: 'Bourbon, Caturra',
    process: 'Washed',
    story: 'Volcanic smoke. Deep cocoa. Bright citrus edge. Ancient eruptions left mineral-rich soil no other region can replicate. Guatemala puts terroir at the centre of every cup.',
    description: 'Grown on volcanic highlands with rich mineral soils and dramatic climate swings, Guatemalan coffee is bold, complex, and distinctive. Ideal for those who want depth, smoke, and character in every cup.',
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
    story: "Forest floor. Dark spice. Syrupy, heavy body. Wet-hulled in Sumatra's highlands — a process found nowhere else on earth. Not for the timid, but unforgettable for everyone else.",
    description: 'Indonesian coffee — especially from Sumatra — is unlike anything else. Wet-hulled processing creates a distinctively heavy, earthy cup with a deep, syrupy body. Divisive, but completely unforgettable.',
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
    farmingStory: "Kenyan coffee passes through one of the most rigorous quality systems in the world. Smallholder farmers deliver cherry to cooperative washing stations — known locally as factories — where it's processed and graded before sale at the Nairobi Coffee Exchange, a weekly auction where buyers from around the world compete for the best lots. The SL28 and SL34 varietals were developed in the 1930s by Scott Agricultural Laboratories specifically for Kenya's conditions. That genetic foundation, combined with the auction system, is why Kenyan coffee consistently tops cupping tables globally.",
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
    dx: -50, dy: 34,
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

const REGIONS = { ...INFO_REGIONS, ...BLEND_ORIGINS }

const GLOW_DELAYS = {
  231: '0s', 170: '0.7s', 558: '1.1s',
  76: '1.4s', 320: '2.1s', 360: '2.8s',
  404: '3.5s', 887: '4.2s', 188: '4.9s',
}

const REGION_IDS = Object.keys(REGIONS).map(Number)

// ── Main ───────────────────────────────────────────────────────────────────────

export default function Origins() {
  const [selectedId, setSelectedId]       = useState(null)
  const [hoveredId, setHoveredId]         = useState(null)
  const [connectorLine, setConnectorLine] = useState(null)  // mobile card→pin line
  const [animKey, setAnimKey]             = useState(0)
  const [blendLine, setBlendLine]         = useState(null)  // desktop blend-selector→pin line
  const [blendLineKey, setBlendLineKey]   = useState(0)

  const panelRef     = useRef(null)
  const mapRef       = useRef(null)
  const outerRef     = useRef(null)
  const cardRefs     = useRef({})
  const blendBtnRefs = useRef({})

  // ── Desktop blend-selector → map-pin connector ─────────────────────────────

  function drawBlendLine(geoId) {
    const mapEl = mapRef.current
    if (!mapEl) return
    const btnEl = blendBtnRefs.current[geoId]
    const pinEl = mapEl.querySelector(`[data-pin-id="${geoId}"]`)
    if (!btnEl || !pinEl) { setBlendLine(null); return }

    const mapRect = mapEl.getBoundingClientRect()
    const btnRect = btnEl.getBoundingClientRect()
    const pinRect = pinEl.getBoundingClientRect()

    setBlendLine({
      x1: btnRect.left + btnRect.width / 2 - mapRect.left,
      y1: btnRect.bottom - mapRect.top,
      x2: pinRect.left + pinRect.width / 2 - mapRect.left,
      y2: pinRect.top  + pinRect.height / 2 - mapRect.top,
    })
    setBlendLineKey(k => k + 1)
  }

  // ── Mobile card→pin connector ──────────────────────────────────────────────

  function drawConnectorLine(id) {
    const container = outerRef.current
    if (!container) return
    const pinEl  = container.querySelector(`[data-pin-id="${id}"]`)
    const cardEl = cardRefs.current[id]
    if (!pinEl || !cardEl) return
    const cRect    = container.getBoundingClientRect()
    const pinRect  = pinEl.getBoundingClientRect()
    const cardRect = cardEl.getBoundingClientRect()
    setConnectorLine({
      x1: pinRect.left  + pinRect.width  / 2 - cRect.left,
      y1: pinRect.top   + pinRect.height / 2 - cRect.top,
      x2: cardRect.left + cardRect.width / 2 - cRect.left,
      y2: cardRect.top  - cRect.top,
      length: Math.hypot(
        (cardRect.left + cardRect.width / 2) - (pinRect.left + pinRect.width / 2),
        cardRect.top - (pinRect.top + pinRect.height / 2)
      ),
    })
    setAnimKey(k => k + 1)
  }

  // ── Selection handlers ─────────────────────────────────────────────────────

  function handleSelect(id, source = 'map') {
    setSelectedId(id)
    setConnectorLine(null)

    if (id !== null && BLEND_GEO_IDS.includes(id)) {
      drawBlendLine(id)
    } else {
      setBlendLine(null)
    }

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

  function handleBlendSelect(geoId) {
    if (selectedId === geoId) {
      setSelectedId(null)
      setBlendLine(null)
    } else {
      handleSelect(geoId, 'map')
    }
  }

  function handleDeselect() {
    setSelectedId(null)
    setBlendLine(null)
  }

  // ── Map fill logic ─────────────────────────────────────────────────────────
  // When a blend origin is selected, all other regions are dimmed so the
  // connection between the blend and its origin is visually unambiguous.

  function geoStyle(id) {
    const isHighlighted = REGION_IDS.includes(id)
    const isBlend       = BLEND_GEO_IDS.includes(id)
    const isSelected    = id === selectedId
    const blendFocused  = selectedId !== null && BLEND_GEO_IDS.includes(selectedId)
    const isDimmed      = blendFocused && !isSelected

    let defaultFill, defaultStroke, defaultStrokeWidth
    let hoverFill, hoverStroke, hoverStrokeWidth, hoverFilter, hoverCursor

    if (!isHighlighted) {
      defaultFill        = blendFocused ? '#0d0d0d' : '#161616'
      defaultStroke      = '#1c1c1c'
      defaultStrokeWidth = 0.4
      hoverFill          = blendFocused ? '#0d0d0d' : '#1a1a1a'
      hoverStroke        = '#222222'
      hoverStrokeWidth   = 0.4
      hoverFilter        = 'none'
      hoverCursor        = 'default'
    } else if (isSelected) {
      defaultFill        = 'rgba(57,255,20,0.18)'
      defaultStroke      = '#39FF14'
      defaultStrokeWidth = 0.8
      hoverFill          = 'rgba(57,255,20,0.25)'
      hoverStroke        = '#39FF14'
      hoverStrokeWidth   = 1
      hoverFilter        = 'drop-shadow(0 0 8px rgba(57,255,20,0.55))'
      hoverCursor        = 'pointer'
    } else if (isDimmed) {
      defaultFill        = '#0d100c'
      defaultStroke      = '#171917'
      defaultStrokeWidth = 0.4
      hoverFill          = '#111411'
      hoverStroke        = '#202320'
      hoverStrokeWidth   = 0.5
      hoverFilter        = 'none'
      hoverCursor        = 'pointer'
    } else {
      // highlighted, nothing dimmed
      defaultFill        = isBlend ? '#1a3d18' : '#1e3d10'
      defaultStroke      = isBlend ? '#2a5a1a' : '#2a4a1a'
      defaultStrokeWidth = 0.6
      hoverFill          = '#3a7022'
      hoverStroke        = '#39FF14'
      hoverStrokeWidth   = 0.8
      hoverFilter        = 'drop-shadow(0 0 6px rgba(57,255,20,0.4))'
      hoverCursor        = 'pointer'
    }

    return {
      default: {
        fill: defaultFill, stroke: defaultStroke, strokeWidth: defaultStrokeWidth,
        outline: 'none', transition: 'fill 300ms ease',
        cursor: isHighlighted ? 'pointer' : 'default',
        animationDelay: isHighlighted ? GLOW_DELAYS[id] : undefined,
      },
      hover: {
        fill: hoverFill, stroke: hoverStroke, strokeWidth: hoverStrokeWidth,
        outline: 'none', filter: hoverFilter, cursor: hoverCursor,
      },
      pressed: {
        fill: isHighlighted ? 'rgba(57,255,20,0.55)' : '#161616',
        outline: 'none',
      },
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main style={{ paddingTop: NAV_H, background: '#0d0d0d' }}>
      <div className="origins-outer" ref={outerRef} style={{ display: 'flex', height: `calc(100vh - ${NAV_H}px)`, overflow: 'hidden', position: 'relative' }}>

        {/* ── TASTING LAB PANEL ───────────────────────────────────────── */}
        <div className="origins-panel-wrap" ref={panelRef}>
          <TastingLabPanel
            selectedId={selectedId}
            region={selectedId !== null ? REGIONS[selectedId] : null}
            onDeselect={handleDeselect}
          />
        </div>

        {/* ── MAP AREA ────────────────────────────────────────────────── */}
        <div className="origins-map-wrap" ref={mapRef} style={{ flex: 1, position: 'relative', height: '100%', minWidth: 0, overflow: 'hidden' }}>

          {/* Map canvas */}
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
                        style={geoStyle(id)}
                      />
                    )
                  })
                }
              </Geographies>

              {/* Annotations + Markers */}
              {Object.entries(REGIONS).map(([rawId, r]) => {
                const id     = Number(rawId)
                const anchor = r.dx < 0 ? 'end' : 'start'
                const blendFocused = selectedId !== null && BLEND_GEO_IDS.includes(selectedId)
                const isSelected   = id === selectedId
                const isDimmed     = blendFocused && !isSelected
                const showFull     = hoveredId === id || isSelected

                return (
                  <g
                    key={id}
                    className="map-pin-group"
                    onClick={() => handleSelect(id, 'map')}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <g className="map-annotation" style={{ opacity: isDimmed ? 0.2 : 1, transition: 'opacity 300ms' }}>
                      <Annotation
                        subject={r.coords}
                        dx={r.dx}
                        dy={r.dy}
                        connectorProps={{
                          stroke: isSelected
                            ? 'rgba(57,255,20,0.6)'
                            : showFull
                            ? 'rgba(57,255,20,0.45)'
                            : 'rgba(57,255,20,0.2)',
                          strokeWidth: 0.6,
                          strokeLinecap: 'round',
                        }}
                      >
                        <text
                          fontFamily="'Bebas Neue', sans-serif"
                          fontSize={11}
                          fill={isSelected ? '#39FF14' : showFull ? '#E8D5A3' : 'rgba(232,213,163,0.65)'}
                          letterSpacing={2}
                          textAnchor={anchor}
                        >
                          {r.name.toUpperCase()}
                        </text>
                        {showFull && (
                          <text
                            y={13}
                            fontSize={9}
                            fill={isSelected ? 'rgba(57,255,20,0.75)' : 'rgba(255,255,255,0.7)'}
                            textAnchor={anchor}
                            fontFamily="'Inter', sans-serif"
                            letterSpacing={0.5}
                          >
                            {r.flavour}
                          </text>
                        )}
                      </Annotation>
                    </g>

                    <Marker coordinates={r.coords}>
                      <circle r={22} fill="transparent" data-pin-id={id} style={{ cursor: 'pointer' }} />
                      {isSelected && (
                        <circle r={8} fill="none" stroke="#39FF14" strokeWidth={1.5} className="pin-pulse" />
                      )}
                      <text
                        textAnchor="middle"
                        y={-12}
                        style={{ fontSize: '15px', userSelect: 'none', opacity: isDimmed ? 0.25 : 1, transition: 'opacity 300ms' }}
                      >
                        {r.flag}
                      </text>
                      <circle
                        r={5}
                        fill={isSelected ? '#39FF14' : isDimmed ? '#1e2e1c' : '#39FF14'}
                        opacity={isDimmed ? 0.35 : 0.95}
                        stroke="#0d0d0d"
                        strokeWidth={1.5}
                        className={isDimmed ? undefined : 'glow-dot marker-dot'}
                        style={{
                          animationDelay: GLOW_DELAYS[id],
                          transition: 'fill 300ms, opacity 300ms',
                        }}
                      />
                      <text textAnchor="middle" y={22} className="pin-label">
                        {r.name.toUpperCase()}
                      </text>
                    </Marker>
                  </g>
                )
              })}
            </ComposableMap>
          </div>

          {/* ── Blend selector bar ──────────────────────────────────────── */}
          <div className="origins-blend-selector" style={{
            position: 'absolute',
            top: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            background: 'rgba(10,10,10,0.82)',
            border: '1px solid #1e1e1e',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 8,
              color: 'rgba(57,255,20,0.5)',
              letterSpacing: '2.5px',
              padding: '0 12px',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}>
              OUR BLENDS
            </span>
            <div style={{ width: 1, background: '#1e1e1e', alignSelf: 'stretch' }} />
            {Object.entries(BLEND_ORIGINS).map(([rawId, blend], i, arr) => {
              const geoId    = Number(rawId)
              const isActive = selectedId === geoId
              return (
                <button
                  key={rawId}
                  ref={el => { if (el) blendBtnRefs.current[geoId] = el }}
                  onClick={() => handleBlendSelect(geoId)}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 10,
                    letterSpacing: '1.8px',
                    padding: '9px 14px',
                    border: 'none',
                    borderRight: i < arr.length - 1 ? '1px solid #1e1e1e' : 'none',
                    background: isActive ? 'rgba(57,255,20,0.1)' : 'transparent',
                    color: isActive ? '#39FF14' : 'rgba(255,255,255,0.38)',
                    cursor: 'pointer',
                    transition: 'background 150ms, color 150ms',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.38)'
                  }}
                >
                  #{blend.blendNumber} · {blend.blendName.toUpperCase()}
                </button>
              )
            })}
          </div>

          {/* ── Blend → pin connector line (desktop) ───────────────────── */}
          {blendLine && (
            <svg
              key={blendLineKey}
              className="origins-blend-line"
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: 'none',
                zIndex: 5,
                overflow: 'visible',
              }}
            >
              {/* Animated dashed line */}
              <line
                x1={blendLine.x1} y1={blendLine.y1}
                x2={blendLine.x2} y2={blendLine.y2}
                stroke="#39FF14"
                strokeWidth={1.2}
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray="5 4"
                strokeDashoffset={100}
                style={{ animation: 'drawConnector 0.55s ease forwards' }}
              />
              {/* Dot at selector end */}
              <circle cx={blendLine.x1} cy={blendLine.y1} r={2.5} fill="#39FF14" opacity={0.7} />
              {/* Dot at pin end — fades in after line completes */}
              <circle
                cx={blendLine.x2} cy={blendLine.y2}
                r={5} fill="none" stroke="#39FF14" strokeWidth={1.2}
                style={{ opacity: 0, animation: 'dotAppear 0.15s 0.5s ease forwards' }}
              />
              <circle
                cx={blendLine.x2} cy={blendLine.y2}
                r={2} fill="#39FF14"
                style={{ opacity: 0, animation: 'dotAppear 0.15s 0.5s ease forwards' }}
              />
            </svg>
          )}

          {/* Grain overlay */}
          <div style={{
            position: 'absolute', inset: '-10%',
            pointerEvents: 'none', zIndex: 4, opacity: 0.045,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: '300px 300px',
            animation: 'grainDrift 0.35s steps(1) infinite',
          }} />

          {/* Fog overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            pointerEvents: 'none', zIndex: 3,
            animation: 'fogFloat 28s ease-in-out infinite',
            background: [
              'radial-gradient(ellipse 55% 45% at 18% 55%, rgba(57,255,20,0.028) 0%, transparent 70%)',
              'radial-gradient(ellipse 40% 55% at 78% 28%, rgba(57,255,20,0.018) 0%, transparent 60%)',
              'radial-gradient(ellipse 35% 40% at 50% 80%, rgba(57,255,20,0.012) 0%, transparent 55%)',
            ].join(', '),
          }} />

          {/* ── Find Your Blend quiz widget ──────────────────────────── */}
          <div className="origins-blend-quiz" style={{
            position: 'absolute', bottom: 24, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 6, flexDirection: 'column', alignItems: 'center', gap: 7,
          }}>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 8, letterSpacing: '3px',
              color: 'rgba(57,255,20,0.45)', textTransform: 'uppercase',
              userSelect: 'none', display: 'block', textAlign: 'center',
            }}>
              FIND YOUR BLEND
            </span>
            <div style={{ display: 'flex', gap: 5 }}>
              {Object.entries(BLEND_ORIGINS).map(([rawId, blend]) => {
                const geoId    = Number(rawId)
                const isActive = selectedId === geoId
                return (
                  <button
                    key={rawId}
                    onClick={() => handleBlendSelect(geoId)}
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase',
                      padding: '8px 14px', whiteSpace: 'nowrap', cursor: 'pointer',
                      border: isActive ? '1px solid rgba(57,255,20,0.55)' : '1px solid rgba(255,255,255,0.08)',
                      background: isActive ? 'rgba(57,255,20,0.1)' : 'rgba(8,8,8,0.85)',
                      color: isActive ? '#39FF14' : 'rgba(255,255,255,0.45)',
                      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                      transition: 'border-color 180ms, background 180ms, color 180ms',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'rgba(57,255,20,0.3)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                      }
                    }}
                  >
                    {blend.quizLabel.join(' · ')}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* Mobile country list */}
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

        {/* SVG connector — mobile card→pin only */}
        {connectorLine && (
          <svg
            key={animKey}
            className="origins-connector-svg"
            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, pointerEvents: 'none', zIndex: 20, overflow: 'visible' }}
          >
            <line
              x1={connectorLine.x1} y1={connectorLine.y1}
              x2={connectorLine.x2} y2={connectorLine.y2}
              stroke="#39FF14" strokeWidth={1.5} strokeLinecap="round"
              pathLength={100} strokeDasharray="8 5" strokeDashoffset={100}
              style={{ animation: 'drawConnector 0.55s ease forwards' }}
            />
            <circle cx={connectorLine.x1} cy={connectorLine.y1} r={3.5} fill="#39FF14" />
            <circle cx={connectorLine.x2} cy={connectorLine.y2} r={3.5} fill="#39FF14"
              style={{ opacity: 0, animation: 'dotAppear 0.1s 0.5s ease forwards' }} />
          </svg>
        )}

      </div>
    </main>
  )
}
