import { useEffect, useRef, useState } from 'react'

const LABELS = ['Body', 'Acidity', 'Sweetness', 'Bitterness', 'Finish']
const MAX = 10
const CX = 100
const CY = 108
const R = 70

function toRad(deg) { return deg * (Math.PI / 180) }
function axisAngle(i) { return toRad(i * 72 - 90) }
function pt(value, axisIndex) {
  const a = axisAngle(axisIndex)
  const r = (value / MAX) * R
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}

export default function RadarChart({ values }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const rings = [2, 4, 6, 8, 10].map(v =>
    LABELS.map((_, i) => pt(v, i).join(',')).join(' ')
  )
  const dataPoints = LABELS.map((label, i) => pt(values[label] ?? 0, i))
  const dataPath = dataPoints.map(p => p.join(',')).join(' ')

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 200"
      width="200"
      height="200"
      aria-hidden="true"
      style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}
    >
      {/* Grid rings */}
      {rings.map((pts, ri) => (
        <polygon key={ri} points={pts} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}

      {/* Axis lines */}
      {LABELS.map((_, i) => {
        const [x2, y2] = pt(MAX, i)
        return (
          <line key={i} x1={CX} y1={CY} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        )
      })}

      {/* Data polygon — scales in from centre on intersection */}
      <g style={{
        transformOrigin: `${CX}px ${CY}px`,
        transform: visible ? 'scale(1)' : 'scale(0.1)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.75s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease',
      }}>
        <polygon
          points={dataPath}
          fill="rgba(57,255,20,0.13)"
          stroke="#39FF14"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {dataPoints.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill="#39FF14" />
        ))}
      </g>

      {/* Axis labels — always visible, overflow parent padding */}
      {LABELS.map((label, i) => {
        const a = axisAngle(i)
        const lr = R + 18
        const lx = CX + lr * Math.cos(a)
        const ly = CY + lr * Math.sin(a)
        const anchor = lx < CX - 3 ? 'end' : lx > CX + 3 ? 'start' : 'middle'
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor={anchor}
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.38)"
            fontSize="8"
            fontFamily="'Barlow Condensed', sans-serif"
            letterSpacing="1"
          >
            {label.toUpperCase()}
          </text>
        )
      })}
    </svg>
  )
}
