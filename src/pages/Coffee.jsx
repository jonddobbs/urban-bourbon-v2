import { useState } from 'react'
import RadarChart from '../components/RadarChart.jsx'
import { useCart } from '../context/CartContext.jsx'

// ── Product catalogue ──────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    sku: 'ub-43',
    number: '43',
    subtitle: 'Blend #43',
    origin: 'Ethiopian Origin · Bright & Fruity',
    description: "Our debut blend. A fair trade, small batch Ethiopian whole bean coffee — bright, fruity, and unlike anything you've tasted. The first of many.",
    taste: null,
    altitude: null,
    process: null,
    varietal: null,
    harvest: null,
    scaScore: null,
    perfectFor: null,
    tags: ['Whole Bean', 'Fair Trade', 'Small Batch'],
    profile: { Body: 8, Acidity: 3, Sweetness: 5, Bitterness: 7, Finish: 7 },
    image: '/images/fam-43.png',
    imageAlt: 'Blend #43 — Urban Bourbon',
    imageFit: 'contain',
    cartName: 'Blend #43 Ethiopian',
    sizes: [
      { label: '125g', price: '£6.99', priceNum: 6.99 },
      { label: '1kg',  price: '£30',   priceNum: 30   },
    ],
    formats: null,
  },
  {
    sku: 'ub-41',
    number: '41',
    subtitle: 'Colombia Excelso',
    origin: 'Colombia Excelso · Washed',
    description: 'Bright. Complex. Full of character.',
    taste: 'Orange, Brown Sugar, Cedar',
    altitude: '1,450m',
    process: 'Washed',
    varietal: 'Caturra, Typica',
    harvest: 'Jan–Jun',
    scaScore: 83,
    perfectFor: ['Cafetière', 'Filter', 'Pour Over', 'Batch Brew'],
    tags: ['Single Origin', 'Washed Process', 'Colombia'],
    profile: { Body: 6, Acidity: 7, Sweetness: 7, Bitterness: 4, Finish: 7 },
    image: '/images/fam-41.png',
    imageAlt: '#41 Colombian Gold — Urban Bourbon',
    imageFit: 'contain',
    cartName: '#41 Colombian Gold',
    sizes: [
      { label: '125g', price: '£7.49', priceNum: 7.49 },
      { label: '1kg',  price: '£34',   priceNum: 34   },
    ],
    formats: ['Whole Beans', 'Ground Medium'],
  },
  {
    sku: 'ub-17',
    number: '17',
    subtitle: 'Nicaragua Jinotega',
    origin: 'Nicaragua Jinotega · Washed',
    description: 'Smooth. Sweet. Easy drinking.',
    taste: 'Chocolate, Pear, Caramel',
    altitude: '1,200m',
    process: 'Washed',
    varietal: 'Catimor, Caturra',
    harvest: 'Dec–Mar',
    scaScore: 84,
    perfectFor: ['Bean to Cup', 'Espresso Machines', 'Fresh Grinding', 'Everyday Drinking'],
    tags: ['Single Origin', 'Washed Process', 'Nicaragua'],
    profile: { Body: 8, Acidity: 5, Sweetness: 7, Bitterness: 7, Finish: 8 },
    image: '/images/fam-17.png',
    imageAlt: '#17 Cocoa Ridge — Urban Bourbon',
    imageFit: 'contain',
    cartName: '#17 Cocoa Ridge',
    sizes: [
      { label: '125g', price: '£8.49', priceNum: 8.49 },
      { label: '1kg',  price: '£36',   priceNum: 36   },
    ],
    formats: ['Whole Beans'],
  },
]

// ── ProductSection ─────────────────────────────────────────────────────────────

