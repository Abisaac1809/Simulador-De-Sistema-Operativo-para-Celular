import { useState, useRef } from 'react'

const TICK_MS = 10

export function formatElapsed(ms: number): string {
  const centis = Math.floor((ms % 1000) / 10).toString().padStart(2, '0')
  const secs   = Math.floor((ms / 1000) % 60).toString().padStart(2, '0')
  const mins   = Math.floor(ms / 60000).toString().padStart(2, '0')
  return `${mins}:${secs}.${centis}`
}

export function useStopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef(0)

  function start() {
    startTimeRef.current = Date.now() - elapsed
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current)
    }, TICK_MS)
  }

  function stop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }

  function lap() {
    setElapsed(current => {
      setLaps(prev => [...prev, current])
      return current
    })
  }

  function reset() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
    setElapsed(0)
    setLaps([])
  }

  return { elapsed, running, laps, start, stop, lap, reset, formatElapsed }
}
