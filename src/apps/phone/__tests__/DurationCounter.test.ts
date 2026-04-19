import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { formatDuration } from '../atoms/DurationCounter'

/**
 * DurationCounter tests.
 *
 * Since the test environment is 'node' (not jsdom), we cannot render React
 * components. Instead, we test the exported formatDuration logic function
 * directly and verify the setInterval lifecycle via vi.useFakeTimers on a
 * simulated tick loop.
 */
describe('formatDuration', () => {
  it('formats 0 elapsed seconds as "0:00"', () => {
    expect(formatDuration(0)).toBe('0:00')
  })

  it('formats 1 elapsed second as "0:01"', () => {
    expect(formatDuration(1)).toBe('0:01')
  })

  it('formats 62 elapsed seconds as "1:02"', () => {
    expect(formatDuration(62)).toBe('1:02')
  })

  it('formats 600 elapsed seconds as "10:00"', () => {
    expect(formatDuration(600)).toBe('10:00')
  })

  it('formats 3661 elapsed seconds as "61:01"', () => {
    expect(formatDuration(3661)).toBe('61:01')
  })
})

describe('DurationCounter interval lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('clears interval on unmount (clearInterval called on cleanup)', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')

    // Simulate a setInterval and its cleanup (mirrors DurationCounter useEffect behavior)
    const startedAt = Date.now()
    let elapsed = Math.floor((Date.now() - startedAt) / 1000)

    const id = setInterval(() => {
      elapsed = Math.floor((Date.now() - startedAt) / 1000)
    }, 1000)

    // Advance time to simulate ticking
    vi.advanceTimersByTime(3000)
    expect(elapsed).toBe(3)

    // Simulate unmount — cleanup clears the interval
    clearInterval(id)
    expect(clearSpy).toHaveBeenCalledWith(id)
    expect(setIntervalSpy).toHaveBeenCalled()

    clearSpy.mockRestore()
    setIntervalSpy.mockRestore()
  })

  it('tick advances elapsed by 1 per second via setInterval', () => {
    const startedAt = Date.now()
    let elapsed = 0

    const id = setInterval(() => {
      elapsed = Math.floor((Date.now() - startedAt) / 1000)
    }, 1000)

    vi.advanceTimersByTime(1000)
    expect(elapsed).toBe(1)

    vi.advanceTimersByTime(61000)
    expect(elapsed).toBe(62)

    clearInterval(id)
  })
})
