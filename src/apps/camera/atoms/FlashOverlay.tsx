import { useImperativeHandle, forwardRef } from 'react'
import { useAnimate } from 'framer-motion'

export interface FlashOverlayHandle {
  triggerFlash: () => void
}

const OVERLAY_BASE = {
  position: 'fixed' as const,
  inset: 0,
  background: '#ffffff',
  pointerEvents: 'none' as const,
  zIndex: 9999,
  opacity: 0,
}

const FlashOverlay = forwardRef<FlashOverlayHandle>((_, ref) => {
  const [scope, animate] = useAnimate()

  useImperativeHandle(ref, () => ({
    triggerFlash() {
      void animate(scope.current, { opacity: [1, 0] }, { duration: 0.3, ease: 'easeOut' })
    },
  }))

  return <div ref={scope} style={OVERLAY_BASE} />
})

FlashOverlay.displayName = 'FlashOverlay'

export default FlashOverlay
