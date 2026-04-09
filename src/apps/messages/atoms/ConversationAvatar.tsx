import type { CSSProperties } from 'react'
import { colors, font, radius } from '../../../design'

const AVATAR_SIZE = 44
const AVATAR_FONT_SIZE = 16

const AVATAR_PALETTE = [
  '#FF9500', '#FF6060', '#A060FF',
  '#6090FF', '#60D0FF', '#32D74B', '#FF60A0',
] as const

const CIRCLE_BASE_STYLE: CSSProperties = {
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  borderRadius: radius.pill,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

const INITIALS_STYLE: CSSProperties = {
  fontSize: AVATAR_FONT_SIZE,
  fontWeight: font.weight.semibold,
  color: colors.textPrimary,
  lineHeight: 1,
  fontFamily: font.sans,
}

function getAvatarColor(name: string): string {
  const hash = name.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length]
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return (parts[0][0] ?? '?').toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

interface ConversationAvatarProps {
  name: string
  size?: number
}

export default function ConversationAvatar({ name, size }: ConversationAvatarProps) {
  const bg = getAvatarColor(name)
  const initials = getInitials(name)
  const dynamicSize = size ?? AVATAR_SIZE

  return (
    <div
      style={{
        ...CIRCLE_BASE_STYLE,
        width: dynamicSize,
        height: dynamicSize,
        background: `${bg}33`,
        border: `1.5px solid ${bg}66`,
      }}
    >
      <span style={INITIALS_STYLE}>{initials}</span>
    </div>
  )
}
