import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { IconWrapper, Typography, colors, fadeIn, radius, spacing } from '../../../design'
import { useOSStore } from '../../../kernel/store'
import * as callsService from '../../../kernel/services/calls'
import DurationCounter from '../atoms/DurationCounter'

// ── Styles ────────────────────────────────────────────────

const CONTAINER_STYLE: CSSProperties = {
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${spacing[8]}px ${spacing[6]}px`,
  background: colors.bg,
}

const TOP_SECTION_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[4],
}

const BOTTOM_ROW_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: spacing[8],
}

const circleBtnStyle = (bg: string): CSSProperties => ({
  width: 56,
  height: 56,
  borderRadius: radius.pill,
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: 'none',
  fontSize: 22,
})

// ── Component ─────────────────────────────────────────────

export default function ActiveCallScreen() {
  const activeCall = useOSStore(s => s.activeCall)

  if (!activeCall) return null

  const muteBg = activeCall.isMuted ? colors.glassBgActive : colors.glassBg
  const muteIconColor = activeCall.isMuted ? colors.accent : colors.textPrimary
  const muteIcon = activeCall.isMuted ? 'fi fi-rr-microphone-slash' : 'fi fi-rr-microphone'
  const muteLabel = activeCall.isMuted ? 'Unmute' : 'Mute'

  const statusLabel = activeCall.status === 'calling' ? 'Calling…' : 'Connected'

  return (
    <motion.div
      style={CONTAINER_STYLE}
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Top section */}
      <div style={TOP_SECTION_STYLE}>
        <IconWrapper color={colors.accentBlue} size={72}>
          {activeCall.peerName.charAt(0).toUpperCase()}
        </IconWrapper>

        <Typography variant="title" style={{ fontSize: 28, textAlign: 'center' }}>
          {activeCall.peerName}
        </Typography>

        {activeCall.startedAt != null ? (
          <DurationCounter startedAt={activeCall.startedAt} />
        ) : (
          <Typography variant="body" style={{ color: colors.textSecondary }}>—</Typography>
        )}

        <Typography variant="caption">
          {statusLabel}
        </Typography>
      </div>

      {/* Bottom action row */}
      <div style={BOTTOM_ROW_STYLE}>
        {/* Mute button */}
        <motion.button
          style={circleBtnStyle(muteBg)}
          aria-label={muteLabel}
          onClick={() => callsService.toggleMute()}
          whileTap={{ scale: 0.90 }}
        >
          <i className={muteIcon} style={{ color: muteIconColor }} />
        </motion.button>

        {/* Hang up button */}
        <motion.button
          style={circleBtnStyle(colors.danger)}
          aria-label="Hang up"
          onClick={() => callsService.hangUp()}
          whileTap={{ scale: 0.90 }}
        >
          <i className="fi fi-rr-phone-slash" style={{ color: '#fff' }} />
        </motion.button>
      </div>
    </motion.div>
  )
}
