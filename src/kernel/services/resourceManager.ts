import { useOSStore } from '../store'
import { getApp } from '../registry'
import { kernelBus } from '../events'

const TOTAL_RAM_MB = 1024
const SWAP_THRESHOLD = 0.80  // swap oldest background app when used RAM > 80%
const TICK_MS = 5_000
const DAEMON_RAM = 10

let intervalId: ReturnType<typeof setInterval> | null = null
let running = false

async function tick() {
  const { processes } = useOSStore.getState()

  // Recalculate RAM for each active or suspended app process
  for (const process of processes) {
    if (process.type !== 'app' || (process.status !== 'active' && process.status !== 'suspended')) continue
    const manifest = getApp(process.appId!)
    if (!manifest) continue
    const newRam = manifest.calculateUsedRam
      ? await manifest.calculateUsedRam()
      : manifest.baseRam
    useOSStore.getState().updateProcessRam(process.appId!, newRam)
  }

  // Check memory pressure after recalculation
  checkPressure()
}

function checkPressure() {
  const { totalRamUsed, processes } = useOSStore.getState()
  if (totalRamUsed / TOTAL_RAM_MB <= SWAP_THRESHOLD) return

  // Find the oldest suspended app to evict to swap
  const candidate = processes
    .filter(p => p.type === 'app' && p.status === 'suspended')
    .sort((a, b) => a.startedAt - b.startedAt)[0]

  if (candidate?.appId) {
    useOSStore.getState().swapApp(candidate.appId)
  }
}

function onAppOpen() {
  checkPressure()
}

export function start() {
  if (running) return
  running = true
  useOSStore.getState().registerDaemon('resourceManager', DAEMON_RAM)
  kernelBus.on('app:open', onAppOpen)
  intervalId = setInterval(tick, TICK_MS)
}

export function stop() {
  if (!running) return
  running = false
  kernelBus.off('app:open', onAppOpen)
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
  useOSStore.getState().unregisterDaemon('resourceManager')
}

/** Returns a snapshot of all currently tracked processes. */
export function getProcesses() {
  return useOSStore.getState().processes
}
