import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { colors, fadeIn, glass } from '../../design'
import useCalculator from './hooks/useCalculator'
import CalcDisplay from './molecules/CalcDisplay'
import CalcKeypad from './molecules/CalcKeypad'

const ROOT_STYLE: CSSProperties = {
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: colors.bg,
}

const GRADIENT_OVERLAY_STYLE: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 220,
  background:
    'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(94,106,210,0.12) 0%, transparent 70%)',
  pointerEvents: 'none',
}

const DISPLAY_SECTION_STYLE: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  backdropFilter: glass.backdropFilterLight,
  WebkitBackdropFilter: glass.backdropFilterLight,
}

const DIVIDER_STYLE: CSSProperties = {
  height: 1,
  marginInline: 16,
  background: colors.glassBorder,
  flexShrink: 0,
}

const KEYPAD_SECTION_STYLE: CSSProperties = {
  flexShrink: 0,
  paddingTop: 12,
}

export default function CalculatorApp() {
  const controls = useCalculator()

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      style={ROOT_STYLE}
    >
      <div style={GRADIENT_OVERLAY_STYLE} aria-hidden="true" />

      <div style={DISPLAY_SECTION_STYLE}>
        <CalcDisplay
          display={controls.display}
          expression={controls.expression}
        />
      </div>

      <div style={DIVIDER_STYLE} />

      <div style={KEYPAD_SECTION_STYLE}>
        <CalcKeypad controls={controls} />
      </div>
    </motion.div>
  )
}
