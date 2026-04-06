import { colors } from '../../design/tokens'

interface WifiIconProps {
  strength: number  // 0–4
  size?: number
}

export default function WifiIcon({ strength, size = 16 }: WifiIconProps) {
  const cx = size / 2
  const cy = size * 0.85
  const radii = [size * 0.18, size * 0.4, size * 0.62]
  const arcAngles = { start: -140, end: -40 }

  function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
    const toRad = (d: number) => (d * Math.PI) / 180
    const sx = cx + r * Math.cos(toRad(startDeg))
    const sy = cy + r * Math.sin(toRad(startDeg))
    const ex = cx + r * Math.cos(toRad(endDeg))
    const ey = cy + r * Math.sin(toRad(endDeg))
    const large = endDeg - startDeg > 180 ? 1 : 0
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`
  }

  // Arc levels: 1 arc = strength 1, 2 arcs = strength 2, etc.
  // Dot is always shown if strength >= 1
  const dotRadius = size * 0.07

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-label={`Wifi strength ${strength} of 4`}
      role="img"
    >
      {radii.map((r, i) => {
        const arcLevel = i + 1
        const filled = arcLevel <= strength
        return (
          <path
            key={i}
            d={describeArc(cx, cy, r, arcAngles.start, arcAngles.end)}
            stroke={filled ? colors.textPrimary : colors.textMuted}
            strokeWidth={size * 0.11}
            strokeLinecap="round"
            strokeOpacity={filled ? 1 : 0.3}
          />
        )
      })}
      <circle
        cx={cx}
        cy={cy}
        r={dotRadius}
        fill={strength > 0 ? colors.textPrimary : colors.textMuted}
        fillOpacity={strength > 0 ? 1 : 0.3}
      />
    </svg>
  )
}
