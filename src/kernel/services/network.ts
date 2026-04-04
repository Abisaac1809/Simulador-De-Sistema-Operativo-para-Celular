import { useOSStore } from '../store'

const TICK_MS = 30_000 // simulate network changes every 30 s

let intervalId: ReturnType<typeof setInterval> | null = null

function tick() {
  const { wifiStrength, signalStrength, setWifiStrength, setSignalStrength } = useOSStore.getState()
  // 30% chance of a ±1 change per tick
  if (Math.random() < 0.3) {
    setWifiStrength(wifiStrength + (Math.random() < 0.5 ? 1 : -1))
  }
  if (Math.random() < 0.3) {
    setSignalStrength(signalStrength + (Math.random() < 0.5 ? 1 : -1))
  }
}

export function start() {
  if (intervalId !== null) return
  useOSStore.getState().registerDaemon('network', 8)
  intervalId = setInterval(tick, TICK_MS)
}

export function stop() {
  if (intervalId === null) return
  clearInterval(intervalId)
  intervalId = null
  useOSStore.getState().unregisterDaemon('network')
}
