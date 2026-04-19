import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { GlassCard, Typography, colors, spacing } from '../../../design'
import CallDirectionIcon from '../atoms/CallDirectionIcon'
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
  incoming: 'Incoming',
  outgoing: 'Outgoing',
  missed: 'Missed',
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
          <CallDirectionIcon direction={item.direction} />

          <div style={textColStyle}>
            <Typography
              variant="body"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {item.peer.name}
            </Typography>
            <Typography variant="caption" style={{ color: colors.textSecondary }}>
              {directionLabel[item.direction] ?? 'Incoming'}
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
