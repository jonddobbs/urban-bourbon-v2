import { Link } from 'react-router-dom'
import FieldRadar from './FieldRadar'

// ── Icons ──────────────────────────────────────────────────────────────────────

function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M8 1C5.24 1 3 3.24 3 6c0 4.25 5 9 5 9s5-4.75 5-9c0-2.76-2.24-5-5-5z"
        stroke="#39FF14" strokeWidth={1.2} />
      <circle cx="8" cy="6" r="1.5" stroke="#39FF14" strokeWidth={1.1} />
    </svg>
  )
}

function AltitudeIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M1 13L5.5 5L9 9.5L11 7L15 13H1Z"
        stroke="#39FF14" strokeWidth={1.2} strokeLinejoin="round" strokeLinecap="round" />
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

function LeafIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M8 14C8 14 2 10.5 2 5.5C2 5.5 6 2 12 4C12 4 14 10 8 14Z"
        stroke="#39FF14" strokeWidth={1.2} strokeLinejoin="round" />
      <line x1="8" y1="14" x2="8" y2="7" stroke="#39FF14" strokeWidth={0.9} />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <rect x="1" y="3" width="14" height="11" rx="1" stroke="#39FF14" strokeWidth={1.2} />
      <line x1="5" y1="1" x2="5" y2="5" stroke="#39FF14" strokeWidth={1.2} strokeLinecap="round" />
      <line x1="11" y1="1" x2="11" y2="5" stroke="#39FF14" strokeWidth={1.2} strokeLinecap="round" />
      <line x1="1" y1="7" x2="15" y2="7" stroke="#39FF14" strokeWidth={0.8} />
    </svg>
  )
}

function FlavorIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="2" fill="#39FF14" />
      {[0, 60, 120, 180, 240, 300].map(a => {
        const rad = (a * Math.PI) / 180
        return (
          <line key={a}
            x1={8 + 3 * Math.cos(rad)} y1={8 + 3 * Math.sin(rad)}
            x2={8 + 6 * Math.cos(rad)} y2={8 + 6 * Math.sin(rad)}
            stroke="#39FF14" strokeWidth={1.2} strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}

// ── Shared detail row ──────────────────────────────────────────────────────────

function DetailRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 11 }}>
      {icon}
      <div>
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 10,
          color: '#C9A84C',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          margin: '0 0 2px 0',
        }}>
          {label}
        </p>
        <p style={{ fontSize: 12, color: '#e0e0e0', margin: 0 }}>{value}</p>
      </div>
    </div>
  )
}

// ── Close button ───────────────────────────────────────────────────────────────

function CloseBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Back to map"
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        background: 'transparent',
        border: '1px solid #2a2a2a',
        borderRadius: '50%',
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#52525b',
        fontSize: 16,
        lineHeight: 1,
        padding: 0,
        transition: 'border-color 150ms, color 150ms',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#39FF14'
        e.currentTarget.style.color = '#39FF14'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#2a2a2a'
        e.currentTarget.style.color = '#52525b'
      }}
    >
      ×
    </button>
  )
}

// ── Default (no selection) ─────────────────────────────────────────────────────

function DefaultState() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        position: 'relative',
        background: '#16140f',
        border: '1px solid #242420',
        borderRadius: 10,
        padding: '10px 16px',
        margin: '16px 24px 0',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', bottom: -9, left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
          borderTop: '8px solid #242420',
        }} />
        <div style={{
          position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
          borderTop: '7px solid #16140f',
        }} />
        <p style={{ fontSize: 11, color: '#555555', margin: '0 0 8px 0', lineHeight: 1.6 }}>
          Every coffee tells a story.
        </p>
        <p style={{ fontSize: 10, color: '#3a3a3a', margin: 0, lineHeight: 1.6 }}>
          Region changes everything — altitude, climate, process, flavour.
          Choose a destination and Jack will guide you through the full profile.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14, flexShrink: 0 }}>
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

      <img
        src="/images/jack-lab-coat-nobg.png"
        alt="Jack"
        style={{ width: '100%', display: 'block', marginTop: 'auto', userSelect: 'none', pointerEvents: 'none' }}
      />
    </div>
  )
}

// ── Field dossier — shown for blend origins ────────────────────────────────────

