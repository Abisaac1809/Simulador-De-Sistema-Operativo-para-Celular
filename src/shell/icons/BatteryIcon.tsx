import { colors } from '../../design/tokens'

interface BatteryIconProps {
  level: number      // 0–100
  charging?: boolean
  size?: number
}

export default function BatteryIcon({ level, charging = false, size = 24 }: BatteryIconProps) {
  const w = size * 1.4
  const h = size * 0.7
  const capW = size * 0.08
  const capH = h * 0.4
  const innerW = (w - 4) * Math.max(0, Math.min(1, level / 100))

  const fillColor =
    level <= 10 ? '#FF453A'
    : level <= 25 ? '#FF9F0A'
    : charging ? '#32D74B'
    : colors.textPrimary

  return (
    <svg
      width={w + capW}
      height={h}
      viewBox={`0 0 ${w + capW} ${h}`}
      fill="none"
      aria-label={`Battery ${level}%${charging ? ', charging' : ''}`}
      role="img"
    >
      {/* Outer shell */}
      <rect
        x={0.75}
        y={0.75}
        width={w - 1.5}
        height={h - 1.5}
        rx={3}
        stroke={colors.textPrimary}
        strokeWidth={1.5}
        strokeOpacity={0.6}
      />
      {/* Cap terminal */}
      <rect
        x={w}
        y={(h - capH) / 2}
        width={capW}
        height={capH}
        rx={1.5}
        fill={colors.textPrimary}
        fillOpacity={0.6}
      />
      {/* Fill */}
      {innerW > 0 && (
        <rect
          x={2}
          y={2}
          width={innerW}
          height={h - 4}
          rx={1.5}
          fill={fillColor}
        />
      )}
      {/* Charging bolt */}
      {charging && (
        <text
          x={w / 2}
          y={h / 2 + 4}
          textAnchor="middle"
          fill="#fff"
          fontSize={h * 0.65}
          fontWeight="600"
          style={{ userSelect: 'none' }}
        >
          ⚡
        </text>
      )}
    </svg>
  )
}
