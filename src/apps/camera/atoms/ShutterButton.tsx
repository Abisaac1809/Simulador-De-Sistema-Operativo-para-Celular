import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { colors, radius } from '../../../design'

interface ShutterButtonProps {
  mode: 'photo' | 'video'
  isRecording: boolean
  onPress: () => void
}

const OUTER_RING_STYLE: CSSProperties = {
  width: 76,
  height: 76,
  borderRadius: '50%',
  border: '3px solid rgba(255, 255, 255, 0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
  background: 'transparent',
  outline: 'none',
  padding: 0,
}

export default function ShutterButton({ mode, isRecording, onPress }: ShutterButtonProps) {
  const isVideoMode = mode === 'video'
  const innerBg = isVideoMode && isRecording ? colors.danger : 'rgba(255, 255, 255, 0.95)'
  const innerRadius = isVideoMode && isRecording ? radius.small : '50%'
  const innerSize = isVideoMode && isRecording ? 28 : 60

  return (
    <button
      type="button"
      style={OUTER_RING_STYLE}
      onClick={onPress}
      aria-label={
        isVideoMode
          ? isRecording
            ? 'Stop recording'
            : 'Start recording'
          : 'Take photo'
      }
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerRadius,
          background: innerBg,
        }}
      />
    </button>
  )
}
