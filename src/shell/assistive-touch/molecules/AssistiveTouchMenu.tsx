import type { CSSProperties } from 'react'
import { AnimatePresence, motion, useTransform } from 'framer-motion'
import type { MotionValue, Variants } from 'framer-motion'
import { spacing, animation, fadeIn } from '../../../design'
import MenuAction from '../atoms/MenuAction'
import type { ActionConfig } from '../hooks/useAssistiveTouchMenu'

// ── Constants ─────────────────────────────────────────────

// Menu grid: 2 columns × 72px buttons + 1 gap × 12px + padding 8px each side
const MENU_WIDTH   = 2 * 72 + 1 * spacing[3] + 2 * spacing[2]  // = 172
const MENU_HEIGHT  = 3 * 72 + 2 * spacing[3] + 2 * spacing[2]  // = 256
const BALL_SIZE    = 56
const HALF_SCREEN_X = 200

const transitionOut = { duration: animation.duration.normal, ease: animation.ease.out }
const transitionIn  = { duration: animation.duration.fast,   ease: animation.ease.in  }

const menuVariant: Variants = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale:   1,
    transition: {
      ...transitionOut,
      staggerChildren: 0.04,
    },
  },
  exit: { opacity: 0, scale: 0.85, transition: transitionIn },
}

const OVERLAY_STYLE: CSSProperties = {
  position:      'absolute',
  inset:         0,
  zIndex:        45,
  pointerEvents: 'none',
}

const BACKDROP_STYLE: CSSProperties = {
  position:             'absolute',
  inset:                0,
  background:           'rgba(0, 0, 0, 0.55)',
  backdropFilter:       'blur(2px)',
  WebkitBackdropFilter: 'blur(2px)',
  pointerEvents:        'auto',
}

const POPUP_STYLE: CSSProperties = {
  position:            'absolute',
  left:                0,
  top:                 0,
  width:               MENU_WIDTH,
  height:              MENU_HEIGHT,
  padding:             spacing[2],
  display:             'grid',
  gridTemplateColumns: `repeat(2, 72px)`,
  gap:                 spacing[3],
  pointerEvents:       'auto',
}

// ── Component ─────────────────────────────────────────────

interface AssistiveTouchMenuProps {
  isOpen:  boolean
  actions: ActionConfig[]
  ballX:   MotionValue<number>
  ballY:   MotionValue<number>
  onClose: () => void
}

/**
 * AssistiveTouchMenu — MOLECULE
 *
 * Glass popup grid of action buttons that appears when the AssistiveTouch
 * ball is tapped. Positions itself near the ball, avoiding screen edges.
 */
export default function AssistiveTouchMenu({
  isOpen,
  actions,
  ballX,
  ballY,
  onClose,
}: AssistiveTouchMenuProps) {
  // Position the menu strictly to the left or right side of the ball
  const menuLeft = useTransform(ballX, bx =>
    bx > HALF_SCREEN_X ? bx - MENU_WIDTH - 8 : bx + BALL_SIZE + 8,
  )

  // Align menu vertically centered with the ball, while ensuring it never clips out of bounds
  const menuTop = useTransform(ballY, by => {
    let idealTop = by - (MENU_HEIGHT / 2) + (BALL_SIZE / 2)
    // Clamp top (prevent crossing the iOS status bar area ~44px)
    if (idealTop < 44) idealTop = 44
    // Clamp bottom (prevent crossing the iOS home indicator area ~34px)
    if (idealTop > 810 - MENU_HEIGHT) idealTop = 810 - MENU_HEIGHT
    return idealTop
  })

  return (
    <div style={OVERLAY_STYLE}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — closes menu on tap */}
            <motion.div
              key="backdrop"
              style={BACKDROP_STYLE}
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={onClose}
            />

            {/* Popup grid */}
            <motion.div
              key="popup"
              style={{ ...POPUP_STYLE, x: menuLeft, y: menuTop }}
              variants={menuVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {actions.map((action, i) => (
                <MenuAction
                  key={action.id}
                  index={i}
                  icon={action.icon}
                  label={action.label}
                  disabled={action.disabled}
                  isDanger={action.isDanger}
                  onPress={action.onPress}
                />
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
