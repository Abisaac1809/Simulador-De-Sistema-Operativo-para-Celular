import type { CSSProperties, ReactNode } from 'react'
import { Typography, colors, spacing } from '../../../design'

const ROW_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  padding: `${spacing[3]}px 0`,
}

const ICON_STYLE: CSSProperties = {
  fontSize: 16,
  color: colors.textSecondary,
  width: 20,
  textAlign: 'center',
  flexShrink: 0,
}

const LABEL_STYLE: CSSProperties = {
  flex: 1,
}

interface SettingsRowProps {
  icon: string
  label: string
  value?: string
  children?: ReactNode
}

export default function SettingsRow({ icon, label, value, children }: SettingsRowProps) {
  return (
    <div style={ROW_STYLE}>
      <i className={icon} style={ICON_STYLE} />
      <Typography variant="body" style={LABEL_STYLE}>{label}</Typography>
      {value && <Typography variant="caption" style={{ color: colors.textMuted }}>{value}</Typography>}
      {children}
    </div>
  )
}
