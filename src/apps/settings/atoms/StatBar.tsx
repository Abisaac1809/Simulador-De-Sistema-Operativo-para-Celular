import type { CSSProperties } from 'react'
import { colors, radius } from '../../../design'

const TRACK_STYLE: CSSProperties = {
  width: '100%',
  height: 6,
  background: colors.glassBg,
  borderRadius: radius.pill,
  overflow: 'hidden',
}

interface StatBarProps {
  value: number
  color?: string
}

export default function StatBar({ value, color }: StatBarProps) {
  const fill = Math.min(100, Math.max(0, value))
  const barColor = color ?? colors.accent

  return (
    <div style={TRACK_STYLE}>
      <div
        style={{
          width: `${fill}%`,
          height: '100%',
          background: barColor,
          borderRadius: radius.pill,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  )
}
