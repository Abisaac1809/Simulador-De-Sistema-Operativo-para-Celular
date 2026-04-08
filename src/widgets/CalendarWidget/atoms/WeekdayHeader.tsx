import { type CSSProperties } from 'react'
import { colors, font } from '../../../design'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const
const HEADER_FONT_SIZE = 9

const LABEL_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: HEADER_FONT_SIZE,
  fontFamily: font.sans,
  fontWeight: font.weight.medium,
  color: colors.textMuted,
  lineHeight: 1,
}

export default function WeekdayHeader() {
  return (
    <>
      {WEEKDAYS.map((label, i) => (
        <div key={i} style={LABEL_STYLE}>{label}</div>
      ))}
    </>
  )
}
