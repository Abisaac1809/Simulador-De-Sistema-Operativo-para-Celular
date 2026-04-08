import type { CSSProperties } from 'react'
import { Typography, colors, spacing } from '../../../design'

const CONTAINER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  gap: spacing[2],
}

export default function EmptyState() {
  return (
    <div style={CONTAINER_STYLE}>
      <Typography variant="muted">No notes yet</Typography>
      <Typography variant="caption" style={{ color: colors.textMuted }}>
        Tap + to create one
      </Typography>
    </div>
  )
}
