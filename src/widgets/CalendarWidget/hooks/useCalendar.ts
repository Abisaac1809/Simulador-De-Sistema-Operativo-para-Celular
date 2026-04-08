import { useMemo } from 'react'

export interface CalendarDay {
  day: number
  isPast: boolean
  isToday: boolean
}

export interface CalendarData {
  monthLabel: string
  weeks: (CalendarDay | null)[][]
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

const DAYS_IN_WEEK  = 7
const MON_OFFSET    = 6   // (Sunday=0 + 6) % 7 = 0 → correct Mon-first offset

function computeCalendar(now: Date): CalendarData {
  const year  = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()

  const monthLabel = `${MONTH_NAMES[month]} ${year}`

  // Mon-first offset: JS getDay() returns 0=Sun, 1=Mon...
  const firstDayJS = new Date(year, month, 1).getDay()
  const offset     = (firstDayJS + MON_OFFSET) % DAYS_IN_WEEK

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const flat: (CalendarDay | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      return { day, isPast: day < today, isToday: day === today }
    }),
  ]

  // Pad to full weeks
  while (flat.length % DAYS_IN_WEEK !== 0) flat.push(null)

  const weeks: (CalendarDay | null)[][] = []
  for (let i = 0; i < flat.length; i += DAYS_IN_WEEK) {
    weeks.push(flat.slice(i, i + DAYS_IN_WEEK))
  }

  return { monthLabel, weeks }
}

export function useCalendar(): CalendarData {
  return useMemo(() => computeCalendar(new Date()), [])
}
