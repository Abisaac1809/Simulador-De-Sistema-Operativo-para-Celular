import type { CSSProperties } from 'react'
import { Typography, colors, spacing } from '../../../design'

const ROW_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[3],
  padding: `${spacing[3]}px 0`,
}

const ICON_STYLE: CSSProperties = {
  fontSize: 16,
  color: colors.textMuted,
  width: 20,
  textAlign: 'center',
  flexShrink: 0,
}

const TEXT_BLOCK_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
}

interface ContactDetailProps {
  icon: string
  label: string
  value: string
}

export default function ContactDetail({ icon, label, value }: ContactDetailProps) {
  return (
    <div style={ROW_STYLE}>
      <i className={icon} style={ICON_STYLE} />
      <div style={TEXT_BLOCK_STYLE}>
        <Typography variant="caption" style={{ color: colors.textMuted }}>
          {label}
        </Typography>
        <Typography variant="body">{value}</Typography>
      </div>
    </div>
  )
}
