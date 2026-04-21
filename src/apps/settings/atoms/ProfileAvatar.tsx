import type { CSSProperties } from 'react'
import { colors, font, radius } from '../../../design'

const PALETTE = [
  '#FF9500', '#FF6060', '#A060FF',
  '#6090FF', '#60D0FF', '#32D74B', '#FF60A0',
] as const

const BASE_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: radius.pill,
  flexShrink: 0,
}

function hashColor(name: string): string {
  const hash = name.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return PALETTE[hash % PALETTE.length]
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return (parts[0][0] ?? '?').toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

interface ProfileAvatarProps {
  name: string
  size?: number
}

export default function ProfileAvatar({ name, size = 64 }: ProfileAvatarProps) {
  const bg = hashColor(name)
  return (
    <div
      style={{
        ...BASE_STYLE,
        width: size,
        height: size,
        background: `${bg}33`,
        border: `2px solid ${bg}66`,
      }}
    >
      <span style={{ fontSize: size * 0.35, fontWeight: font.weight.semibold, color: colors.textPrimary, lineHeight: 1, fontFamily: font.sans }}>
        {initials(name)}
      </span>
    </div>
  )
}
