// Single source of truth for Urban Bourbon blend origins.
// Keyed by react-simple-maps geography numeric ID for direct lookup in Origins.jsx.
// Product prices/sizes live in Coffee.jsx PRODUCTS — don't duplicate them here.

export const BLEND_ORIGINS = {
  // ── Blend #43 — Ethiopia Djimma ──────────────────────────────────────────────
  231: {
    // Map display
    name: 'Ethiopia',
    flag: '🇪🇹',
    coords: [39.5, 9.0],
    dx: -30, dy: -15,
    flavour: 'Fruity, Wine, Mango',

    // Dossier
    blendNumber: '43',
    blendName: 'Ethiopia Djimma',
    sku: 'ub-43',
    shopPath: '/coffee#ub-43',
    originLabel: 'Ethiopia Djimma',
    process: 'Natural',
    altitude: '1,300–1,800m',
    harvest: 'Oct – Jan',
    varietal: 'Heirloom',
    notes: 'Fruity, Wine, Mango',
    // 6-axis radar: Fruit / Acidity / Body / Sweetness / Balance / Aftertaste (0–10)
    radar: { Fruit: 9, Acidity: 6, Body: 7, Sweetness: 8, Balance: 6, Aftertaste: 7 },
    jackLog: "Natural-processed in the ancient Djimma forests — farmers don't plant these trees, they tend what's already there. The result tastes, inexplicably, like mangoes and wine at altitude. Ethiopia has been doing this for a thousand years. I'm just the one with the lab coat.",
    image: '/images/fam-43.png',
    priceFrom: '£6.99',
    quizLabel: ['Bright', 'Fruity', 'Fruit-forward'],
  },

  // ── Blend #41 — Colombian Gold ───────────────────────────────────────────────
  170: {
    // Map display
    name: 'Colombia',
    flag: '🇨🇴',
    coords: [-74.0, 4.5],
    dx: 58, dy: 22,
    flavour: 'Orange, Brown Sugar, Cedar',

    // Dossier
    blendNumber: '41',
    blendName: 'Colombian Gold',
    sku: 'ub-41',
    shopPath: '/coffee#ub-41',
    originLabel: 'Colombia Excelso',
    process: 'Washed',
    altitude: '1,450m',
    harvest: 'Jan – Jun',
    varietal: 'Caturra, Typica',
    notes: 'Orange, Brown Sugar, Cedar',
    radar: { Fruit: 5, Acidity: 8, Body: 6, Sweetness: 7, Balance: 8, Aftertaste: 7 },
    jackLog: "SCA 83. Washed. Brown sugar, orange, a cedar edge on the finish. Colombia makes precision look effortless, which is itself a form of mastery. Pour it over, bloom it properly, and try not to feel too smug about it.",
    image: '/images/fam-41.png',
    priceFrom: '£7.49',
    quizLabel: ['Sweet', 'Citrus', 'Balanced'],
  },

  // ── Blend #17 — Cocoa Ridge, Nicaragua Jinotega ──────────────────────────────
  558: {
    // Map display
    name: 'Nicaragua',
    flag: '🇳🇮',
    coords: [-85.2, 13.1],
    dx: 50, dy: -28,
    flavour: 'Caramel, Chocolate, Pear',

    // Dossier
    blendNumber: '17',
    blendName: 'Cocoa Ridge',
    sku: 'ub-17',
    shopPath: '/coffee#ub-17',
    originLabel: 'Nicaragua Jinotega',
    process: 'Washed',
    altitude: '1,200m',
    harvest: 'Dec – Mar',
    varietal: 'Catimor, Caturra',
    notes: 'Caramel, Chocolate, Pear',
    radar: { Fruit: 4, Acidity: 5, Body: 8, Sweetness: 7, Balance: 7, Aftertaste: 8 },
    jackLog: "Jinotega's Catimor gives you chocolate, caramel, and a pear note that arrives quietly and doesn't overstay. Decent body, approachable acidity, SCA 84. I recommend this one to people who think they don't like single origin. They're always wrong.",
    image: '/images/fam-17.png',
    priceFrom: '£8.49',
    quizLabel: ['Chocolatey', 'Caramel', 'Smooth'],
  },
}

export const BLEND_GEO_IDS = Object.keys(BLEND_ORIGINS).map(Number)
