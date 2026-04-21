import type { CSSProperties } from 'react'
import { Typography, colors, glass, spacing } from '../../../design'

const STYLE: CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 1,
  padding: `${spacing[3]}px ${spacing[4]}px ${spacing[2]}px`,
  background: 'rgba(5, 5, 6, 0.72)',
  backdropFilter: glass.backdropFilterLight,
  WebkitBackdropFilter: glass.backdropFilterLight,
  borderBottom: `0.5px solid ${colors.glassBorder}`,
}

export default function DateHeader({ label }: { label: string }) {
  return (
    <div style={STYLE}>
      <Typography
        variant="caption"
        style={{
          color: colors.textPrimary,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          fontSize: 11,
        }}
      >
        {label}
      </Typography>
    </div>
  )
}
