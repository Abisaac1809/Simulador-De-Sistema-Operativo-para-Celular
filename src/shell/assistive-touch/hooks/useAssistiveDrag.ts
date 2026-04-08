import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { useDrag } from '@use-gesture/react'

// ── Constants ─────────────────────────────────────────────
const BALL_SIZE        = 56
const EDGE_MARGIN      = 12
const TOP_CLAMP        = 44   // avoid StatusBar
const BOTTOM_CLAMP     = 34   // avoid home bar
const STORAGE_KEY      = 'nova-os-assistive-position'
const SPRING_STIFFNESS = 300
const SPRING_DAMPING   = 30

interface PersistedPosition { x: number; y: number }

function loadPosition(): PersistedPosition | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedPosition
  } catch {
    return null
  }
}

// ── Hook ──────────────────────────────────────────────────

interface UseAssistiveDragReturn {
  springX:    MotionValue<number>
  springY:    MotionValue<number>
  bind:       ReturnType<typeof useDrag>
  isDragging: boolean
  ballRef:    RefObject<HTMLDivElement | null>
}

/**
 * useAssistiveDrag — HOOK
 *
 * Manages the AssistiveTouch ball's drag gesture, snap-to-edge behavior,
 * and localStorage position persistence. Position is clamped during the
 * drag so the ball never escapes the os-screen's overflow:hidden boundary.
 */
export function useAssistiveDrag(): UseAssistiveDragReturn {
  const ballRef = useRef<HTMLDivElement>(null)

  const saved = loadPosition()
  const initX = saved?.x ?? 322   // fallback: right edge of 390px screen
  const initY = saved?.y ?? 400

  const x = useMotionValue(initX)
  const y = useMotionValue(initY)

  const springX = useSpring(x, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING })
  const springY = useSpring(y, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING })

  const [isDragging, setIsDragging] = useState(false)

  // Captured at drag start so we can add movement delta correctly
  const originRef    = useRef({ x: initX, y: initY })
  // Captured at drag start so clamping is consistent throughout the gesture
  const parentBounds = useRef({ w: 390, h: 844 })

  const bind = useDrag(
    ({ movement: [mx, my], first, last, tap }) => {
      if (tap) return // Stop clicks from triggering drag physics

      if (first) {
        setIsDragging(true)
        originRef.current = { x: x.get(), y: y.get() }

        const parent = ballRef.current?.parentElement
        parentBounds.current = {
          w: parent?.clientWidth  ?? 390,
          h: parent?.clientHeight ?? 844,
        }
      }

      const { w, h } = parentBounds.current
      const rawX = originRef.current.x + mx
      const rawY = originRef.current.y + my

      // Clamp during drag so the ball never clips against overflow:hidden
      const clampedX = Math.max(EDGE_MARGIN, Math.min(rawX, w - BALL_SIZE - EDGE_MARGIN))
      const clampedY = Math.max(TOP_CLAMP,   Math.min(rawY, h - BALL_SIZE - BOTTOM_CLAMP))

      if (!last) {
        x.set(clampedX)
        y.set(clampedY)
        return
      }

      // Drag ended — snap X to nearest edge, keep clamped Y
      const snappedX = rawX > w / 2
        ? w - BALL_SIZE - EDGE_MARGIN
        : EDGE_MARGIN

      x.set(snappedX)
      y.set(clampedY)

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: snappedX, y: clampedY }))

      // Short delay prevents the click handler from firing as a tap
      setTimeout(() => setIsDragging(false), 50)
    },
    { filterTaps: true, threshold: 6 },
  )

  return { springX, springY, bind, isDragging, ballRef }
}
