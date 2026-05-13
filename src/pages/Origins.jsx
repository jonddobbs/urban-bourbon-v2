import { useState } from 'react'
import { Link } from 'react-router-dom'

// ── Coffee country data — used in stage 2 (interactive map) ─────────────────
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

// ── Stage 1: page layout scaffold ───────────────────────────────────────────
// Left panel: Jack the lecturer + country info (placeholder for now)
// Right area: "COFFEE BY REGION" heading + map placeholder
// Interactive map and country info panel added in stage 2.

export default function Origins() {
  const [selected] = useState(null)
  const selectedCountry = selected ? COFFEE_COUNTRIES[selected] : null

  return (
    <main className="bg-[#0d0d0d] min-h-screen pt-16 flex flex-col">

      {/* ── Main layout: left panel + right map area ────────────────── */}
      <div className="flex flex-1" style={{ minHeight: 'calc(100vh - 4rem)' }}>

        {/* ── Left panel ─────────────────────────────────────────────── */}
        <aside
          className="relative shrink-0 flex flex-col bg-[#0a0a0a] border-r border-white/[0.05]"
          style={{
            width: 'clamp(220px, 19vw, 300px)',
            overflow: 'visible',
            zIndex: 10,
          }}
        >
          {/* Jack — wider than the panel so his pointer tip extends into the map */}
          <div className="relative" style={{ overflow: 'visible' }}>
            <img
              src="/images/jack-lecturer.png"
              alt="Jack the Lecturer"
              className="block select-none pointer-events-none"
              style={{
                width: '130%',
                maxWidth: 'none',
              }}
            />
          </div>

          {/* Country info — placeholder until stage 2 wires up selection */}
          <div
            className="flex-1 border-t border-white/[0.06] px-5 py-6"
            style={{ background: '#090909' }}
          >
            {selectedCountry ? (
              /* Country info renders here in stage 2 */
              <p className="font-['Barlow_Condensed'] text-[#39FF14] text-xs tracking-[3px] uppercase">
                {selectedCountry.name}
              </p>
            ) : (
              <p className="font-['Barlow_Condensed'] text-white/20 text-[0.65rem] tracking-[3px] uppercase leading-relaxed">
                Click a highlighted region on the map to learn more
              </p>
            )}
          </div>
        </aside>

        {/* ── Right area: heading + map ───────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Page heading */}
          <div className="text-center px-6 pt-10 pb-6 shrink-0">
            <h1
              className="font-['Bebas_Neue'] text-white leading-none tracking-[0.05em]"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 5.5rem)' }}
            >
              COFFEE BY REGION
            </h1>
            <p className="font-['Inter'] text-white/45 font-light text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
              Explore the world of coffee. Understand the origin, the process,
              and the flavour that each region brings to your cup.
            </p>
          </div>

          {/* Map area — interactive map added in stage 2 */}
          <div
            className="flex-1 flex items-center justify-center"
            style={{ background: '#070707' }}
          >
            <p className="font-['Barlow_Condensed'] text-white/10 text-xs tracking-[4px] uppercase">
              Interactive map — stage 2
            </p>
          </div>

        </div>
      </div>

    </main>
  )
}
