const NAV_H = 64
const JACK_IMG = '/images/jack-lecturer.png'  // public/images/jack-lecturer.png

const JACK_SAYS = {
  231: "Ethiopia is where coffee was born. These beans carry a thousand years of history in every sip.",
  170: "Colombia never lets you down. Clean, balanced, and deeply satisfying — it's the reliable one.",
  76: "Brazil is the backbone of the espresso world. Every great blend starts here. Don't underestimate it.",
  320: "Guatemala hits different. That volcanic soil gives it a smokiness and depth money can't replicate.",
  360: "Indonesia divides people. But if you want something genuinely wild and unforgettable — this is it.",
}

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

function DefaultState() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
      paddingBottom: 24,
    }}>
      {/* Jack — ~65% of panel height, centred, pinned to top of body */}
      <img
        src={JACK_IMG}
        alt="Jack"
        style={{
          height: `calc((100vh - ${NAV_H}px) * 0.65)`,
          width: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          flexShrink: 0,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Speech bubble — tail points up toward Jack */}
      <div style={{
        position: 'relative',
        background: '#16140f',
        border: '1px solid #242420',
        borderRadius: 10,
        padding: '10px 16px',
        margin: '12px 24px 0',
        width: 'calc(100% - 48px)',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        {/* Tail (outer — border colour) */}
        <div style={{
          position: 'absolute',
          top: -9,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: '8px solid #242420',
        }} />
        {/* Tail (inner — fill colour) */}
        <div style={{
          position: 'absolute',
          top: -7,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderBottom: '7px solid #16140f',
        }} />
        <p style={{
          fontSize: 11,
          color: '#666666',
          margin: 0,
          lineHeight: 1.55,
        }}>
          Pick a region on the map. I'll walk you through it.
        </p>
      </div>

      {/* Dim pill tags */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginTop: 14,
        flexShrink: 0,
      }}>
        {['ORIGINS', 'PROCESS', 'FLAVOUR'].map(tag => (
          <span key={tag} style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 10,
            color: '#2e2e2e',
            letterSpacing: '1.5px',
            border: '1px solid #1e1e1e',
            borderRadius: 999,
            padding: '3px 10px',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function SelectedState({ selectedId, region }) {
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Region hero: flag + name */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid #1a1a1a',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 10 }}>{region.flag}</div>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 36,
          color: '#39FF14',
          letterSpacing: '0.04em',
          margin: 0,
          lineHeight: 1,
        }}>
          {region.name.toUpperCase()}
        </h2>
      </div>

      {/* Jack speech bubble */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #1a1a1a',
        flexShrink: 0,
      }}>
        <div style={{
          background: '#16140f',
          border: '1px solid #2a2a24',
          borderRadius: 10,
          padding: '10px 14px',
        }}>
          <p style={{
            fontSize: 11,
            color: '#aaaaaa',
            margin: 0,
            lineHeight: 1.6,
          }}>
            {JACK_SAYS[selectedId] ?? region.description}
          </p>
        </div>
      </div>

      {/* Detail rows */}
      <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
        <DetailRow icon={<FlavorIcon />} label="Flavour Profile" value={region.flavour} />
        <DetailRow icon={<LeafIcon />}   label="Varietals"       value={region.varietals} />
        <DetailRow icon={<GearIcon />}   label="Process"         value={region.process} />
      </div>

      {/* Description */}
      <p style={{
        fontSize: 12,
        color: '#71717a',
        lineHeight: 1.75,
        margin: '4px 20px 28px',
      }}>
        {region.description}
      </p>
    </div>
  )
}

export default function TastingLabPanel({ selectedId, region }) {
  return (
    <div style={{
      width: 320,
      flexShrink: 0,
      height: '100%',
      background: '#100e0a',
      borderRight: '1px solid #1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header strip — always visible */}
      <div style={{
        borderBottom: '1px solid #1a1a1a',
        padding: '16px 20px',
        flexShrink: 0,
      }}>
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 13,
          color: '#39FF14',
          letterSpacing: '3px',
          margin: 0,
          lineHeight: 1,
        }}>
          JACK'S TASTING LAB
        </p>
        <p style={{
          fontSize: 10,
          color: '#383838',
          margin: '6px 0 0 0',
          lineHeight: 1.4,
        }}>
          Pick a region. Jack will take it from here.
        </p>
      </div>

      {/* Body */}
      {region ? (
        <SelectedState selectedId={selectedId} region={region} />
      ) : (
        <DefaultState />
      )}
    </div>
  )
}
