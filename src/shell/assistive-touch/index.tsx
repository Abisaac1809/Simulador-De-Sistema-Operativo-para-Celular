import type { CSSProperties } from 'react'
import { useOSStore } from '../../kernel/store'
import { useAssistiveDrag } from './hooks/useAssistiveDrag'
import { useAssistiveTouchMenu } from './hooks/useAssistiveTouchMenu'
import AssistiveBall from './atoms/AssistiveBall'
import AssistiveTouchMenu from './molecules/AssistiveTouchMenu'

// ── Constants ─────────────────────────────────────────────

const CONTAINER_STYLE: CSSProperties = {
  position:      'absolute',
  inset:         0,
  zIndex:        45,
  pointerEvents: 'none',
}

// ── Component ─────────────────────────────────────────────

interface AssistiveTouchProps {
  onOpenSwitcher:    () => void
  onOpenNotifCenter: () => void
}

/**
 * AssistiveTouch — ORGANISM
 *
 * iOS-style floating accessibility ball. Draggable anywhere on screen,
 * snaps to the nearest vertical edge on release. Tap to open a quick-action
 * menu with Home, Recents, Notifications, Lock, and Force Quit.
 *
 * Hidden when the device is locked.
 */
export default function AssistiveTouch({
  onOpenSwitcher,
  onOpenNotifCenter,
}: AssistiveTouchProps) {
  const isLocked = useOSStore(s => s.isLocked)

  const { springX, springY, bind, isDragging, ballRef } = useAssistiveDrag()
  const { isMenuOpen, toggleMenu, closeMenu, actions }  = useAssistiveTouchMenu({
    onOpenSwitcher,
    onOpenNotifCenter,
  })

  if (isLocked) return null

  return (
    <div style={CONTAINER_STYLE}>
      <AssistiveTouchMenu
        isOpen={isMenuOpen}
        actions={actions}
        ballX={springX}
        ballY={springY}
        onClose={closeMenu}
      />
      <AssistiveBall
        springX={springX}
        springY={springY}
        bind={bind}
        isMenuOpen={isMenuOpen}
        isDragging={isDragging}
        onTap={toggleMenu}
        ballRef={ballRef}
      />
    </div>
  )
}
