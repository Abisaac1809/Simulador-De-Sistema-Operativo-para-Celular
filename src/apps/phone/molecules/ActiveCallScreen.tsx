import { useRef, useEffect } from 'react'
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
  overflow: 'hidden',
}

const TOP_SECTION_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[4],
  zIndex: 2,
}

const BOTTOM_ROW_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: spacing[6],
  zIndex: 2,
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

const REMOTE_VIDEO_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0,
}

const LOCAL_PIP_STYLE: CSSProperties = {
  position: 'absolute',
  bottom: 120,
  right: 16,
  width: 120,
  height: 160,
  borderRadius: 12,
  objectFit: 'cover',
  transform: 'scaleX(-1)',
  zIndex: 10,
  border: '2px solid rgba(255,255,255,0.3)',
}

// ── Component ─────────────────────────────────────────────

export default function ActiveCallScreen() {
  const activeCall = useOSStore(s => s.activeCall)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = remoteVideoRef.current
    if (!el) return
    const stage = el.closest('.desktop-stage, .mobile-stage') as HTMLElement | null
    if (stage && stage.offsetParent === null) return
    callsService.setRemoteVideoElement(el)
    return () => callsService.setRemoteVideoElement(null)
  }, [])

  useEffect(() => {
    if (activeCall?.isVideoEnabled && localVideoRef.current) {
      const track = callsService.getLocalVideoTrack()
      if (track) {
        localVideoRef.current.srcObject = new MediaStream([track])
      }
    } else if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
  }, [activeCall?.isVideoEnabled])

  if (!activeCall) return null

  const muteBg = activeCall.isMuted ? colors.glassBgActive : colors.glassBg
  const muteIconColor = activeCall.isMuted ? colors.accent : colors.textPrimary
  const muteIcon = activeCall.isMuted ? 'fi fi-rr-microphone-slash' : 'fi fi-rr-microphone'
  const muteLabel = activeCall.isMuted ? 'Activar micro' : 'Silenciar'

  const videoBg = activeCall.isVideoEnabled ? colors.glassBgActive : colors.glassBg
  const videoIconColor = activeCall.isVideoEnabled ? colors.accent : colors.textPrimary
  const videoIcon = activeCall.isVideoEnabled ? 'fi fi-rr-video-camera' : 'fi fi-rr-video-camera-alt'
  const videoLabel = activeCall.isVideoEnabled ? 'Desactivar cámara' : 'Activar cámara'

  const statusLabel = activeCall.status === 'calling' ? 'Llamando…' : 'Conectado'
  const showRemoteVideo = activeCall.isRemoteVideoEnabled

  return (
    <motion.div
      style={CONTAINER_STYLE}
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Remote video (fullscreen background) */}
      <video
        ref={remoteVideoRef}
        style={{ ...REMOTE_VIDEO_STYLE, display: showRemoteVideo ? 'block' : 'none' }}
        autoPlay
        playsInline
      />

      {/* Local PiP video */}
      {activeCall.isVideoEnabled && (
        <video
          ref={localVideoRef}
          style={LOCAL_PIP_STYLE}
          autoPlay
          playsInline
          muted
        />
      )}

      {/* Top section */}
      <div style={{
        ...TOP_SECTION_STYLE,
        ...(showRemoteVideo ? { background: 'rgba(0,0,0,0.4)', borderRadius: 16, padding: spacing[4] } : {}),
      }}>
        {!showRemoteVideo && (
          <IconWrapper color={colors.accentBlue} size={72}>
            {activeCall.peerName.charAt(0).toUpperCase()}
          </IconWrapper>
        )}

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

        {/* Video toggle button */}
        <motion.button
          style={circleBtnStyle(videoBg)}
          aria-label={videoLabel}
          onClick={() => callsService.toggleVideo()}
          whileTap={{ scale: 0.90 }}
        >
          <i className={videoIcon} style={{ color: videoIconColor }} />
        </motion.button>

        {/* Hang up button */}
        <motion.button
          style={circleBtnStyle(colors.danger)}
          aria-label="Colgar"
          onClick={() => callsService.hangUp()}
          whileTap={{ scale: 0.90 }}
        >
          <i className="fi fi-rr-phone-slash" style={{ color: '#fff' }} />
        </motion.button>
      </div>
    </motion.div>
  )
}
