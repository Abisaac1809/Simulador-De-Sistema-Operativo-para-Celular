import { useState, useEffect } from 'react'

const INTERVAL_MS   = 1000
const FULL_CIRCLE   = 360
const HOURS_ON_FACE = 12
const MINS_PER_HOUR = 60
const SECS_PER_MIN  = 60
const DEGS_PER_HOUR = FULL_CIRCLE / HOURS_ON_FACE  // 30
const DEGS_PER_MIN  = FULL_CIRCLE / MINS_PER_HOUR  // 6
const DEGS_PER_SEC  = FULL_CIRCLE / SECS_PER_MIN   // 6

function computeAngles(date: Date) {
  const h = date.getHours() % HOURS_ON_FACE
  const m = date.getMinutes()
  const s = date.getSeconds()
  return {
    hourAngle:   h * DEGS_PER_HOUR + (m / MINS_PER_HOUR) * DEGS_PER_HOUR,
    minuteAngle: m * DEGS_PER_MIN  + (s / SECS_PER_MIN)  * DEGS_PER_MIN,
    secondAngle: s * DEGS_PER_SEC,
  }
}

export function useClockTime() {
  const [angles, setAngles] = useState(() => computeAngles(new Date()))

  useEffect(() => {
    const id = setInterval(() => setAngles(computeAngles(new Date())), INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return angles
}
