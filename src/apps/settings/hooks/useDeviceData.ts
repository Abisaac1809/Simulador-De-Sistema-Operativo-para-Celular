import { useState, useEffect } from 'react'
import { useOSStore } from '../../../kernel/store'
import { getStorageStats, type StorageStats } from '../../../kernel/storage'

const TOTAL_RAM_MB = 1024

export function useDeviceData() {
  const battery = useOSStore(s => s.battery)
  const isCharging = useOSStore(s => s.isCharging)
  const wifiStrength = useOSStore(s => s.wifiStrength)
  const signalStrength = useOSStore(s => s.signalStrength)
  const totalRamUsed = useOSStore(s => s.totalRamUsed)
  const processes = useOSStore(s => s.processes)

  const [storageStats, setStorageStats] = useState<StorageStats | null>(null)

  useEffect(() => {
    getStorageStats().then(setStorageStats)
  }, [])

  const activeProcesses = processes.filter(p => p.status === 'active').length
  const totalProcesses = processes.length
  const ramPercent = Math.round((totalRamUsed / TOTAL_RAM_MB) * 100)

  return {
    battery,
    isCharging,
    wifiStrength,
    signalStrength,
    totalRamUsed,
    totalRamMb: TOTAL_RAM_MB,
    ramPercent,
    activeProcesses,
    totalProcesses,
    storageStats,
  }
}
