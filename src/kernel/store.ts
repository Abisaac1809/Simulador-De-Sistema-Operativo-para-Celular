import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Draft } from 'immer'
import type { OSData, OSState, Notification, Process } from '../types'
import { kernelBus } from './events'
import { getApp } from './registry'

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const noopStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }

const safeStorage = typeof localStorage !== 'undefined'
  ? createJSONStorage(() => localStorage)
  : createJSONStorage(() => noopStorage)

type DraftProcess = Draft<Process>

const suspendProcess = (processes: DraftProcess[], appId: string): void => {
  const process = processes.find(p => p.appId === appId && p.status === 'active')
  if (process) process.status = 'suspended'
}

const activateProcess = (processes: DraftProcess[], appId: string): void => {
  const process = processes.find(p => p.appId === appId)
  if (process) process.status = 'active'
}

const findNextApp = (processes: Process[]): Process | null =>
  [...processes].reverse().find(
    p => p.type === 'app' && p.status !== 'killed' && p.status !== 'swapped'
  ) ?? null

const INITIAL_STATE: OSData = {
  isLocked: true,
  wallpaper: 'gradient-1',
  brightness: 100,
  volume: 80,
  battery: 85,
  isCharging: false,
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
}

export const useOSStore = create<OSState>()(
  immer(
    persist(
      (set, get) => ({
        ...INITIAL_STATE,

        lock: () => {
          set({ isLocked: true })
          kernelBus.emit('system:lock')
        },

        unlock: () => {
          set({ isLocked: false })
          kernelBus.emit('system:unlock')
        },

        setBrightness: (value: number) => {
          const clamped = clamp(value, 0, 100)
          set({ brightness: clamped })
          kernelBus.emit('system:brightness', { value: clamped })
        },

        setVolume: (value: number) => {
          const clamped = clamp(value, 0, 100)
          set({ volume: clamped })
          kernelBus.emit('system:volume', { value: clamped })
        },

        setBattery: (value: number) => set({ battery: clamp(value, 0, 100) }),
        setIsCharging: (charging: boolean) => set({ isCharging: charging }),
        setTime: (time: Date) => set({ time }),
        setWallpaper: (wallpaper: string) => set({ wallpaper }),
        setAccentColor: (color: string) => set({ accentColor: color }),
        setWifiStrength: (value: number) => set({ wifiStrength: clamp(value, 0, 4) }),
        setSignalStrength: (value: number) => set({ signalStrength: clamp(value, 0, 4) }),
        toggleDarkMode: () => set(state => { state.darkMode = !state.darkMode }),
        toggleDoNotDisturb: () => set(state => { state.doNotDisturb = !state.doNotDisturb }),
        toggleHaptics: () => set(state => { state.hapticsEnabled = !state.hapticsEnabled }),

        openApp: (appId: string) => {
          const app = getApp(appId)
          if (!app) return

          const { focusedAppId, processes, totalRamUsed } = get()

          if (focusedAppId && focusedAppId !== appId) {
            set(state => { suspendProcess(state.processes, focusedAppId) })
          }

          const existing = processes.find(p => p.appId === appId)

          if (existing?.status === 'swapped') {
            set(state => {
              const process = state.processes.find(p => p.appId === appId)
              if (process) {
                process.status = 'active'
                process.ramUsage = app.baseRam
              }
              state.totalRamUsed = totalRamUsed + app.baseRam
              state.focusedAppId = appId
            })
            kernelBus.emit('app:focus', { appId })
            return
          }

          if (existing) {
            set(state => {
              activateProcess(state.processes, appId)
              state.focusedAppId = appId
            })
            kernelBus.emit('app:focus', { appId })
            return
          }

          const newProcess: Process = {
            pid: appId,
            type: 'app',
            name: app.name,
            appId,
            ramUsage: app.baseRam,
            status: 'active',
            startedAt: Date.now(),
          }
          set(state => {
            state.processes.push(newProcess)
            state.focusedAppId = appId
            state.totalRamUsed = totalRamUsed + app.baseRam
          })
          kernelBus.emit('app:open', app)
        },

        closeApp: (appId: string) => {
          const { processes, totalRamUsed } = get()
          const target = processes.find(p => p.appId === appId)
          const remaining = processes.filter(p => p.appId !== appId)
          const nextApp = findNextApp(remaining)

          set(state => {
            state.processes = state.processes.filter(p => p.appId !== appId) as Draft<Process>[]
            if (nextApp) activateProcess(state.processes, nextApp.appId!)
            state.focusedAppId = nextApp?.appId ?? null
            state.totalRamUsed = totalRamUsed - (target?.ramUsage ?? 0)
          })
          kernelBus.emit('app:close', { appId })
        },

        focusApp: (appId: string) => {
          const { focusedAppId } = get()
          set(state => {
            if (focusedAppId && focusedAppId !== appId) {
              suspendProcess(state.processes, focusedAppId)
            }
            activateProcess(state.processes, appId)
            state.focusedAppId = appId
          })
          kernelBus.emit('app:focus', { appId })
        },

        suspendApp: (appId: string) => {
          set(state => { suspendProcess(state.processes, appId) })
        },

        resumeApp: (appId: string) => {
          set(state => { activateProcess(state.processes, appId) })
        },

        killAllApps: () => {
          set(state => {
            const daemons = state.processes.filter(p => p.type === 'daemon')
            state.totalRamUsed = daemons.reduce((sum, p) => sum + p.ramUsage, 0)
            state.processes = daemons
            state.focusedAppId = null
          })
          kernelBus.emit('app:kill-all')
        },

        swapApp: (appId: string) => {
          set(state => {
            const process = state.processes.find(p => p.appId === appId)
            if (process) {
              state.totalRamUsed -= process.ramUsage
              process.status = 'swapped'
              process.ramUsage = 0
            }
          })
        },

        unswapApp: (appId: string) => {
          const app = getApp(appId)
          if (!app) return
          set(state => {
            const process = state.processes.find(p => p.appId === appId)
            if (process) {
              process.status = 'active'
              process.ramUsage = app.baseRam
              state.totalRamUsed += app.baseRam
            }
          })
        },

        registerDaemon: (name: string, ramUsage: number) => {
          set(state => {
            if (state.processes.some(p => p.pid === name)) return
            const daemon: Process = {
              pid: name,
              type: 'daemon',
              name,
              ramUsage,
              status: 'active',
              startedAt: Date.now(),
            }
            state.processes.push(daemon)
            state.totalRamUsed += ramUsage
          })
        },

        unregisterDaemon: (name: string) => {
          set(state => {
            const index = state.processes.findIndex(p => p.pid === name)
            if (index !== -1) {
              state.totalRamUsed -= state.processes[index].ramUsage
              state.processes.splice(index, 1)
            }
          })
        },

        updateProcessRam: (appId: string, ramUsage: number) => {
          set(state => {
            const process = state.processes.find(p => p.appId === appId)
            if (process) {
              state.totalRamUsed += ramUsage - process.ramUsage
              process.ramUsage = ramUsage
            }
          })
        },

        pushNotification: (notification: Notification) => {
          set(state => { state.notifications.unshift(notification) })
          kernelBus.emit('notification:push', notification)
        },

        clearNotification: (id: string) => {
          set(state => {
            const index = state.notifications.findIndex(n => n.id === id)
            if (index !== -1) state.notifications.splice(index, 1)
          })
          kernelBus.emit('notification:clear', { id })
        },

        clearAllNotifications: () => {
          set(state => { state.notifications = [] })
          kernelBus.emit('notification:clear-all', undefined)
        },

        setCurrentTrack: (track) => set(state => { state.currentTrack = track }),
      }),
      {
        name: 'nova-os-settings',
        storage: safeStorage,
        partialize: (state) => ({
          darkMode: state.darkMode,
          volume: state.volume,
          brightness: state.brightness,
          wallpaper: state.wallpaper,
          accentColor: state.accentColor,
          doNotDisturb: state.doNotDisturb,
          hapticsEnabled: state.hapticsEnabled,
        }),
      }
    )
  )
)
