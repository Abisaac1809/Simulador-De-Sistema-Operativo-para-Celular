import { useOSStore } from '../store'

interface BatteryManager extends EventTarget {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
  onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
}

const SIMULATED_BATTERY = 100

let started = false
let batteryRef: BatteryManager | null = null
let levelHandler: (() => void) | null = null

async function syncBattery() {
  try {
    const battery = await (navigator as any).getBattery() as BatteryManager;
    batteryRef = battery;
  
    battery.addEventListener('levelchange', () => {
      useOSStore.getState().setBattery(Math.round(battery.level * 100))
    })

    battery.addEventListener('chargingchange', () => {
      useOSStore.getState().setIsCharging(battery.charging);
    })
  } catch {
    useOSStore.getState().setBattery(SIMULATED_BATTERY)
  }
}

export function start() {
  if (started) return
  started = true
  useOSStore.getState().registerDaemon('battery', 5)
  syncBattery()
}

export function stop() {
  if (!started) return
  if (batteryRef) {
    batteryRef.removeEventListener('levelchange', levelHandler)
  }
  batteryRef = null
  levelHandler = null
  started = false
  useOSStore.getState().unregisterDaemon('battery')
}
