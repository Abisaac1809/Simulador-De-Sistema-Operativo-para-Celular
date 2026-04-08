import { useState } from 'react'
import type { CSSProperties } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import type { AppManifest } from '../types'
import { GlassCard, IconWrapper, Typography } from '../design'
import { slideUp } from '../design/animations'

// ── Constants ─────────────────────────────────────────────────
const KILL_DRAG_THRESHOLD      = 80   // px upward to kill the app
const SWITCHER_SPRING_STIFFNESS = 400
const SWITCHER_SPRING_DAMPING   = 35

// ── Styles ────────────────────────────────────────────────────
const wrapperStyle: CSSProperties = {
  flexShrink: 0,
  scrollSnapAlign: 'center',
  cursor: 'pointer',
}

const cardContentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
}

// ── Types ─────────────────────────────────────────────────────
interface AppCardProps {
  manifest: AppManifest
  onFocus: () => void
  onKill:  () => void
}

/**
 * AppCard — Molecule
 *
 * Displays a single open app inside the AppSwitcher.
 * Tap to bring it to focus; swipe up > 80px to kill it.
 */
export default function AppCard({ manifest, onFocus, onKill }: AppCardProps) {
  const [dismissed, setDismissed] = useState(false)

  const cardY      = useMotionValue(0)
  const cardSpringY = useSpring(cardY, {
    stiffness: SWITCHER_SPRING_STIFFNESS,
    damping:   SWITCHER_SPRING_DAMPING,
  })

  const bind = useDrag(
    ({ movement: [, my], last }) => {
      const clamped = Math.min(0, my)  // upward only (negative values)
      if (!last) {
        cardY.set(clamped)
        return
      }
      cardY.set(0)
      if (clamped < -KILL_DRAG_THRESHOLD) {
        setDismissed(true)
        onKill()
      }
    },
    { axis: 'y', filterTaps: true, threshold: 8 },
  )

  return (
    <AnimatePresence>
      {!dismissed && (
        // Outer motion.div: enter/exit animation (slideUp variants)
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          exit="exit"
          style={wrapperStyle}
          onClick={onFocus}
        >
          {/* Plain div: gesture bind — avoids framer-motion onAnimationStart type conflict */}
          <div {...bind()} style={{ touchAction: 'none' }}>
            {/* Inner motion.div: live spring y-offset while dragging */}
            <motion.div style={{ y: cardSpringY }}>
              <GlassCard elevated padding={20} style={{ width: 160 }}>
                <div style={cardContentStyle}>
                  <IconWrapper color={manifest.color} size={64}>
                    {manifest.icon}
                  </IconWrapper>
                  <Typography variant="label">{manifest.name}</Typography>
                  <Typography variant="muted">Tap to open</Typography>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
