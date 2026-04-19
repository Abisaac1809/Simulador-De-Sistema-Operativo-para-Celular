import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOSStore } from '../kernel/store'
import * as callsService from '../kernel/services/calls'
import { GlassCard, IconWrapper, Typography, toastIn, colors, spacing, font, radius } from '../design'

// ── Styles ────────────────────────────────────────────────────

const containerStyle: CSSProperties = {
  position: 'absolute',
  top: spacing[12],
  left: spacing[4],
  right: spacing[4],
  zIndex: 50,
  pointerEvents: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
}

const callerRowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[3],
}

const callerTextColStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}

const actionRowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: spacing[8],
  marginTop: spacing[4],
}

const actionBtnBase: CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: radius.pill,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  color: '#fff',
}

// ── Component ─────────────────────────────────────────────────

export default function CallOverlay() {
  const incomingCall = useOSStore(s => s.incomingCall)

  return (
    <div style={containerStyle} aria-live="assertive" aria-atomic="true">
      <AnimatePresence>
        {incomingCall && (
          <motion.div
            key={incomingCall.callId}
            variants={toastIn}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <GlassCard elevated padding={spacing[4]}>
              <div style={callerRowStyle}>
                <IconWrapper color={colors.accentBlue} size={48}>
                  {incomingCall.callerName.charAt(0).toUpperCase()}
                </IconWrapper>
                <div style={callerTextColStyle}>
                  <Typography
                    variant="title"
                    style={{ fontSize: 28, fontWeight: font.weight.semibold }}
                  >
                    {incomingCall.callerName}
                  </Typography>
                  <Typography variant="label" style={{ color: colors.textSecondary }}>
                    Incoming Call
                  </Typography>
                </div>
              </div>

              <div style={actionRowStyle}>
                <motion.button
                  aria-label="Decline call"
                  style={{ ...actionBtnBase, background: colors.danger }}
                  whileTap={{ scale: 0.90 }}
                  onClick={() => callsService.rejectCall()}
                >
                  <i className="fi fi-rr-phone-slash" />
                </motion.button>

                <motion.button
                  aria-label="Answer call"
                  style={{ ...actionBtnBase, background: '#22C55E' }}
                  whileTap={{ scale: 0.90 }}
                  onClick={() => callsService.answerCall()}
                >
                  <i className="fi fi-rr-phone-call" />
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
