import type { CSSProperties } from 'react'
import { GlassCard, Typography, colors, spacing } from '../../design'
import { useClockTime } from './hooks/useClockTime'
import ClockFace from './atoms/ClockFace'
import ClockHand from './atoms/ClockHand'

const WIDGET_HEIGHT  = 180
const HAND_HOUR_LEN  = 40
const HAND_MIN_LEN   = 55
const HAND_SEC_LEN   = 60
const HAND_HOUR_W    = 4
const HAND_MIN_W     = 3
const HAND_SEC_W     = 1.5
const CENTER_DOT_R   = 4

const CARD_STYLE: CSSProperties = {
  height: WIDGET_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing[2],
  gap: spacing[1],
  boxSizing: 'border-box',
}

const SVG_WRAPPER_STYLE: CSSProperties = {
  flex: 1,
  width: '100%',
  overflow: 'hidden',
}

const DATE_STYLE: CSSProperties = {
  flexShrink: 0,
}

function formatDate(date: Date): string {
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function AnalogClock() {
  const { hourAngle, minuteAngle, secondAngle } = useClockTime()
  const dateLabel = formatDate(new Date())

  return (
    <GlassCard style={CARD_STYLE}>
      <div style={SVG_WRAPPER_STYLE}>
        <svg
          viewBox="0 0 160 160"
          width="100%"
          height="100%"
          aria-label="Analog clock"
        >
          <ClockFace />
          <ClockHand angle={hourAngle}   length={HAND_HOUR_LEN} strokeWidth={HAND_HOUR_W} color={colors.textPrimary} />
          <ClockHand angle={minuteAngle} length={HAND_MIN_LEN}  strokeWidth={HAND_MIN_W}  color={colors.textPrimary} />
          <ClockHand angle={secondAngle} length={HAND_SEC_LEN}  strokeWidth={HAND_SEC_W}  color={colors.accentBlue} />
          {/* Center dot rendered on top of hands */}
          <circle cx={80} cy={80} r={CENTER_DOT_R} fill={colors.textPrimary} />
        </svg>
      </div>
      <div style={DATE_STYLE}>
        <Typography variant="caption">{dateLabel}</Typography>
      </div>
    </GlassCard>
  )
}
