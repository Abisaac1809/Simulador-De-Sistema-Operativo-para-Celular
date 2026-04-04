import { kernelBus } from '../events'
import { useOSStore } from '../store'

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'notification' | 'error'

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 30,
  heavy: 60,
  notification: [30, 50, 30],
  error: [60, 50, 60, 50, 60],
}

export function vibrate(pattern: HapticPattern = 'medium') {
  if (!useOSStore.getState().hapticsEnabled) return
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  navigator.vibrate(patterns[pattern])
}

function onLock() { vibrate('light') }
function onUnlock() { vibrate('light') }
function onNotification() { vibrate('notification') }

let running = false

export function start() {
  if (running) return
  running = true
  useOSStore.getState().registerDaemon('haptics', 3)
  kernelBus.on('system:lock', onLock)
  kernelBus.on('system:unlock', onUnlock)
  kernelBus.on('notification:push', onNotification)
}

export function stop() {
  if (!running) return
  running = false
  kernelBus.off('system:lock', onLock)
  kernelBus.off('system:unlock', onUnlock)
  kernelBus.off('notification:push', onNotification)
  useOSStore.getState().unregisterDaemon('haptics')
}
