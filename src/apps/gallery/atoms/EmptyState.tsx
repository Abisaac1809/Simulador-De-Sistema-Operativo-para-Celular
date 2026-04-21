import type { CSSProperties } from 'react'
import { Typography, colors, spacing } from '../../../design'

const CONTAINER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  gap: spacing[2],
  padding: spacing[6],
}

const ICON_STYLE: CSSProperties = {
  fontSize: 56,
  color: colors.textMuted,
  opacity: 0.6,
  marginBottom: spacing[2],
}

export default function EmptyState() {
  return (
    <div style={CONTAINER_STYLE}>
      <i className="fi fi-rr-picture" style={ICON_STYLE} aria-hidden />
      <Typography variant="muted">No photos yet</Typography>
      <Typography variant="caption" style={{ color: colors.textMuted, textAlign: 'center' }}>
        Photos and videos you capture with the Camera app will appear here.
      </Typography>
    </div>
  )
}
