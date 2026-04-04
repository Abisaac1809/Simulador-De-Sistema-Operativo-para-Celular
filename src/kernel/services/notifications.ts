import { kernelBus } from '../events'
import { useOSStore } from '../store'
import type { Notification } from '../../types'

const AUTO_CLEAR_MS = 4_000

const pendingTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function onPush(notification: Notification) {
  if (notification.persistent) return
  const handle = setTimeout(() => {
    pendingTimeouts.delete(notification.id)
    useOSStore.getState().clearNotification(notification.id)
  }, AUTO_CLEAR_MS)
  pendingTimeouts.set(notification.id, handle)
}

function onClear({ id }: { id: string }) {
  const handle = pendingTimeouts.get(id)
  if (handle !== undefined) {
    clearTimeout(handle)
    pendingTimeouts.delete(id)
  }
}

function onClearAll() {
  for (const handle of pendingTimeouts.values()) clearTimeout(handle)
  pendingTimeouts.clear()
}

let running = false

export function start() {
  if (running) return
  running = true
  useOSStore.getState().registerDaemon('notifications', 10)
  kernelBus.on('notification:push', onPush)
  kernelBus.on('notification:clear', onClear)
  kernelBus.on('notification:clear-all', onClearAll)
}

export function stop() {
  if (!running) return
  running = false
  kernelBus.off('notification:push', onPush)
  kernelBus.off('notification:clear', onClear)
  kernelBus.off('notification:clear-all', onClearAll)
  onClearAll()
  useOSStore.getState().unregisterDaemon('notifications')
}
