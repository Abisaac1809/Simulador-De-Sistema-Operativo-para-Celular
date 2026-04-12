import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { colors, font, spacing, radius } from '../../../design'

export type CameraError = 'denied' | 'notfound' | 'inuse' | 'unknown'

const ERROR_MESSAGES: Record<CameraError, { title: string; body: string }> = {
  denied: {
    title: 'Camera Access Denied',
    body: 'Allow camera access in your browser settings, then retry.',
  },
  notfound: {
    title: 'No Camera Found',
    body: 'Connect a camera device and try again.',
  },
  inuse: {
    title: 'Camera In Use',
    body: 'Another app is using the camera. Close it and retry.',
  },
  unknown: {
    title: 'Camera Unavailable',
    body: 'An unexpected error occurred. Please retry.',
  },
}

interface CameraErrorStateProps {
  error: CameraError
  onRetry: () => void
}

const ROOT_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: colors.bg,
  gap: spacing[3],
  padding: spacing[8],
}

const ICON_STYLE: CSSProperties = {
  fontSize: 48,
  color: colors.textSecondary,
  marginBottom: spacing[2],
}

const TITLE_STYLE: CSSProperties = {
  fontFamily: font.sans,
  fontWeight: font.weight.semibold,
  fontSize: 18,
  color: colors.textPrimary,
  textAlign: 'center',
  margin: 0,
}

const BODY_STYLE: CSSProperties = {
  fontFamily: font.sans,
  fontWeight: font.weight.regular,
  fontSize: 14,
  color: colors.textSecondary,
  textAlign: 'center',
  margin: 0,
  lineHeight: 1.5,
}

const RETRY_BTN_STYLE: CSSProperties = {
  marginTop: spacing[4],
  paddingTop: spacing[2],
  paddingBottom: spacing[2],
  paddingLeft: spacing[6],
  paddingRight: spacing[6],
  borderRadius: radius.button,
  border: '1px solid rgba(255, 255, 255, 0.14)',
  background: 'rgba(255, 255, 255, 0.08)',
  color: colors.textPrimary,
  fontFamily: font.sans,
  fontWeight: font.weight.medium,
  fontSize: 14,
  cursor: 'pointer',
  outline: 'none',
}

export default function CameraErrorState({ error, onRetry }: CameraErrorStateProps) {
  const { title, body } = ERROR_MESSAGES[error]

  return (
    <motion.div
      style={ROOT_STYLE}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <i className="fi fi-rr-camera-slash" style={ICON_STYLE} />
      <p style={TITLE_STYLE}>{title}</p>
      <p style={BODY_STYLE}>{body}</p>
      <button style={RETRY_BTN_STYLE} onClick={onRetry} type="button">
        Retry
      </button>
    </motion.div>
  )
}
