import type { CSSProperties } from 'react'
import { colors, font, radius, spacing } from '../../../design'

const BADGE_MIN_SIZE = 20
const BADGE_FONT_SIZE = 11

const BADGE_STYLE: CSSProperties = {
  minWidth: BADGE_MIN_SIZE,
  height: BADGE_MIN_SIZE,
  borderRadius: radius.pill,
  background: colors.accentBlue,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `0 ${spacing[1]}px`,
  fontSize: BADGE_FONT_SIZE,
  fontWeight: font.weight.semibold,
  fontFamily: font.sans,
  color: colors.textPrimary,
  flexShrink: 0,
}

interface UnreadBadgeProps {
  count: number
}

export default function UnreadBadge({ count }: UnreadBadgeProps) {
  if (count === 0) return null

  return (
    <div style={BADGE_STYLE}>
      {count > 99 ? '99+' : count}
    </div>
  )
}
