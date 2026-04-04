import { describe, it, expect, beforeEach } from 'vitest'
import { useOSStore } from '../store'
import type { Notification } from '../../types'

// Reset store to initial state before each test
beforeEach(() => {
  useOSStore.setState({
    isLocked: true,
    wallpaper: 'gradient-1',
    brightness: 100,
    volume: 80,
    battery: 85,
    time: new Date(),
    wifiStrength: 4,
    signalStrength: 3,
    darkMode: true,
    accentColor: '#6090FF',
    doNotDisturb: false,
    hapticsEnabled: true,
    focusedAppId: null,
    totalRamUsed: 0,
    processes: [],
    notifications: [],
    currentTrack: null,
  })
})

const mockNotification: Notification = {
  id: 'notif-1',
  appId: 'messages',
  title: 'New Message',
  body: 'Hello there',
  timestamp: Date.now(),
  read: false,
}

describe('lock / unlock', () => {
  it('lock sets isLocked to true', () => {
    useOSStore.getState().unlock()
    useOSStore.getState().lock()
    expect(useOSStore.getState().isLocked).toBe(true)
  })

  it('unlock sets isLocked to false', () => {
    useOSStore.getState().unlock()
    expect(useOSStore.getState().isLocked).toBe(false)
  })
})

describe('openApp', () => {
  it('adds an app process', () => {
    useOSStore.getState().openApp('calculator')
    const appProcesses = useOSStore.getState().processes.filter(p => p.type === 'app')
    expect(appProcesses).toHaveLength(1)
    expect(appProcesses[0].appId).toBe('calculator')
  })

  it('sets focusedAppId', () => {
    useOSStore.getState().openApp('calculator')
    expect(useOSStore.getState().focusedAppId).toBe('calculator')
  })

  it('adds baseRam to totalRamUsed', () => {
    useOSStore.getState().openApp('calculator')
    expect(useOSStore.getState().totalRamUsed).toBe(45)
  })

  it('adds a process entry with correct fields', () => {
    useOSStore.getState().openApp('calculator')
    const proc = useOSStore.getState().processes.find(p => p.appId === 'calculator')
    expect(proc).toBeDefined()
    expect(proc!.type).toBe('app')
    expect(proc!.status).toBe('active')
    expect(proc!.ramUsage).toBe(45)
    expect(proc!.pid).toBe('calculator')
  })

  it('does not add duplicate if already open', () => {
    useOSStore.getState().openApp('calculator')
    useOSStore.getState().openApp('calculator')
    expect(useOSStore.getState().processes.filter(p => p.type === 'app')).toHaveLength(1)
    expect(useOSStore.getState().totalRamUsed).toBe(45)
  })

  it('ignores unknown appId', () => {
    useOSStore.getState().openApp('does-not-exist')
    expect(useOSStore.getState().processes.filter(p => p.type === 'app')).toHaveLength(0)
  })
})

describe('closeApp', () => {
  it('removes app process', () => {
    useOSStore.getState().openApp('calculator')
    useOSStore.getState().closeApp('calculator')
    expect(useOSStore.getState().processes.filter(p => p.type === 'app')).toHaveLength(0)
  })

  it('subtracts baseRam from totalRamUsed', () => {
    useOSStore.getState().openApp('calculator')
    useOSStore.getState().closeApp('calculator')
    expect(useOSStore.getState().totalRamUsed).toBe(0)
  })

  it('sets focusedAppId to null when no apps remain', () => {
    useOSStore.getState().openApp('calculator')
    useOSStore.getState().closeApp('calculator')
    expect(useOSStore.getState().focusedAppId).toBeNull()
  })

  it('focuses previous app when closing the foreground app', () => {
    useOSStore.getState().openApp('calculator')
    useOSStore.getState().openApp('notes')
    useOSStore.getState().closeApp('notes')
    expect(useOSStore.getState().focusedAppId).toBe('calculator')
  })
})

