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

interface EmptyStateProps {
  message?: string
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div style={CONTAINER_STYLE}>
      <Typography variant="muted">{message ?? 'No messages yet'}</Typography>
      <Typography variant="caption" style={{ color: colors.textMuted }}>
        Tap + to start a conversation
      </Typography>
    </div>
  )
}
