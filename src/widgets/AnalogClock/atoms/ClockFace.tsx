import { colors } from '../../../design'

const CENTER = 80
const RADIUS = 76
const TICK_OUTER = 76
const TICK_INNER = 68
const TICK_COUNT = 12
const TICK_STROKE_WIDTH = 1.5
const DOT_RADIUS = 4

function tickCoords(i: number) {
  const angle = (i / TICK_COUNT) * 2 * Math.PI - Math.PI / 2
  return {
    x1: CENTER + TICK_INNER * Math.cos(angle),
    y1: CENTER + TICK_INNER * Math.sin(angle),
    x2: CENTER + TICK_OUTER * Math.cos(angle),
    y2: CENTER + TICK_OUTER * Math.sin(angle),
  }
}

export default function ClockFace() {
  return (
    <g>
      {/* Outer ring */}
      <circle
        cx={CENTER} cy={CENTER} r={RADIUS}
        stroke={colors.glassBorder}
        strokeWidth={TICK_STROKE_WIDTH}
        fill="none"
      />
      {/* Hour tick marks */}
      {Array.from({ length: TICK_COUNT }, (_, i) => {
        const { x1, y1, x2, y2 } = tickCoords(i)
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={colors.textSecondary}
            strokeWidth={TICK_STROKE_WIDTH}
            strokeLinecap="round"
          />
        )
      })}
      {/* Center dot */}
      <circle cx={CENTER} cy={CENTER} r={DOT_RADIUS} fill={colors.textPrimary} />
    </g>
  )
}
