import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { geoCentroid, geoNaturalEarth1 } from 'd3-geo'

const GEO_URL = '/countries-110m.json'
const MAP_W = 800
const MAP_H = 450

// Matches ComposableMap default projection config
const mapProjection = geoNaturalEarth1()
  .scale(153)
  .translate([MAP_W / 2, MAP_H / 2])

// Jack's pointing tip in SVG coordinate space (right-arm area of left-edge character)
const JACK_TIP_X = 80
const JACK_TIP_Y = 200

const COFFEE_COUNTRIES = {
  231: {
    name: 'Ethiopia', flag: '🇪🇹',
    region: 'Yirgacheffe & Sidamo', altitude: '1,700–2,200m', process: 'Washed & Natural',
    notes: ['Blueberry', 'Jasmine', 'Bergamot', 'Stone Fruit'],
    body: 7, acidity: 8,
    jack: "The OG. Coffee was literally born here. Our Blend #43 calls these highlands home.",
    available: true, blend: 'BLEND #43',
  },
  404: {
    name: 'Kenya', flag: '🇰🇪',
    region: 'Central Highlands', altitude: '1,400–2,000m', process: 'Washed',
    notes: ['Blackcurrant', 'Tomato', 'Citrus', 'Wine-like'],
    body: 7, acidity: 9,
    jack: "Kenya doesn't mess around. Big, bold, and borderline aggressive. In a good way.",
    available: false,
  },
  170: {
    name: 'Colombia', flag: '🇨🇴',
    region: 'Huila & Nariño', altitude: '1,500–2,000m', process: 'Washed',
    notes: ['Caramel', 'Red Apple', 'Milk Chocolate', 'Citrus'],
    body: 6, acidity: 6,
    jack: "Colombia's the reliable mate who always shows up on time. Smooth, consistent, never lets you down.",
    available: false,
  },
  76: {
    name: 'Brazil', flag: '🇧🇷',
    region: 'Minas Gerais & São Paulo', altitude: '900–1,300m', process: 'Natural & Pulped Natural',
    notes: ['Dark Chocolate', 'Almonds', 'Brown Sugar', 'Smooth'],
    body: 8, acidity: 3,
    jack: "Brazil: half the world's coffee, zero the pretension. The classic espresso backbone.",
    available: false,
  },
  320: {
    name: 'Guatemala', flag: '🇬🇹',
    region: 'Antigua & Huehuetenango', altitude: '1,500–2,000m', process: 'Washed',
    notes: ['Dark Chocolate', 'Smoky', 'Spice', 'Dried Fruit'],
    body: 7, acidity: 5,
    jack: "Volcanic soil, high altitude, big smoke. Guatemala means business.",
    available: false,
  },
  188: {
    name: 'Costa Rica', flag: '🇨🇷',
    region: 'Tarrazú & Central Valley', altitude: '1,200–1,800m', process: 'Honey & Washed',
    notes: ['Peach', 'Brown Sugar', 'Citrus', 'Floral'],
    body: 5, acidity: 6,
    jack: "Pura vida, pura coffee. Clean, sweet, and completely effortless.",
    available: false,
  },
  340: {
    name: 'Honduras', flag: '🇭🇳',
    region: 'Copán & Marcala', altitude: '1,000–1,600m', process: 'Washed',
    notes: ['Peach', 'Honey', 'Caramel', 'Mild'],
    body: 5, acidity: 5,
    jack: "Honduras is the dark horse. Quietly brilliant while everyone else grabs the headlines.",
    available: false,
  },
  604: {
    name: 'Peru', flag: '🇵🇪',
    region: 'Chanchamayo & Cajamarca', altitude: '1,500–2,200m', process: 'Washed',
    notes: ['Mild', 'Nutty', 'Milk Chocolate', 'Floral'],
    body: 5, acidity: 5,
    jack: "High-altitude Peruvian beans. Like drinking a mountain. A very tasty mountain.",
    available: false,
  },
  484: {
    name: 'Mexico', flag: '🇲🇽',
    region: 'Chiapas & Veracruz', altitude: '900–1,800m', process: 'Washed',
    notes: ['Nutty', 'Mild Spice', 'Light Body', 'Sweet'],
    body: 4, acidity: 4,
    jack: "Laid back, easy going, surprisingly nuanced. Much like the best Mexican road trips.",
    available: false,
  },
  887: {
    name: 'Yemen', flag: '🇾🇪',
    region: 'Haraz & Bani Matar', altitude: '1,500–2,500m', process: 'Natural (Dry)',
    notes: ['Wine', 'Dried Fruit', 'Spice', 'Ancient'],
    body: 8, acidity: 6,
    jack: "The ancient one. Yemeni coffee has been doing this since before coffee was even cool.",
    available: false,
  },
  356: {
    name: 'India', flag: '🇮🇳',
    region: 'Karnataka & Kerala', altitude: '900–1,500m', process: 'Washed & Monsooned',
    notes: ['Spice', 'Earthiness', 'Low Acid', 'Full Body'],
    body: 8, acidity: 3,
    jack: "India invented Monsooning — leaving beans out in monsoon winds. Completely unhinged, completely genius.",
    available: false,
  },
  360: {
    name: 'Indonesia', flag: '🇮🇩',
    region: 'Sumatra & Sulawesi', altitude: '900–1,700m', process: 'Wet-Hulled (Giling Basah)',
    notes: ['Earthy', 'Tobacco', 'Dark Chocolate', 'Dense'],
    body: 9, acidity: 3,
    jack: "Sumatra hits different. Wet-hulled, intense, and absolutely not for the faint-hearted.",
    available: false,
  },
  704: {
    name: 'Vietnam', flag: '🇻🇳',
    region: 'Central Highlands', altitude: '500–900m', process: 'Natural',
    notes: ['Robusta', 'Chocolatey', 'Bold', 'Intense'],
    body: 9, acidity: 2,
    jack: "Vietnam exports more coffee than almost anyone. Cà phê sữa đá is a way of life.",
    available: false,
  },
  646: {
    name: 'Rwanda', flag: '🇷🇼',
    region: 'Lake Kivu Region', altitude: '1,400–2,000m', process: 'Washed',
    notes: ['Floral', 'Red Fruit', 'Citrus', 'Bright'],
    body: 6, acidity: 8,
    jack: "Rwanda's coffee scene is one of the most inspiring transformations in the game.",
    available: false,
  },
  800: {
    name: 'Uganda', flag: '🇺🇬',
    region: 'Mt. Elgon & Rwenzori', altitude: '1,200–2,200m', process: 'Natural & Washed',
    notes: ['Dark Fruit', 'Cocoa', 'Earthy', 'Full Body'],
    body: 8, acidity: 5,
    jack: "Uganda grows serious quality up on Mt. Elgon. Criminally underrated on the world stage.",
    available: false,
  },
  834: {
    name: 'Tanzania', flag: '🇹🇿',
    region: 'Kilimanjaro & Mbeya', altitude: '1,400–2,000m', process: 'Washed',
    notes: ['Bright', 'Fruity', 'Wine-like', 'Citrus'],
    body: 6, acidity: 8,
    jack: "Tanzania grows coffee on the slopes of Kilimanjaro. That's just showing off, honestly.",
    available: false,
  },
  222: {
    name: 'El Salvador', flag: '🇸🇻',
    region: 'Santa Ana & Ahuachapán', altitude: '900–1,700m', process: 'Washed & Natural',
    notes: ['Sweet', 'Stone Fruit', 'Honey', 'Mild'],
    body: 5, acidity: 5,
    jack: "Small country, massive charm. El Salvador punches way above its weight in the cup.",
    available: false,
  },
  558: {
    name: 'Nicaragua', flag: '🇳🇮',
    region: 'Jinotega & Matagalpa', altitude: '900–1,500m', process: 'Washed',
    notes: ['Mild', 'Caramel', 'Bright', 'Citrus'],
    body: 5, acidity: 6,
    jack: "Nicaragua: where the coffee is great and the price of a bag won't make you cry.",
    available: false,
  },
}

