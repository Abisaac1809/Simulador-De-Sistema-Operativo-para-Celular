import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { colors, radius } from '../../../design'

const TRACK_W = 44
const TRACK_H = 24
const KNOB_SIZE = 20
const KNOB_OFFSET = 2

const TRACK_STYLE: CSSProperties = {
  width: TRACK_W,
  height: TRACK_H,
  borderRadius: radius.pill,
  position: 'relative',
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background 0.2s',
}

const KNOB_STYLE: CSSProperties = {
  width: KNOB_SIZE,
  height: KNOB_SIZE,
  borderRadius: radius.pill,
  background: '#fff',
  position: 'absolute',
  top: KNOB_OFFSET,
}

interface ToggleSwitchProps {
  value: boolean
  onChange: (v: boolean) => void
}

export default function ToggleSwitch({ value, onChange }: ToggleSwitchProps) {
  return (
    <div
      style={{
        ...TRACK_STYLE,
        background: value ? colors.accent : colors.glassBg,
      }}
      onClick={() => onChange(!value)}
    >
      <motion.div
        style={KNOB_STYLE}
        animate={{ left: value ? TRACK_W - KNOB_SIZE - KNOB_OFFSET : KNOB_OFFSET }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </div>
  )
}
