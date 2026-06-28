import { useEffect, useState } from 'react'

const LABELS = ['Fruit', 'Acidity', 'Body', 'Sweetness', 'Balance', 'Aftertaste']
const MAX = 10
const CX = 110
const CY = 110
const R = 72

function toRad(deg) { return deg * (Math.PI / 180) }
function axisAngle(i) { return toRad(i * 60 - 90) }
function pt(value, i) {
  const a = axisAngle(i)
  const r = (value / MAX) * R
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}

// Re-animates whenever `regionKey` changes (parent passes key={selectedId})
export default function FieldRadar({ values }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [values])

  const rings = [2, 4, 6, 8, 10].map(v =>
    LABELS.map((_, i) => pt(v, i).join(',')).join(' ')
  )
  const dataPoints = LABELS.map((label, i) => pt(values[label] ?? 0, i))
  const dataPath = dataPoints.map(p => p.join(',')).join(' ')

  return (
    <svg
      viewBox="0 0 220 220"
      width="220"
      height="220"
      aria-hidden="true"
      style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}
    >
      {rings.map((pts, ri) => (
        <polygon key={ri} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}

      {LABELS.map((_, i) => {
        const [x2, y2] = pt(MAX, i)
        return (
          <line key={i} x1={CX} y1={CY} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        )
      })}

      <g style={{
        transformOrigin: `${CX}px ${CY}px`,
        transform: visible ? 'scale(1)' : 'scale(0.05)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
      }}>
        <polygon
          points={dataPath}
          fill="rgba(57,255,20,0.12)"
          stroke="#39FF14"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {dataPoints.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill="#39FF14" />
        ))}
      </g>

      {LABELS.map((label, i) => {
        const a = axisAngle(i)
        const lr = R + 22
        const lx = CX + lr * Math.cos(a)
        const ly = CY + lr * Math.sin(a)
        const anchor = lx < CX - 5 ? 'end' : lx > CX + 5 ? 'start' : 'middle'
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor={anchor}
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.45)"
            fontSize="9"
            fontFamily="'Barlow Condensed', sans-serif"
            letterSpacing="1.5"
          >
            {label.toUpperCase()}
          </text>
        )
      })}
    </svg>
  )
}
