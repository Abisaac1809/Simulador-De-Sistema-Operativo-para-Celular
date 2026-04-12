import type { CSSProperties } from 'react'
import { colors, font, spacing, radius } from '../../../design'

interface ModeLabelProps {
  label: string
  active: boolean
  onClick: () => void
}

const BASE_STYLE: CSSProperties = {
  paddingTop: spacing[1],
  paddingBottom: spacing[1],
  paddingLeft: spacing[3],
  paddingRight: spacing[3],
  borderRadius: radius.pill,
  fontSize: 13,
  fontFamily: font.sans,
  fontWeight: font.weight.semibold,
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
  transition: 'background 0.2s ease, color 0.2s ease',
  userSelect: 'none',
  WebkitUserSelect: 'none',
}

const ACTIVE_STYLE: CSSProperties = {
  ...BASE_STYLE,
  background: 'rgba(255, 255, 255, 0.18)',
  color: colors.textPrimary,
}

const INACTIVE_STYLE: CSSProperties = {
  ...BASE_STYLE,
  background: 'transparent',
  color: colors.textSecondary,
}

export default function ModeLabel({ label, active, onClick }: ModeLabelProps) {
  return (
    <button
      style={active ? ACTIVE_STYLE : INACTIVE_STYLE}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}
