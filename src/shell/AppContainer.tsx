import { Suspense, useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import { useOSStore } from '../kernel/store'
import { getApp } from '../kernel/registry'
import { scaleIn } from '../design/animations'
import { colors } from '../design/tokens'
import { Spinner } from '../design'
import AppErrorBoundary from './AppErrorBoundary'

// ── Constants ─────────────────────────────────────────────────
const CLOSE_DRAG_THRESHOLD = 100  // px downward to dismiss the app
const SPRING_STIFFNESS     = 300
const SPRING_DAMPING       = 30

// ── Styles ────────────────────────────────────────────────────
const overlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 10,
}

const gestureLayerStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  background: colors.bg,
}

// ── Hooks ─────────────────────────────────────────────────────

/**
 * useDragToClose — encapsulates swipe-down-to-close gesture logic.
 * Only active when `enabled` is true (disabled while a text input is focused).
 */
function useDragToClose(focusedAppId: string | null, enabled: boolean) {
  const closeApp = useOSStore(s => s.closeApp)
  const dragY    = useMotionValue(0)
  const springY  = useSpring(dragY, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING })

  const bind = useDrag(
    ({ movement: [, my], last }) => {
      const clamped = Math.max(0, my)  // downward only
      if (!last) {
        dragY.set(clamped)
        return
      }
      // Reset before AnimatePresence exit so the animation starts from y=0
      dragY.set(0)
      if (clamped > CLOSE_DRAG_THRESHOLD) {
        closeApp(focusedAppId!)
      }
    },
    { axis: 'y', filterTaps: true, threshold: 10, enabled },
  )

  return { bind, springY }
}

/**
 * useKeyboardOffset — tracks virtual keyboard height via visualViewport.
 * Returns pixels the keyboard is covering, or 0 on desktop.
 * Re-attaches listeners whenever the focused app changes.
 */
function useKeyboardOffset(focusedAppId: string | null): number {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    function handleResize() {
      const gap = window.innerHeight - vv!.height - (vv!.offsetTop ?? 0)
      setOffset(Math.max(0, gap))
    }

    vv.addEventListener('resize', handleResize)
    vv.addEventListener('scroll', handleResize)

    return () => {
      vv.removeEventListener('resize', handleResize)
      vv.removeEventListener('scroll', handleResize)
      setOffset(0)
    }
  }, [focusedAppId])

  return offset
}

// ── Component ─────────────────────────────────────────────────

/**
 * AppContainer — Organism
 *
 * Full-screen overlay that hosts the currently focused app.
 * Handles lazy loading (Suspense), crash recovery (ErrorBoundary),
 * swipe-down-to-close gesture, input focus detection, and
 * virtual keyboard offset.
 *
 * Layer structure (separation of concerns):
 *   motion.div [scaleIn variants — enter/exit animation]
 *     div       [gesture bind — plain div avoids framer-motion type conflict]
 *       motion.div [springY — live drag position]
 *         content
 */
export default function AppContainer() {
  const focusedAppId = useOSStore(s => s.focusedAppId)
  const manifest     = focusedAppId ? getApp(focusedAppId) : undefined

  const [isFocusingInput, setIsFocusingInput] = useState(false)
  const { bind, springY } = useDragToClose(focusedAppId, !isFocusingInput)
  const keyboardOffset    = useKeyboardOffset(focusedAppId)

  function handleFocusCapture(e: React.FocusEvent) {
    const el  = e.target as HTMLElement
    const tag = el.tagName.toLowerCase()
    if (tag === 'input' || tag === 'textarea' || el.isContentEditable) {
      setIsFocusingInput(true)
    }
  }

  function handleBlurCapture() {
    setIsFocusingInput(false)
  }

  return (
    <AnimatePresence>
      {focusedAppId && manifest && (
        // Outer motion.div: handles enter/exit animation (scaleIn)
        <motion.div
          key={focusedAppId}
          variants={scaleIn}
          initial="initial"
          animate="animate"
          exit="exit"
          style={overlayStyle}
        >
          {/* Middle div: gesture bind on a plain div avoids framer-motion onAnimationStart type conflict */}
          <div
            style={gestureLayerStyle}
            onFocusCapture={handleFocusCapture}
            onBlurCapture={handleBlurCapture}
            {...bind()}
          >
            {/* Inner motion.div: applies spring y-offset during drag */}
            <motion.div style={{ height: '100%', y: springY }}>
              <AppErrorBoundary>
                <Suspense fallback={<Spinner />}>
                  {/* Shifts content up when the virtual keyboard is open */}
                  <div
                    style={{
                      height: '100%',
                      paddingBottom: keyboardOffset,
                      boxSizing: 'border-box',
                      overflowY: 'auto',
                    }}
                  >
                    <manifest.component />
                  </div>
                </Suspense>
              </AppErrorBoundary>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
