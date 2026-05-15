import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { GlassCard, Typography, colors, spacing, font } from '../../../design'
import type { CallHistoryItem } from '../hooks/useCallHistory'

interface Props {
  item: CallHistoryItem
  onCallback: (peer: { id: string; name: string }) => void
}

const rowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[3],
}

const textColStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flex: 1,
  minWidth: 0,
}

const rightColStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 4,
  flexShrink: 0,
}

const directionLabel: Record<string, string> = {
  incoming: 'Entrante',
  outgoing: 'Saliente',
  missed: 'Perdida',
}

const AVATAR_COLORS = [
  colors.accentBlue,
  colors.accentPurple,
  colors.accentPink,
  colors.accentCyan,
  colors.accent,
]

function nameToColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function InitialsAvatar({ name, direction }: { name: string; direction: string }) {
  const bg = nameToColor(name)
  const directionIconStyle: CSSProperties = {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: colors.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${colors.glassBorder}`,
  }
  const iconColor =
    direction === 'missed' ? colors.danger :
    direction === 'incoming' ? colors.accentBlue :
    colors.textSecondary

  return (
    <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: `${bg}22`,
          border: `1.5px solid ${bg}66`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: bg, fontSize: 14, fontWeight: font.weight.semibold, letterSpacing: 0.5 }}>
          {getInitials(name)}
        </span>
      </div>
      <div style={directionIconStyle}>
        <i
          className={
            direction === 'missed' ? 'fi fi-rr-phone-missed' :
            direction === 'incoming' ? 'fi fi-rr-phone-incoming' :
            'fi fi-rr-phone-outgoing'
          }
          style={{ fontSize: 9, color: iconColor, lineHeight: 1 }}
        />
      </div>
    </div>
  )
}

function formatCallDuration(duration: number, direction: string): string {
  if (direction === 'missed' || duration === 0) return '—'
  const m = Math.floor(duration / 60)
  const s = duration % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatTimestamp(isoString: string): string {
  return new Date(isoString).toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  })
}

export default function CallEntry({ item, onCallback }: Props) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onCallback({ id: item.peer.id, name: item.peer.name })}
      style={{ cursor: 'pointer' }}
    >
      <GlassCard padding={`${spacing[2]}px ${spacing[4]}px`}>
        <div style={rowStyle}>
          <InitialsAvatar name={item.peer.name} direction={item.direction} />

          <div style={textColStyle}>
            <Typography
              variant="body"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {item.peer.name}
            </Typography>
            <Typography variant="caption" style={{ color: item.direction === 'missed' ? colors.danger : colors.textSecondary }}>
              {directionLabel[item.direction] ?? 'Entrante'}
            </Typography>
          </div>

          <div style={rightColStyle}>
            <Typography variant="caption" style={{ color: colors.textSecondary }}>
              {formatCallDuration(item.duration, item.direction)}
            </Typography>
            <Typography variant="caption" style={{ color: colors.textMuted }}>
              {formatTimestamp(item.startedAt)}
            </Typography>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