function DossierState({ selectedId, region, onDeselect }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

      {/* Header: flag + name + blend badge */}
      <div style={{
        padding: '16px 20px 14px',
        borderBottom: '1px solid #1a1a1a',
        flexShrink: 0,
        position: 'relative',
      }}>
        <CloseBtn onClick={onDeselect} />
        <div style={{ fontSize: 34, lineHeight: 1, marginBottom: 6 }}>{region.flag}</div>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 30,
          color: '#39FF14',
          letterSpacing: '0.04em',
          margin: '0 0 8px 0',
          lineHeight: 1,
        }}>
          {region.name.toUpperCase()}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 10,
            color: '#39FF14',
            letterSpacing: '2.5px',
            background: 'rgba(57,255,20,0.08)',
            border: '1px solid rgba(57,255,20,0.22)',
            padding: '2px 8px',
          }}>
            BLEND #{region.blendNumber}
          </span>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10,
            color: '#444440',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}>
            {region.originLabel}
          </span>
        </div>
      </div>

      {/* Flavour radar */}
      <div style={{
        padding: '14px 20px 10px',
        borderBottom: '1px solid #1a1a1a',
        flexShrink: 0,
        background: '#0d0b08',
      }}>
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 9,
          color: '#39FF14',
          letterSpacing: '3px',
          margin: '0 0 4px 0',
        }}>
          FLAVOUR PROFILE
        </p>
        <FieldRadar key={selectedId} values={region.radar} />
      </div>

      {/* Data fields */}
      <div style={{
        padding: '16px 20px 4px',
        borderBottom: '1px solid #1a1a1a',
        flexShrink: 0,
      }}>
        <DetailRow icon={<PinIcon />}      label="Origin"   value={region.originLabel} />
        <DetailRow icon={<AltitudeIcon />} label="Altitude" value={region.altitude} />
        <DetailRow icon={<GearIcon />}     label="Process"  value={region.process} />
        <DetailRow icon={<LeafIcon />}     label="Varietal" value={region.varietal} />
        <DetailRow icon={<CalendarIcon />} label="Harvest"  value={region.harvest} />
        <DetailRow icon={<FlavorIcon />}   label="Notes"    value={region.notes} />
      </div>

      {/* Jack's notes */}
      <div style={{ padding: '14px 20px 20px', flexShrink: 0 }}>
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 9,
          color: '#39FF14',
          letterSpacing: '3px',
          margin: '0 0 8px 0',
        }}>
          JACK'S NOTES
        </p>
        <div style={{
          background: '#0f0d09',
          borderLeft: '2px solid rgba(57,255,20,0.35)',
          padding: '12px 14px',
        }}>
          <p style={{
            fontSize: 11,
            color: '#b8a898',
            lineHeight: 1.8,
            fontStyle: 'italic',
            margin: 0,
          }}>
            "{region.jackLog}"
          </p>
        </div>
      </div>

      {/* Blend product card */}
      <div style={{
        margin: '0',
        borderTop: '1px solid #1a1a1a',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* Thumbnail */}
          {region.image && (
            <div style={{
              width: 76,
              background: '#090907',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 8px',
              flexShrink: 0,
              borderRight: '1px solid #1a1a1a',
            }}>
              <img
                src={region.image}
                alt={region.blendName}
                style={{ width: 54, height: 54, objectFit: 'contain', display: 'block' }}
              />
            </div>
          )}
          {/* Info column */}
          <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
            <div>
              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 17,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}>
                BLEND #{region.blendNumber}
              </p>
              <p style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 10,
                color: '#484844',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                margin: '3px 0 0 0',
                lineHeight: 1,
              }}>
                {region.blendName}
              </p>
            </div>
            {region.priceFrom && (
              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 13,
                color: '#39FF14',
                letterSpacing: '1px',
                margin: 0,
              }}>
                From {region.priceFrom}
              </p>
            )}
            <Link
              to={region.shopPath}
              style={{
                display: 'inline-block',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 11,
                letterSpacing: '0.18em',
                color: '#0d0d0d',
                background: '#39FF14',
                padding: '6px 14px',
                textDecoration: 'none',
                transition: 'background 150ms',
                whiteSpace: 'nowrap',
                alignSelf: 'flex-start',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2ce010' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#39FF14' }}
            >
              SHOP NOW →
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}

// ── Fallback selected state — non-blend regions ────────────────────────────────

function SelectedState({ selectedId, region, onDeselect }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid #1a1a1a',
        flexShrink: 0,
        position: 'relative',
      }}>
        <CloseBtn onClick={onDeselect} />
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

      <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
        <p style={{ fontSize: 12, color: '#d4d4d4', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
          {region.story}
        </p>
      </div>

      {region.jackQuote && (
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
          <div style={{ background: '#16140f', border: '1px solid #2a2a24', borderRadius: 10, padding: '10px 14px' }}>
            <p style={{ fontSize: 11, color: '#aaaaaa', margin: 0, lineHeight: 1.6 }}>
              {region.jackQuote}
            </p>
          </div>
        </div>
      )}

      <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
        <DetailRow icon={<FlavorIcon />}   label="Flavour Profile"  value={region.flavour} />
        <DetailRow icon={<LeafIcon />}     label="Varietals"        value={region.varietals} />
        <DetailRow icon={<GearIcon />}     label="Process"          value={region.process} />
        {region.altitude && (
          <DetailRow icon={<AltitudeIcon />} label="Growing Altitude" value={region.altitude} />
        )}
      </div>

      <p style={{ fontSize: 12, color: '#a1a1aa', lineHeight: 1.75, margin: '4px 20px 16px' }}>
        {region.description}
      </p>

      {region.farmingStory && (
        <div style={{ margin: '0 20px 28px', padding: '14px 16px', background: '#0d0b08', borderLeft: '2px solid rgba(57,255,20,0.35)', flexShrink: 0 }}>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 10, color: '#39FF14', letterSpacing: '3px', margin: '0 0 8px 0' }}>
            SOURCING &amp; FARMING
          </p>
          <p style={{ fontSize: 11, color: '#8a8a8a', lineHeight: 1.8, margin: 0 }}>
            {region.farmingStory}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Panel shell ────────────────────────────────────────────────────────────────

export default function TastingLabPanel({ selectedId, region, onDeselect }) {
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
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 20px', flexShrink: 0 }}>
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
        <p style={{ fontSize: 10, color: '#383838', margin: '6px 0 0 0', lineHeight: 1.4 }}>
          Pick a region. Jack will take it from here.
        </p>
      </div>

      {region ? (
        region.radar
          ? <DossierState selectedId={selectedId} region={region} onDeselect={onDeselect} />
          : <SelectedState selectedId={selectedId} region={region} onDeselect={onDeselect} />
      ) : (
        <DefaultState />
      )}
    </div>
  )
}