function DotMeter({ value, max = 10 }) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: i < value ? '#39FF14' : 'rgba(255,255,255,0.1)',
            boxShadow: i < value ? '0 0 4px rgba(57,255,20,0.4)' : 'none',
          }}
        />
      ))}
    </div>
  )
}

function InfoPanel({ country }) {
  return (
    <div
      className="border border-[#1e1e1e] bg-[#080808] p-6 sm:p-8"
      style={{ animation: 'panelSlideUp 0.3s ease-out both' }}
    >
      <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
        <div className="flex items-center gap-4">
          <span style={{ fontSize: '3rem', lineHeight: 1 }}>{country.flag}</span>
          <div>
            <h2
              className="font-['Bebas_Neue'] text-white leading-none tracking-[2px]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
            >
              {country.name.toUpperCase()}
            </h2>
            <p className="font-['Barlow_Condensed'] text-white/40 text-xs tracking-[2px] uppercase mt-1">
              {country.region} · {country.altitude} · {country.process}
            </p>
          </div>
        </div>

        {country.available ? (
          <Link
            to="/coffee"
            className="bg-[#39FF14] text-black font-['Bebas_Neue'] text-sm tracking-[3px] px-5 py-2.5 hover:bg-[#2ce010] transition-all duration-200 whitespace-nowrap"
          >
            {country.blend} — SHOP NOW
          </Link>
        ) : (
          <span className="border border-white/15 text-white/30 font-['Bebas_Neue'] text-sm tracking-[3px] px-5 py-2.5 whitespace-nowrap">
            COMING SOON
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="font-['Barlow_Condensed'] text-[#39FF14] text-xs tracking-[3px] uppercase mb-3">
            Flavour Notes
          </p>
          <div className="flex flex-wrap gap-2">
            {country.notes.map(note => (
              <span
                key={note}
                className="border border-white/12 text-white/55 font-['Barlow_Condensed'] text-[0.65rem] tracking-[2px] uppercase px-3 py-1"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="font-['Barlow_Condensed'] text-white/40 text-[0.65rem] tracking-[2px] uppercase w-16 shrink-0">
              Body
            </p>
            <DotMeter value={country.body} />
          </div>
          <div className="flex items-center gap-4">
            <p className="font-['Barlow_Condensed'] text-white/40 text-[0.65rem] tracking-[2px] uppercase w-16 shrink-0">
              Acidity
            </p>
            <DotMeter value={country.acidity} />
          </div>
        </div>
      </div>

      <div className="pt-5 border-t border-white/[0.06] flex items-start gap-3">
        <img
          src="/images/bear-emoji.png"
          alt="Jack"
          className="w-8 h-8 shrink-0 opacity-80"
          style={{ marginTop: '2px' }}
        />
        <p className="font-['Inter'] font-light text-white/55 text-sm leading-relaxed italic">
          "{country.jack}"
        </p>
      </div>
    </div>
  )
}

export default function Origins() {
  const [selected, setSelected] = useState(null)

  function handleCountryClick(geo) {
    const country = COFFEE_COUNTRIES[geo.id]
    if (!country) return
    const centroid = geoCentroid(geo)
    const projected = mapProjection(centroid)
    if (!projected) return
    setSelected({ isoCode: geo.id, cx: projected[0], cy: projected[1] })
  }

  const selectedCountry = selected ? COFFEE_COUNTRIES[selected.isoCode] : null

  return (
    <main className="bg-[#0d0d0d] pt-16 min-h-screen">

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[0.35em] uppercase mb-3">
          Where It All Begins
        </p>
        <h1
          className="font-['Bebas_Neue'] text-white leading-none tracking-tight"
          style={{ fontSize: 'clamp(5rem, 14vw, 10rem)' }}
        >
          ORIGINS
        </h1>
        <p className="font-['Inter'] text-white/40 text-base max-w-xl mt-3 font-light leading-relaxed">
          Every great cup starts with a great origin. Click a country to explore.
        </p>
      </section>

      <section className="relative w-full bg-[#0a0a0a] border-t border-white/[0.04]">
        <div className="relative w-full aspect-video">

          <ComposableMap
            width={MAP_W}
            height={MAP_H}
            projection="geoNaturalEarth1"
            projectionConfig={{ scale: 153 }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const country = COFFEE_COUNTRIES[geo.id]
                  const isCoffee = !!country
                  const isSelected = selected?.isoCode === geo.id
                  const isAvailable = country?.available

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleCountryClick(geo)}
                      style={{
                        default: {
                          fill: isSelected
                            ? '#39FF14'
                            : isCoffee
                              ? isAvailable ? 'rgba(57,255,20,0.55)' : 'rgba(57,255,20,0.22)'
                              : '#222222',
                          stroke: '#0d0d0d',
                          strokeWidth: 0.5,
                          outline: 'none',
                          cursor: isCoffee ? 'pointer' : 'default',
                          transition: 'fill 0.15s ease',
                        },
                        hover: {
                          fill: isCoffee ? (isAvailable ? '#39FF14' : 'rgba(57,255,20,0.6)') : '#2a2a2a',
                          stroke: '#0d0d0d',
                          strokeWidth: 0.5,
                          outline: 'none',
                          cursor: isCoffee ? 'pointer' : 'default',
                        },
                        pressed: { fill: '#39FF14', outline: 'none' },
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>

          {/* Pointer line overlay */}
          {selected && (
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none',
              }}
            >
              <line
                key={selected.isoCode}
                x1={JACK_TIP_X}
                y1={JACK_TIP_Y}
                x2={selected.cx}
                y2={selected.cy}
                stroke="#39FF14"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                strokeLinecap="round"
                opacity={0.65}
                style={{ animation: 'march 0.5s linear infinite' }}
              />
              <circle
                cx={selected.cx}
                cy={selected.cy}
                r={3.5}
                fill="#39FF14"
                opacity={0.9}
                style={{ filter: 'drop-shadow(0 0 4px rgba(57,255,20,0.8))' }}
              />
            </svg>
          )}

          {/* Jack mascot — desktop only */}
          <img
            src="/images/jack-nobg.png"
            alt="Jack"
            className="hidden md:block absolute pointer-events-none select-none"
            style={{
              left: '0.5%',
              top: '50%',
              transform: 'translateY(-50%)',
              height: '80%',
              width: 'auto',
              zIndex: 10,
            }}
          />
        </div>

        {/* Legend */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(57,255,20,0.5)' }} />
            <span className="font-['Barlow_Condensed'] text-white/35 text-xs tracking-[2px] uppercase">Available Now</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(57,255,20,0.18)' }} />
            <span className="font-['Barlow_Condensed'] text-white/35 text-xs tracking-[2px] uppercase">Coming Soon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#131313] border border-white/10" />
            <span className="font-['Barlow_Condensed'] text-white/35 text-xs tracking-[2px] uppercase">Not a coffee origin</span>
          </div>
        </div>
      </section>

      {/* Info panel */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        {selectedCountry ? (
          <InfoPanel key={selectedCountry.name} country={selectedCountry} />
        ) : (
          <div className="border border-dashed border-white/[0.08] py-12 flex items-center justify-center">
            <p className="font-['Barlow_Condensed'] text-white/25 text-sm tracking-[3px] uppercase text-center px-4">
              Click a highlighted country on the map to explore its coffee origins
            </p>
          </div>
        )}
      </section>

    </main>
  )
}
