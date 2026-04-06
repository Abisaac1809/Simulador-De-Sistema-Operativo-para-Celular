import { colors } from '../../design/tokens'

interface SignalBarsProps {
  strength: number  // 0–4
  size?: number
}

export default function SignalBars({ strength, size = 16 }: SignalBarsProps) {
  const bars = 4
  const gap = size * 0.12
  const barW = (size - gap * (bars - 1)) / bars
  const maxH = size

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-label={`Signal strength ${strength} of 4`}
      role="img"
    >
      {Array.from({ length: bars }, (_, i) => {
        const barH = maxH * (0.25 + i * 0.25)
        const x = i * (barW + gap)
        const y = maxH - barH
        const filled = i < strength
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={barH}
            rx={barW * 0.3}
            fill={filled ? colors.textPrimary : colors.textMuted}
            fillOpacity={filled ? 1 : 0.35}
          />
        )
      })}
    </svg>
  )
}
