import { type CSSProperties } from 'react'
import { type CalendarDay } from '../hooks/useCalendar'
import { colors, radius, font } from '../../../design'

const CELL_SIZE      = 20
const TODAY_FONT_W   = font.weight.semibold
const REGULAR_FONT_W = font.weight.regular
const DAY_FONT_SIZE  = 10

const CELL_BASE: CSSProperties = {
  width: CELL_SIZE,
  height: CELL_SIZE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: radius.pill,
  fontSize: DAY_FONT_SIZE,
  fontFamily: font.sans,
  lineHeight: 1,
  flexShrink: 0,
}

const CELL_TODAY: CSSProperties = {
  ...CELL_BASE,
  background: colors.accentBlue,
}

interface DayCellProps {
  day: CalendarDay | null
}

export default function DayCell({ day }: DayCellProps) {
  if (!day) return <div style={CELL_BASE} />

  if (day.isToday) {
    return (
      <div style={CELL_TODAY}>
        <span style={{ color: colors.textPrimary, fontWeight: TODAY_FONT_W, fontSize: DAY_FONT_SIZE }}>
          {day.day}
        </span>
      </div>
    )
  }

  return (
    <div style={CELL_BASE}>
      <span style={{
        color: day.isPast ? colors.textMuted : colors.textSecondary,
        fontWeight: REGULAR_FONT_W,
        fontSize: DAY_FONT_SIZE,
      }}>
        {day.day}
      </span>
    </div>
  )
}
