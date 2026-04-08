import type { CSSProperties } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import { useOSStore } from '../kernel/store'
import { getApp } from '../kernel/registry'
import type { AppManifest, Process } from '../types'
import { GlassButton, Typography } from '../design'
import { fadeIn } from '../design/animations'
import { spacing } from '../design/tokens'
import AppCard from './AppCard'

// ── Constants ─────────────────────────────────────────────────
const DISMISS_DRAG_THRESHOLD    = 60   // px downward to close the switcher
const SWITCHER_SPRING_STIFFNESS = 400
const SWITCHER_SPRING_DAMPING   = 35

// ── Styles ────────────────────────────────────────────────────
const overlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 20,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  paddingBottom: 80,
  background: 'rgba(0, 0, 0, 0.60)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
}

const cardRowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  overflowX: 'auto',
  gap: spacing[4],
  padding: spacing[6],
  alignItems: 'flex-end',
  scrollSnapType: 'x mandatory',
}

const bottomBarStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: spacing[4],
}

const emptyStateStyle: CSSProperties = {
  margin: 'auto',
  textAlign: 'center',
  padding: spacing[6],
}

// ── Types ─────────────────────────────────────────────────────
interface AppSwitcherProps {
  isOpen:  boolean
  onClose: () => void
}

interface OpenAppEntry {
  process:  Process
  manifest: AppManifest
}

// ── Component ─────────────────────────────────────────────────

/**
 * AppSwitcher — Organism
 *
 * Full-screen task-manager overlay showing all open apps as a card stack.
 * Tap a card to focus its app; swipe a card up to kill it.
 * Swipe down or tap the backdrop to dismiss.
 */
export default function AppSwitcher({ isOpen, onClose }: AppSwitcherProps) {
  const processes   = useOSStore(s => s.processes)
  const focusApp    = useOSStore(s => s.focusApp)
  const closeApp    = useOSStore(s => s.closeApp)
  const killAllApps = useOSStore(s => s.killAllApps)

  const openApps: OpenAppEntry[] = processes
    .filter(p => p.type === 'app' && p.status !== 'killed' && p.status !== 'swapped')
    .map(p => ({ process: p, manifest: getApp(p.appId!) }))
    .filter((item): item is OpenAppEntry => !!item.manifest)

  const overlayY       = useMotionValue(0)
  const overlaySpringY = useSpring(overlayY, {
    stiffness: SWITCHER_SPRING_STIFFNESS,
    damping:   SWITCHER_SPRING_DAMPING,
  })

  const bindOverlay = useDrag(
    ({ movement: [, my], last }) => {
      const clamped = Math.max(0, my)  // downward only
      if (!last) {
        overlayY.set(clamped)
        return
      }
      overlayY.set(0)
      if (clamped > DISMISS_DRAG_THRESHOLD) onClose()
    },
    { axis: 'y', filterTaps: true, threshold: 8 },
  )

  return (
    <AnimatePresence>
      {isOpen && (
        // Outer motion.div: enter/exit animation (fadeIn variants) + backdrop tap
        <motion.div
          key="app-switcher"
          variants={fadeIn}
          initial="initial"
          animate="animate"
          exit="exit"
          style={overlayStyle}
          onClick={onClose}
        >
          {/* Plain div: gesture bind — avoids framer-motion onAnimationStart type conflict */}
          <div
            style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', touchAction: 'none' }}
            {...bindOverlay()}
          >
            {/* Inner motion.div: live spring y-offset while dragging */}
            <motion.div
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', flex: 1, y: overlaySpringY }}
            >
              {/* Card row — stopPropagation prevents backdrop tap from firing */}
              <div style={cardRowStyle} onClick={e => e.stopPropagation()}>
                {openApps.length === 0 ? (
                  <div style={emptyStateStyle}>
                    <Typography variant="muted">No open apps</Typography>
                  </div>
                ) : (
                  openApps.map(({ process, manifest }) => (
                    <AppCard
                      key={process.appId}
                      manifest={manifest}
                      onFocus={() => { focusApp(process.appId!); onClose() }}
                      onKill={() => closeApp(process.appId!)}
                    />
                  ))
                )}
              </div>

              {/* Bottom bar */}
              {openApps.length > 0 && (
                <div style={bottomBarStyle} onClick={e => e.stopPropagation()}>
                  <GlassButton
                    variant="danger"
                    onClick={() => { killAllApps(); onClose() }}
                  >
                    Close All
                  </GlassButton>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
