import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { colors, font, spacing, radius } from '../../../design'

interface RecordingIndicatorProps {
  elapsedMs: number
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')
  return `${mm}:${ss}`
}

const WRAPPER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[2],
  background: 'rgba(0, 0, 0, 0.55)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  borderRadius: radius.pill,
  paddingTop: spacing[1],
  paddingBottom: spacing[1],
  paddingLeft: spacing[2],
  paddingRight: spacing[3],
}

const DOT_STYLE: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: colors.danger,
  flexShrink: 0,
}

const TIME_STYLE: CSSProperties = {
  fontFamily: font.mono,
  fontWeight: font.weight.medium,
  fontSize: 13,
  color: colors.textPrimary,
  letterSpacing: '0.04em',
}

export default function RecordingIndicator({ elapsedMs }: RecordingIndicatorProps) {
  return (
    <div style={WRAPPER_STYLE}>
      <motion.div
        style={DOT_STYLE}
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span style={TIME_STYLE}>{formatTime(elapsedMs)}</span>
    </div>
  )
}
