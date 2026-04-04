import type React from 'react'

// ─── App Registry ────────────────────────────────────────────────────────────

export type AppCategory = 'system' | 'communication' | 'utility' | 'media'

export interface AppManifest {
  id: string
  name: string
  icon: string // emoji or SVG path
  color: string // hex color for IconWrapper tint
  component: React.LazyExoticComponent<React.ComponentType>
  category: AppCategory
  isPinned: boolean
  baseRam: number // simulated MB baseline
  calculateUsedRam?: () => Promise<number> // dynamic RAM; falls back to baseRam
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  appId: string
  title: string
  body: string
  timestamp: number // Unix ms
  read: boolean
  persistent?: boolean // if true, auto-clear is skipped
}

// ─── Contacts ─────────────────────────────────────────────────────────────────

export interface Contact {
  id: string
  name: string
  phone: string
  email: string
  avatar?: string
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export type MessageDirection = 'sent' | 'received'

export interface Message {
  id: string
  contactId: string
  text: string
  timestamp: number // Unix ms
  direction: MessageDirection
  read: boolean
}

// ─── Call Records ─────────────────────────────────────────────────────────────

export type CallType = 'outgoing' | 'incoming' | 'missed'

export interface CallRecord {
  id: string
  contactId: string
  type: CallType
  duration: number // seconds
  timestamp: number // Unix ms
}

// ─── Storage ──────────────────────────────────────────────────────────────────

export interface StorageFile {
  path: string
  name: string
  mimeType: string
  blob: Blob
  createdAt: number // Unix ms
  updatedAt: number // Unix ms
}

// ─── Process / Resource Management ───────────────────────────────────────────

export type ProcessType = 'app' | 'daemon'
export type ProcessStatus = 'active' | 'suspended' | 'swapped' | 'killed'

export interface Process {
  pid: string          // appId for apps, service name for daemons
  type: ProcessType
  name: string         // display name
  appId?: string       // only present for app processes
  ramUsage: number     // simulated MB; 0 when swapped
  status: ProcessStatus
  startedAt: number    // Unix ms
}

// ─── OS State (Zustand store contract) ───────────────────────────────────────

export interface OSData {
  // ── System state ──
  isLocked: boolean
  wallpaper: string
  brightness: number // 0–100
  volume: number // 0–100
  battery: number // 0–100
  isCharging: boolean
  time: Date
  wifiStrength: number // 0–4
  signalStrength: number // 0–4
  darkMode: boolean
  accentColor: string // hex
  doNotDisturb: boolean
  hapticsEnabled: boolean

  // ── App / window state ──
  focusedAppId: string | null
  totalRamUsed: number // simulated MB
  processes: Process[]

  // ── Notifications ──
  notifications: Notification[]

  // ── Media ──
  currentTrack: { title: string; artist: string } | null
}

export interface OSActions {
  lock: () => void
  unlock: () => void
  openApp: (appId: string) => void
  closeApp: (appId: string) => void
  focusApp: (appId: string) => void
  killAllApps: () => void
  suspendApp: (appId: string) => void
  resumeApp: (appId: string) => void
  swapApp: (appId: string) => void
  unswapApp: (appId: string) => void
  registerDaemon: (name: string, ramUsage: number) => void
  unregisterDaemon: (name: string) => void
  updateProcessRam: (appId: string, ramUsage: number) => void
  pushNotification: (notification: Notification) => void
  clearNotification: (id: string) => void
  clearAllNotifications: () => void
  setBrightness: (value: number) => void
  setVolume: (value: number) => void
  toggleDarkMode: () => void
  setBattery: (value: number) => void
  setIsCharging: (charging: boolean) => void
  setTime: (time: Date) => void
  setAccentColor: (color: string) => void
  toggleDoNotDisturb: () => void
  setWallpaper: (wallpaper: string) => void
  setCurrentTrack: (track: { title: string; artist: string } | null) => void
  toggleHaptics: () => void
  setWifiStrength: (value: number) => void
  setSignalStrength: (value: number) => void
}

export type OSState = OSData & OSActions

// ─── Kernel Event Bus (Mitt event map) ───────────────────────────────────────

export type SoundType =
  | 'keypress'
  | 'lock'
  | 'unlock'
  | 'notification'
  | 'ringtone'
  | 'shutter'
  | 'message-sent'

export type KernelEventMap = {
  'app:open': AppManifest
  'app:close': { appId: string }
  'app:focus': { appId: string }
  'app:kill-all': void
  'system:lock': void
  'system:unlock': void
  'notification:push': Notification
  'notification:clear': { id: string }
  'notification:clear-all': void
  'system:sound': { type: SoundType }
  'system:brightness': { value: number }
  'system:volume': { value: number }
  'call:incoming': { contactId: string }
  'call:end': void
  'message:received': Message
}
