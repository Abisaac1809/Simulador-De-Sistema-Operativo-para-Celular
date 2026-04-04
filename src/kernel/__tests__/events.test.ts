import { describe, it, expect, vi } from 'vitest'
import { kernelBus } from '../events'

describe('kernelBus', () => {
  it('listener receives the correct payload on emit', () => {
    const handler = vi.fn()
    kernelBus.on('system:lock', handler)
    kernelBus.emit('system:lock')
    expect(handler).toHaveBeenCalledOnce()
    kernelBus.off('system:lock', handler)
  })

  it('app:open delivers the app manifest to the listener', () => {
    const handler = vi.fn()
    kernelBus.on('app:open', handler)
    const manifest = { id: 'calc', name: 'Calculator' } as never
    kernelBus.emit('app:open', manifest)
    expect(handler).toHaveBeenCalledWith(manifest)
    kernelBus.off('app:open', handler)
  })

  it('notification:push delivers the notification payload', () => {
    const handler = vi.fn()
    kernelBus.on('notification:push', handler)
    const notif = { id: 'n1', appId: 'messages', title: 'Hi', body: '', timestamp: 0, read: false }
    kernelBus.emit('notification:push', notif)
    expect(handler).toHaveBeenCalledWith(notif)
    kernelBus.off('notification:push', handler)
  })

  it('off removes the listener — no longer called after removal', () => {
    const handler = vi.fn()
    kernelBus.on('system:unlock', handler)
    kernelBus.off('system:unlock', handler)
    kernelBus.emit('system:unlock')
    expect(handler).not.toHaveBeenCalled()
  })
})
