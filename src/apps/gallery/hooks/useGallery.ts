import { useCallback, useEffect, useMemo, useState } from 'react'
import { files } from '../../../kernel/storage'
import { kernelBus } from '../../../kernel/events'
import type { StorageFile } from '../../../types'

export interface GallerySection {
  label: string
  items: StorageFile[]
}

function isMedia(f: StorageFile): boolean {
  return f.type === 'photo' || f.type === 'video'
}

function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function formatDayLabel(dayTs: number, now: number): string {
  const today = startOfDay(now)
  const diffDays = Math.round((today - dayTs) / 86_400_000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  const date = new Date(dayTs)
  const now_ = new Date(now)
  const sameYear = date.getFullYear() === now_.getFullYear()
  return new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  }).format(date)
}

export function useGallery() {
  const [items, setItems] = useState<StorageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [urls, setUrls] = useState<Map<string, string>>(() => new Map())

  const refresh = useCallback(async () => {
    const all = await files.getAll()
    const media = all.filter(isMedia).sort((a, b) => b.createdAt - a.createdAt)
    setItems(media)
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh()
    const onChange = (evt: { kind: StorageFile['type'] }) => {
      if (evt.kind === 'photo' || evt.kind === 'video') void refresh()
    }
    kernelBus.on('files:changed', onChange)
    return () => { kernelBus.off('files:changed', onChange) }
  }, [refresh])

  // Object-URL cache keyed by path. The browser's URL registry is an external
  // system we synchronize to — so setState-in-effect is the right pattern here.
  useEffect(() => {
    const created: Array<[string, string]> = []
    setUrls((prev) => {
      const next = new Map(prev)
      const alive = new Set(items.map((i) => i.path))
      for (const item of items) {
        if (!next.has(item.path)) {
          const u = URL.createObjectURL(item.blob)
          next.set(item.path, u)
          created.push([item.path, u])
        }
      }
      for (const [path, url] of prev) {
        if (!alive.has(path)) {
          URL.revokeObjectURL(url)
          next.delete(path)
        }
      }
      return next
    })
    return () => {
      for (const [, u] of created) URL.revokeObjectURL(u)
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [items])

  const remove = useCallback(async (path: string) => {
    await files.delete(path)
    kernelBus.emit('files:changed', { action: 'delete', path, kind: 'photo' })
    await refresh()
  }, [refresh])

  const download = useCallback((item: StorageFile) => {
    const url = URL.createObjectURL(item.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = item.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    // Revoke on next tick so Safari has time to start the download
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, [])

  const grouped = useMemo<GallerySection[]>(() => {
    if (items.length === 0) return []
    // Ref from items timestamp keeps this pure — labels shift only when data changes.
    const now = items[0].createdAt
    const sections: GallerySection[] = []
    let current: { dayTs: number; items: StorageFile[] } | null = null
    for (const item of items) {
      const day = startOfDay(item.createdAt)
      if (!current || current.dayTs !== day) {
        current = { dayTs: day, items: [] }
        sections.push({ label: formatDayLabel(day, now), items: current.items })
      }
      current.items.push(item)
    }
    return sections
  }, [items])

  return { items, grouped, loading, urls, refresh, remove, download }
}
