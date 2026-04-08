import type { CSSProperties, RefObject } from 'react'
import { motion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import { animation } from '../../../design'

// ── Constants ─────────────────────────────────────────────

const BALL_SIZE = 56

const POSITIONER_STYLE: CSSProperties = {
  position:      'absolute',
  left:          0,
  top:           0,
  width:         BALL_SIZE,
  height:        BALL_SIZE,
  zIndex:        45,
  pointerEvents: 'auto',
}

const GESTURE_STYLE: CSSProperties = {
  width:       '100%',
  height:      '100%',
  cursor:      'grab',
  touchAction: 'none',
}

const CIRCLE_STYLE: CSSProperties = {
  width:                '100%',
  height:               '100%',
  borderRadius:         20, // iOS squircle-like
  backdropFilter:       'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border:               '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow:            '0 4px 16px rgba(0, 0, 0, 0.3)',
  display:              'flex',
  alignItems:           'center',
  justifyContent:       'center',
  transition:           'background 0.2s, opacity 0.2s',
}

const INNER_RING_STYLE: CSSProperties = {
  width:          30,
  height:         30,
  borderRadius:   15,
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  transition:     'background 0.2s',
}

const INNER_DOT_STYLE: CSSProperties = {
  width:        14,
  height:       14,
  borderRadius: 7,
  transition:   'background 0.2s',
}

// ── Component ─────────────────────────────────────────────

interface AssistiveBallProps {
  springX:    MotionValue<number>
  springY:    MotionValue<number>
  bind:       ReturnType<typeof useDrag>
  isMenuOpen: boolean
  isDragging: boolean
  onTap:      () => void
  ballRef:    RefObject<HTMLDivElement | null>
}

/**
 * AssistiveBall — ATOM
 *
 * iOS-style structured AssistiveTouch ball:
 * Rounded rect (squircle) with concentric translucent rings.
 */
export default function AssistiveBall({
  springX,
  springY,
  bind,
  isMenuOpen,
  isDragging,
  onTap,
  ballRef,
}: AssistiveBallProps) {
  
// ... keeping previous constants ...
  // Dynamic bright state for dragging or active menu
  const isActive = isDragging || isMenuOpen
  
  const bgMain = isActive ? 'rgba(50, 50, 50, 0.85)' : 'rgba(30, 30, 30, 0.65)'
  const bgRing = isActive ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)'
  const bgDot  = isActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)'
  const glow = isActive ? '0 4px 20px rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255,255,255,0.1)' : '0 4px 16px rgba(0, 0, 0, 0.3)'
  
  return (
    <motion.div
      ref={ballRef}
      style={{ ...POSITIONER_STYLE, x: springX, y: springY }}
      animate={{ opacity: isMenuOpen ? 1 : (isDragging ? 1 : 0.6) }}
      transition={{ opacity: { duration: animation.duration.fast } }}
    >
      <div
        style={GESTURE_STYLE}
        {...bind()}
        onClick={() => { if (!isDragging) onTap() }}
      >
        <motion.div
          style={{ width: '100%', height: '100%' }}
          whileTap={{ scale: 0.9 }}
        >
          <div style={{ ...CIRCLE_STYLE, background: bgMain, boxShadow: glow }}>
            <div style={{ ...INNER_RING_STYLE, background: bgRing }}>
              <div style={{ ...INNER_DOT_STYLE, background: bgDot }} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