describe('killAllApps', () => {
  it('removes all app processes but keeps daemons', () => {
    useOSStore.getState().registerDaemon('clock', 5)
    useOSStore.getState().openApp('calculator')
    useOSStore.getState().killAllApps()
    const { processes, focusedAppId, totalRamUsed } = useOSStore.getState()
    expect(processes.filter(p => p.type === 'app')).toHaveLength(0)
    expect(processes.filter(p => p.type === 'daemon')).toHaveLength(1)
    expect(focusedAppId).toBeNull()
    expect(totalRamUsed).toBe(5) // daemon RAM remains
  })
})

describe('suspendApp / resumeApp', () => {
  it('suspendApp sets process status to suspended', () => {
    useOSStore.getState().openApp('calculator')
    useOSStore.getState().suspendApp('calculator')
    const proc = useOSStore.getState().processes.find(p => p.appId === 'calculator')
    expect(proc!.status).toBe('suspended')
  })

  it('resumeApp sets process status back to active', () => {
    useOSStore.getState().openApp('calculator')
    useOSStore.getState().suspendApp('calculator')
    useOSStore.getState().resumeApp('calculator')
    const proc = useOSStore.getState().processes.find(p => p.appId === 'calculator')
    expect(proc!.status).toBe('active')
  })
})

describe('swapApp / unswapApp', () => {
  it('swapApp sets status to swapped and frees RAM', () => {
    useOSStore.getState().openApp('calculator')
    useOSStore.getState().swapApp('calculator')
    const proc = useOSStore.getState().processes.find(p => p.appId === 'calculator')
    expect(proc!.status).toBe('swapped')
    expect(proc!.ramUsage).toBe(0)
    expect(useOSStore.getState().totalRamUsed).toBe(0)
  })

  it('unswapApp restores status to active and restores RAM', () => {
    useOSStore.getState().openApp('calculator')
    useOSStore.getState().swapApp('calculator')
    useOSStore.getState().unswapApp('calculator')
    const proc = useOSStore.getState().processes.find(p => p.appId === 'calculator')
    expect(proc!.status).toBe('active')
    expect(proc!.ramUsage).toBe(45)
    expect(useOSStore.getState().totalRamUsed).toBe(45)
  })

  it('openApp on a swapped app restores it instead of creating a new process', () => {
    useOSStore.getState().openApp('calculator')
    useOSStore.getState().swapApp('calculator')
    useOSStore.getState().openApp('calculator')
    expect(useOSStore.getState().processes.filter(p => p.type === 'app')).toHaveLength(1)
    const proc = useOSStore.getState().processes.find(p => p.appId === 'calculator')
    expect(proc!.status).toBe('active')
  })
})

describe('registerDaemon / unregisterDaemon', () => {
  it('registerDaemon adds a daemon process and increases totalRamUsed', () => {
    useOSStore.getState().registerDaemon('clock', 5)
    const daemon = useOSStore.getState().processes.find(p => p.pid === 'clock')
    expect(daemon).toBeDefined()
    expect(daemon!.type).toBe('daemon')
    expect(daemon!.ramUsage).toBe(5)
    expect(useOSStore.getState().totalRamUsed).toBe(5)
  })

  it('registerDaemon ignores duplicates', () => {
    useOSStore.getState().registerDaemon('clock', 5)
    useOSStore.getState().registerDaemon('clock', 5)
    expect(useOSStore.getState().processes.filter(p => p.pid === 'clock')).toHaveLength(1)
  })

  it('unregisterDaemon removes the daemon and decreases totalRamUsed', () => {
    useOSStore.getState().registerDaemon('clock', 5)
    useOSStore.getState().unregisterDaemon('clock')
    expect(useOSStore.getState().processes.find(p => p.pid === 'clock')).toBeUndefined()
    expect(useOSStore.getState().totalRamUsed).toBe(0)
  })
})

