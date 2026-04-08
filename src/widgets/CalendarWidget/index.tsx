import { type CSSProperties } from 'react'
import { GlassCard, Typography } from '../../design'
import { colors, spacing, font } from '../../design'
import { useCalendar } from './hooks/useCalendar'
import DayCell from './atoms/DayCell'
import WeekdayHeader from './atoms/WeekdayHeader'

const WIDGET_HEIGHT  = 180
const GRID_COLUMNS   = 7
const ROW_GAP        = 2

const CARD_STYLE: CSSProperties = {
  height: WIDGET_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  padding: spacing[2],
  gap: spacing[1],
  boxSizing: 'border-box',
  overflow: 'hidden',
}

const HEADER_STYLE: CSSProperties = {
  flexShrink: 0,
  textAlign: 'center',
}

const DAY_GRID_STYLE: CSSProperties = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`,
  alignItems: 'center',
  justifyItems: 'center',
  rowGap: ROW_GAP,
  overflow: 'hidden',
}

export default function CalendarWidget() {
  const { monthLabel, weeks } = useCalendar()

  return (
    <GlassCard style={CARD_STYLE}>
      <div style={HEADER_STYLE}>
        <Typography
          variant="caption"
          style={{ fontWeight: font.weight.semibold, color: colors.textPrimary }}
        >
          {monthLabel}
        </Typography>
      </div>
      <div style={DAY_GRID_STYLE}>
        <WeekdayHeader />
        {weeks.flatMap((week, wi) =>
          week.map((day, di) => (
            <DayCell key={`${wi}-${di}`} day={day} />
          ))
        )}
      </div>
    </GlassCard>
  )
}
