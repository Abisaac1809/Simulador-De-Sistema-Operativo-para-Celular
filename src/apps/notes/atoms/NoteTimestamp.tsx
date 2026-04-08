import { Typography } from '../../../design'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

interface NoteTimestampProps {
  updatedAt: number
}

export default function NoteTimestamp({ updatedAt }: NoteTimestampProps) {
  const now = Date.now()
  const isToday = now - updatedAt < ONE_DAY_MS
  const label = isToday
    ? new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date(updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })

  return <Typography variant="muted">{label}</Typography>
}
