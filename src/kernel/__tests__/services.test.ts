import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useOSStore } from '../store'

beforeEach(() => {
  useOSStore.setState({ time: new Date('2025-01-01T00:00:00'), isLocked: false })
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('clock service', () => {
  it('updates store time every second after start()', async () => {
    const { start, stop } = await import('../services/clock')
    start()
    vi.advanceTimersByTime(1000)
    const t1 = useOSStore.getState().time
    vi.advanceTimersByTime(1000)
    const t2 = useOSStore.getState().time
    expect(t2.getTime()).toBeGreaterThan(t1.getTime())
    stop()
  })

  it('stops updating time after stop()', async () => {
    const { start, stop } = await import('../services/clock')
    start()
    stop()
    const before = useOSStore.getState().time
    vi.advanceTimersByTime(3000)
    const after = useOSStore.getState().time
    expect(after).toBe(before)
  })
})

describe('notifications service', () => {
  it('auto-clears a notification after 4 seconds', async () => {
    const { start, stop } = await import('../services/notifications')
    const { kernelBus } = await import('../events')
    start()

    const notif = { id: 'auto-1', appId: 'test', title: 'T', body: '', timestamp: Date.now(), read: false }
    useOSStore.getState().pushNotification(notif)
    kernelBus.emit('notification:push', notif)

    expect(useOSStore.getState().notifications).toHaveLength(1)
    vi.advanceTimersByTime(4000)
    expect(useOSStore.getState().notifications).toHaveLength(0)
    stop()
  })
})
