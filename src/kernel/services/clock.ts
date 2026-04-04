import { useOSStore } from '../store'

const DAEMON_RAM = 5

let timeoutId: number | null = null

function tick() {
  useOSStore.getState().setTime(new Date())
  timeoutId = setTimeout(tick, 1000)
}

export function start() {
  if (timeoutId !== null) return
  useOSStore.getState().registerDaemon('clock', DAEMON_RAM)
  tick()
}

export function stop() {
  if (timeoutId === null) return
  clearTimeout(timeoutId)
  timeoutId = null
  useOSStore.getState().unregisterDaemon('clock')
}