describe('updateProcessRam', () => {
  it('updates ramUsage and adjusts totalRamUsed by the diff', () => {
    useOSStore.getState().openApp('calculator')
    useOSStore.getState().updateProcessRam('calculator', 60)
    const proc = useOSStore.getState().processes.find(p => p.appId === 'calculator')
    expect(proc!.ramUsage).toBe(60)
    expect(useOSStore.getState().totalRamUsed).toBe(60)
  })
})

describe('notifications', () => {
  it('pushNotification prepends to notifications array', () => {
    useOSStore.getState().pushNotification(mockNotification)
    expect(useOSStore.getState().notifications[0].id).toBe('notif-1')
  })

  it('clearNotification removes by id', () => {
    useOSStore.getState().pushNotification(mockNotification)
    useOSStore.getState().clearNotification('notif-1')
    expect(useOSStore.getState().notifications).toHaveLength(0)
  })

  it('clearAllNotifications empties the array', () => {
    useOSStore.getState().pushNotification(mockNotification)
    useOSStore.getState().pushNotification({ ...mockNotification, id: 'notif-2' })
    useOSStore.getState().clearAllNotifications()
    expect(useOSStore.getState().notifications).toHaveLength(0)
  })
})

describe('system setters', () => {
  it('setBrightness clamps to 0-100', () => {
    useOSStore.getState().setBrightness(150)
    expect(useOSStore.getState().brightness).toBe(100)
    useOSStore.getState().setBrightness(-10)
    expect(useOSStore.getState().brightness).toBe(0)
  })

  it('setVolume clamps to 0-100', () => {
    useOSStore.getState().setVolume(200)
    expect(useOSStore.getState().volume).toBe(100)
  })

  it('setBattery clamps to 0-100', () => {
    useOSStore.getState().setBattery(-5)
    expect(useOSStore.getState().battery).toBe(0)
  })

  it('setWifiStrength clamps to 0-4', () => {
    useOSStore.getState().setWifiStrength(10)
    expect(useOSStore.getState().wifiStrength).toBe(4)
    useOSStore.getState().setWifiStrength(-1)
    expect(useOSStore.getState().wifiStrength).toBe(0)
  })

  it('setSignalStrength clamps to 0-4', () => {
    useOSStore.getState().setSignalStrength(5)
    expect(useOSStore.getState().signalStrength).toBe(4)
    useOSStore.getState().setSignalStrength(-2)
    expect(useOSStore.getState().signalStrength).toBe(0)
  })

  it('toggleDarkMode flips the flag', () => {
    useOSStore.getState().toggleDarkMode()
    expect(useOSStore.getState().darkMode).toBe(false)
    useOSStore.getState().toggleDarkMode()
    expect(useOSStore.getState().darkMode).toBe(true)
  })

  it('toggleDoNotDisturb flips the flag', () => {
    useOSStore.getState().toggleDoNotDisturb()
    expect(useOSStore.getState().doNotDisturb).toBe(true)
  })

  it('setAccentColor updates accentColor', () => {
    useOSStore.getState().setAccentColor('#FF375F')
    expect(useOSStore.getState().accentColor).toBe('#FF375F')
  })

  it('setWallpaper updates wallpaper', () => {
    useOSStore.getState().setWallpaper('gradient-3')
    expect(useOSStore.getState().wallpaper).toBe('gradient-3')
  })

  it('setCurrentTrack updates currentTrack', () => {
    useOSStore.getState().setCurrentTrack({ title: 'Song', artist: 'Artist' })
    expect(useOSStore.getState().currentTrack?.title).toBe('Song')
    useOSStore.getState().setCurrentTrack(null)
    expect(useOSStore.getState().currentTrack).toBeNull()
  })

  it('toggleHaptics flips hapticsEnabled', () => {
    useOSStore.getState().toggleHaptics()
    expect(useOSStore.getState().hapticsEnabled).toBe(false)
  })
})
