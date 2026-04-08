import { useState, useRef } from 'react'

const TICK_MS = 1000
const MAX_MINUTES = 99
const MAX_SECONDS = 59

export function formatRemaining(ms: number): string {
  const totalSecs = Math.ceil(ms / 1000)
  const m = Math.floor(totalSecs / 60).toString().padStart(2, '0')
  const s = (totalSecs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function useTimer() {
  const [minutes, setMinutesState] = useState(0)
  const [seconds, setSecondsState] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function setMinutes(n: number) {
    if (!running) setMinutesState(Math.min(n, MAX_MINUTES))
  }

  function setSeconds(n: number) {
    if (!running) setSecondsState(Math.min(n, MAX_SECONDS))
  }

  function start() {
    const startMs = remaining > 0 ? remaining : minutes * 60000 + seconds * 1000
    if (startMs <= 0) return
    setRemaining(startMs)
    setRunning(true)
    let current = startMs
    intervalRef.current = setInterval(() => {
      current -= TICK_MS
      if (current <= 0) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        setRemaining(0)
        setRunning(false)
        setDone(true)
      } else {
        setRemaining(current)
      }
    }, TICK_MS)
  }

  function pause() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }

  function reset() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
    setRemaining(0)
    setDone(false)
    setMinutesState(0)
    setSecondsState(0)
  }

  function dismissDone() {
    reset()
  }

  return { minutes, seconds, remaining, running, done, setMinutes, setSeconds, start, pause, reset, dismissDone, formatRemaining }
}
