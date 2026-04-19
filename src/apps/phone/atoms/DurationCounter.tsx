import { useEffect, useState } from 'react'
import { Typography } from '../../../design'

interface Props {
  startedAt: number
}

/** Formats elapsed seconds into m:ss display string */
export function formatDuration(elapsed: number): string {
  const m = Math.floor(elapsed / 60)
  const s = elapsed % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function DurationCounter({ startedAt }: Props) {
  const [elapsed, setElapsed] = useState(() => Math.floor((Date.now() - startedAt) / 1000))

  useEffect(() => {
    setElapsed(Math.floor((Date.now() - startedAt) / 1000))
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [startedAt])

  return <Typography variant="body">{formatDuration(elapsed)}</Typography>
}
