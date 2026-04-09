import { lazy } from 'react'
import type { AppManifest, AppCategory } from '../types'
import { contacts, messages, callLog, notes, files, audioTracks } from './storage'

const registry: AppManifest[] = [
  {
    id: 'settings',
    name: 'Settings',
    icon: 'fi fi-rr-settings',
    color: '#8E8E93',
    component: lazy(() => import('../apps/settings/index')),
    category: 'system',
    isPinned: false,
    baseRam: 30,
  },
  {
    id: 'phone',
    name: 'Phone',
    icon: 'fi fi-rr-phone-call',
    color: '#34C759',
    component: lazy(() => import('../apps/phone/index')),
    category: 'communication',
    isPinned: true,
    baseRam: 60,
    calculateUsedRam: async () => {
      const records = await callLog.getAll()
      return 60 + records.length * 0.1
    },
  },
  {
    id: 'messages',
    name: 'Messages',
    icon: 'fi fi-rr-comment-alt',
    color: '#A060FF',
    component: lazy(() => import('../apps/messages/index')),
    category: 'communication',
    isPinned: true,
    baseRam: 75,
    calculateUsedRam: async () => {
      const msgs = await messages.getAll()
      return 75 + msgs.length * 0.5
    },
  },
  {
    id: 'contacts',
    name: 'Contacts',
    icon: 'fi fi-rr-users',
    color: '#FF9500',
    component: lazy(() => import('../apps/contacts/index')),
    category: 'communication',
    isPinned: false,
    baseRam: 50,
    calculateUsedRam: async () => {
      const all = await contacts.getAll()
      return 50 + all.length * 0.2
    },
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: 'fi fi-rr-globe',
    color: '#5E6AD2',
    component: lazy(() => import('../apps/browser/index')),
    category: 'utility',
    isPinned: true,
    baseRam: 180,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: 'fi fi-rr-calculator',
    color: '#6090FF',
    component: lazy(() => import('../apps/calculator/index')),
    category: 'utility',
    isPinned: false,
    baseRam: 45,
  },
  {
    id: 'clock',
    name: 'Clock',
    icon: 'fi fi-rr-clock-three',
    color: '#FF9F0A',
    component: lazy(() => import('../apps/clock/index')),
    category: 'utility',
    isPinned: false,
    baseRam: 20,
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: 'fi fi-rr-document',
    color: '#FFD60A',
    component: lazy(() => import('../apps/notes/index')),
    category: 'utility',
    isPinned: false,
    baseRam: 35,
    calculateUsedRam: async () => {
      const all = await notes.getAll()
      const bodyKb = all.reduce((acc, n) => acc + n.body.length / 1024, 0)
      return 35 + bodyKb
    },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: 'fi fi-rr-terminal',
    color: '#32D74B',
    component: lazy(() => import('../apps/terminal/index')),
    category: 'utility',
    isPinned: false,
    baseRam: 25,
  },
  {
    id: 'weather',
    name: 'Weather',
    icon: 'fi fi-rr-cloud-sun',
    color: '#64D2FF',
    component: lazy(() => import('../apps/weather/index')),
    category: 'utility',
    isPinned: false,
    baseRam: 40,
  },
  {
    id: 'camera',
    name: 'Camera',
    icon: 'fi fi-rr-camera',
    color: '#FF60A0',
    component: lazy(() => import('../apps/camera/index')),
    category: 'media',
    isPinned: true,
    baseRam: 120,
  },
  {
    id: 'gallery',
    name: 'Gallery',
    icon: 'fi fi-rr-picture',
    color: '#BF5AF2',
    component: lazy(() => import('../apps/gallery/index')),
    category: 'media',
    isPinned: false,
    baseRam: 90,
    calculateUsedRam: async () => {
      const all = await files.getAll()
      const images = all.filter(f => f.mimeType.startsWith('image/'))
      return 90 + images.length * 5
    },
  },
  {
    id: 'music',
    name: 'Music',
    icon: 'fi fi-rr-music-alt',
    color: '#FF375F',
    component: lazy(() => import('../apps/music/index')),
    category: 'media',
    isPinned: false,
    baseRam: 65,
    calculateUsedRam: async () => {
      const tracks = await audioTracks.getAll()
      return 65 + tracks.length * 8
    },
  },
]

export function getApp(id: string): AppManifest | undefined {
  return registry.find(app => app.id === id)
}

export function getAllApps(): AppManifest[] {
  return registry
}

export function getAppsByCategory(category: AppCategory): AppManifest[] {
  return registry.filter(app => app.category === category)
}

export function getPinnedApps(): AppManifest[] {
  return registry.filter(app => app.isPinned)
}

export function registerApp(app: AppManifest): void {
  if (registry.some(a => a.id === app.id)) return
  registry.push(app)
}

export function unregisterApp(id: string): void {
  const index = registry.findIndex(a => a.id === id)
  if (index !== -1) registry.splice(index, 1)
}
