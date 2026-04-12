import { useState, useCallback, useRef } from 'react'
import type { FlashOverlayHandle } from '../atoms/FlashOverlay'

export type FlashMode = 'off' | 'on' | 'auto'

const FLASH_MODE_CYCLE: FlashMode[] = ['off', 'on', 'auto']

export function useFlash() {
  const [flashMode, setFlashMode] = useState<FlashMode>('off')
  const overlayRef = useRef<FlashOverlayHandle>(null)

  const cycleFlash = useCallback(() => {
    setFlashMode(prev => {
      const idx = FLASH_MODE_CYCLE.indexOf(prev)
      return FLASH_MODE_CYCLE[(idx + 1) % FLASH_MODE_CYCLE.length]
    })
  }, [])

  const fireFlash = useCallback(() => {
    if (flashMode !== 'off') {
      overlayRef.current?.triggerFlash()
    }
  }, [flashMode])

  return { flashMode, cycleFlash, fireFlash, overlayRef }
}
