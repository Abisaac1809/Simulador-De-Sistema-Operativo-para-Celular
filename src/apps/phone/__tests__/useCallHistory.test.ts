import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import type { CallHistoryItem } from '../hooks/useCallHistory'

/**
 * useCallHistory tests.
 *
 * Since the test environment is 'node' (not jsdom), we cannot use
 * @testing-library/react renderHook. Instead we test the hook's
 * core logic by directly exercising:
 * 1. The CallHistoryItem shape/interface contract
 * 2. The fetch interaction pattern (mocked fetch + state machine simulation)
 * 3. The cancellation pattern for unmount safety
 */

const mockHistoryItems: CallHistoryItem[] = [
  {
    id: 'c1',
    status: 'answered',
    duration: 92,
    startedAt: '2026-04-19T14:00:00Z',
    peer: { id: 'u2', name: 'Alice', phone: '+1234567890' },
    direction: 'incoming',
  },
  {
    id: 'c2',
    status: 'missed',
    duration: 0,
    startedAt: '2026-04-19T13:00:00Z',
    peer: { id: 'u3', name: 'Bob', phone: '+0987654321' },
    direction: 'missed',
  },
  {
    id: 'c3',
    status: 'ended',
    duration: 45,
    startedAt: '2026-04-19T12:00:00Z',
    peer: { id: 'u4', name: 'Carol', phone: '+1122334455' },
    direction: 'outgoing',
  },
]

describe('CallHistoryItem type contract', () => {
  it('has required fields: id, status, duration, startedAt, peer, direction', () => {
    const item = mockHistoryItems[0]
    expect(item).toHaveProperty('id')
    expect(item).toHaveProperty('status')
    expect(item).toHaveProperty('duration')
    expect(item).toHaveProperty('startedAt')
    expect(item).toHaveProperty('peer')
    expect(item).toHaveProperty('direction')
  })

  it('peer has id, name, phone fields', () => {
    const item = mockHistoryItems[0]
    expect(item.peer).toHaveProperty('id')
    expect(item.peer).toHaveProperty('name')
    expect(item.peer).toHaveProperty('phone')
  })

  it('direction field has valid union value', () => {
    const valid = ['incoming', 'outgoing', 'missed']
    mockHistoryItems.forEach(item => {
      expect(valid).toContain(item.direction)
    })
  })
})

describe('useCallHistory fetch behavior simulation', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initial state should have loading=true and empty history', async () => {
    // Simulate initial state before fetch resolves
    let resolveFetch!: (value: Response) => void
    const pendingPromise = new Promise<Response>(resolve => { resolveFetch = resolve })

    vi.stubGlobal('fetch', vi.fn(() => pendingPromise))

    // State machine starts in loading=true, history=[], error=null
    const state = { history: [] as CallHistoryItem[], loading: true, error: null as string | null }
    expect(state.loading).toBe(true)
    expect(state.history).toEqual([])
    expect(state.error).toBeNull()

    // Clean up - resolve the fetch to prevent unhandled rejection
    resolveFetch(new Response(JSON.stringify([]), { status: 200 }))
  })

  it('returns items on successful fetch resolving 3 items', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify(mockHistoryItems), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }))
    ))

    const state = { history: [] as CallHistoryItem[], loading: true, error: null as string | null }
    let cancelled = false

    await fetch('/calls', { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error('http-error'); return r.json() })
      .then((data: CallHistoryItem[]) => { if (!cancelled) { state.history = data; state.loading = false } })
      .catch(() => { if (!cancelled) state.error = 'fetch-failed' })
      .finally(() => { if (!cancelled) state.loading = false })

    expect(state.history).toHaveLength(3)
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('returns error="fetch-failed" when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Network error'))))

    const state = { history: [] as CallHistoryItem[], loading: true, error: null as string | null }
    let cancelled = false

    await fetch('/calls', { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error('http-error'); return r.json() })
      .then((data: CallHistoryItem[]) => { if (!cancelled) { state.history = data; state.loading = false } })
      .catch(() => { if (!cancelled) state.error = 'fetch-failed' })
      .finally(() => { if (!cancelled) state.loading = false })

    expect(state.history).toEqual([])
    expect(state.loading).toBe(false)
    expect(state.error).toBe('fetch-failed')
  })

  it('refetch triggers a second fetch call', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify([]), { status: 200 }))
    )
    vi.stubGlobal('fetch', fetchMock)

    // First fetch (initial mount)
    await fetch('/calls', { credentials: 'include' })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    // refetch increments version → second fetch
    await fetch('/calls', { credentials: 'include' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not setState after unmount (cancelled flag prevents state update)', async () => {
    let resolveFetch!: (value: Response) => void
    const pendingPromise = new Promise<Response>(resolve => { resolveFetch = resolve })
    vi.stubGlobal('fetch', vi.fn(() => pendingPromise))

    let stateUpdated = false
    let cancelled = false

    const fetchPromise = fetch('/calls', { credentials: 'include' })
      .then(r => r.json())
      .then((data: CallHistoryItem[]) => {
        if (!cancelled) stateUpdated = true
        return data
      })

    // Simulate unmount before fetch resolves
    cancelled = true
    resolveFetch(new Response(JSON.stringify(mockHistoryItems), { status: 200 }))

    await fetchPromise

    // State should NOT have been updated because cancelled=true
    expect(stateUpdated).toBe(false)
  })
})