function ProductSection({ product }) {
  const [size, setSize] = useState(product.sizes[0].label)
  const [format, setFormat] = useState(product.formats?.[0] ?? null)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()
  const multiFormat = product.formats && product.formats.length > 1

  function handleAddToCart() {
    const chosen = product.sizes.find(s => s.label === size)
    const cartId = multiFormat
      ? `${product.sku}-${size}-${format.toLowerCase().replace(/\s+/g, '-')}`
      : `${product.sku}-${size}`
    addToCart({
      id: cartId,
      name: product.cartName,
      size: multiFormat ? `${size} · ${format}` : size,
      price: chosen.priceNum,
      currency: 'GBP',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <section className="border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid md:grid-cols-2 gap-10 lg:gap-20 items-center">

        {/* Product image */}
        <div className="relative overflow-hidden bg-[#111] aspect-square md:aspect-auto md:h-[560px]">
          <img
            src={product.image}
            alt={product.imageAlt}
            className={`absolute inset-0 w-full h-full ${
              product.imageFit === 'cover'
                ? 'object-cover object-center'
                : 'object-contain p-10'
            }`}
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(13,13,13,0.5) 0%, transparent 55%)'
          }} />
        </div>

        {/* Product details */}
        <div data-product-card="" className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="bg-[#39FF14] text-black font-['Bebas_Neue'] text-xs tracking-[3px] px-3 py-1">
              OUT NOW
            </span>
            <span className="text-white/30 font-['Barlow_Condensed'] text-xs tracking-[3px] uppercase">
              {product.subtitle}
            </span>
          </div>

          <h2 className="font-['Bebas_Neue'] text-white leading-none tracking-tight"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}>
            {product.number === '43' ? (
              <>BLEND<br /><span className="text-[#39FF14]">#43</span></>
            ) : (
              <>
                <span className="text-[#39FF14]">#{product.number}</span>
                <br />
                {product.cartName.replace(`#${product.number} `, '').toUpperCase()}
              </>
            )}
          </h2>

          <div className="flex flex-col gap-2">
            <p className="font-['Barlow_Condensed'] text-white/55 text-sm tracking-[2px] uppercase">
              {product.origin}
            </p>
            <p className="font-['Inter'] text-white/45 text-base leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {product.taste && (
            <p className="font-['Barlow_Condensed'] text-[#39FF14]/70 text-xs tracking-[3px] uppercase">
              {product.taste}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <span key={tag}
                className="border border-white/12 text-white/35 font-['Barlow_Condensed'] text-[0.65rem] tracking-[3px] uppercase px-3 py-1">
                {tag}
              </span>
            ))}
            {product.altitude && (
              <span className="border border-white/12 text-white/35 font-['Barlow_Condensed'] text-[0.65rem] tracking-[3px] uppercase px-3 py-1">
                {product.altitude}
              </span>
            )}
            {product.process && (
              <span className="border border-white/12 text-white/35 font-['Barlow_Condensed'] text-[0.65rem] tracking-[3px] uppercase px-3 py-1">
                {product.process}
              </span>
            )}
            {product.varietal && (
              <span className="border border-white/12 text-white/35 font-['Barlow_Condensed'] text-[0.65rem] tracking-[3px] uppercase px-3 py-1">
                {product.varietal}
              </span>
            )}
            {product.harvest && (
              <span className="border border-white/12 text-white/35 font-['Barlow_Condensed'] text-[0.65rem] tracking-[3px] uppercase px-3 py-1">
                Harvest: {product.harvest}
              </span>
            )}
            {product.scaScore && (
              <span className="border border-[#39FF14]/30 text-[#39FF14]/70 font-['Barlow_Condensed'] text-[0.65rem] tracking-[3px] uppercase px-3 py-1">
                SCA {product.scaScore}
              </span>
            )}
          </div>

          {product.perfectFor && (
            <div>
              <p className="font-['Barlow_Condensed'] text-white/30 text-xs tracking-[3px] uppercase mb-2">Perfect For</p>
              <div className="flex flex-wrap gap-2">
                {product.perfectFor.map(use => (
                  <span key={use}
                    className="border border-[#39FF14]/20 text-[#39FF14]/60 font-['Barlow_Condensed'] text-[0.65rem] tracking-[2px] uppercase px-3 py-1">
                    {use}
                  </span>
                ))}
              </div>
            </div>
          )}

          <RadarChart values={product.profile} />

          <div className="border-t border-white/[0.08] pt-6 flex flex-col gap-5">
            {multiFormat && (
              <div>
                <p className="font-['Barlow_Condensed'] text-white/30 text-xs tracking-[3px] uppercase mb-3">Grind</p>
                <div className="flex gap-2 flex-wrap">
                  {product.formats.map(f => (
                    <button
                      key={f}
                      onClick={() => { setFormat(f); setAdded(false) }}
                      className={`font-['Barlow_Condensed'] font-bold text-sm tracking-[2px] px-5 py-2 border transition-all duration-150 ${
                        format === f
                          ? 'bg-[#39FF14] border-[#39FF14] text-black'
                          : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/70'
                      }`}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="font-['Barlow_Condensed'] text-white/30 text-xs tracking-[3px] uppercase mb-3">Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(({ label, price }) => (
                  <button
                    key={label}
                    onClick={() => { setSize(label); setAdded(false) }}
                    className={`font-['Barlow_Condensed'] font-bold text-sm tracking-[2px] px-5 py-2 border transition-all duration-150 ${
                      size === label
                        ? 'bg-[#39FF14] border-[#39FF14] text-black'
                        : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/70'
                    }`}
                  >
                    {label} — {price}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between flex-wrap gap-5">
              <div>
                <p className="font-['Barlow_Condensed'] text-white/30 text-xs tracking-[3px] uppercase mb-1">Price</p>
                <p className="font-['Bebas_Neue'] text-white leading-none" style={{ fontSize: '3.5rem' }}>
                  {product.sizes.find(s => s.label === size)?.price}
                </p>
              </div>
              <div>
                {added ? (
                  <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[4px] uppercase">
                    ADDED TO BAG ✓
                  </p>
                ) : (
                  <button
                    data-add-to-bag=""
                    onClick={handleAddToCart}
                    className="bg-[#39FF14] text-black font-['Barlow_Condensed'] font-bold text-sm tracking-[0.2em] uppercase px-12 py-4 hover:bg-[#2ce010] transition-all duration-200 hover:scale-[1.03]"
                  >
                    ADD TO BAG
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Coffee() {
  return (
    <main className="bg-[#0d0d0d] pt-16">

      {/* Page header */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-12">
        <p className="font-['Barlow_Condensed'] text-[#39FF14] text-sm tracking-[0.35em] uppercase mb-3">
          Urban Bourbon · Est. 2023
        </p>
        <h1 className="font-['Bebas_Neue'] text-white leading-none tracking-tight"
          style={{ fontSize: 'clamp(5rem, 14vw, 10rem)' }}>
          OUR<br />COFFEE
        </h1>
      </section>

      {PRODUCTS.map(product => (
        <ProductSection key={product.sku} product={product} />
      ))}

    </main>
  )
}
