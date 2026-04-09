import type { CSSProperties } from 'react'
import { colors, font, radius, spacing } from '../../../design'
import type { Message } from '../../../types'

const BUBBLE_MAX_WIDTH = '75%'
const BUBBLE_FONT_SIZE = 15
const TIMESTAMP_FONT_SIZE = 11

const ROW_BASE_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: spacing[2],
}

const BUBBLE_BASE_STYLE: CSSProperties = {
  maxWidth: BUBBLE_MAX_WIDTH,
  padding: `${spacing[2]}px ${spacing[3]}px`,
  borderRadius: radius.button,
  fontSize: BUBBLE_FONT_SIZE,
  fontFamily: font.sans,
  color: colors.textPrimary,
  wordBreak: 'break-word',
}

const SENT_BUBBLE_STYLE: CSSProperties = {
  ...BUBBLE_BASE_STYLE,
  background: colors.accentBlue + '33',
  border: `1px solid ${colors.accentBlue}55`,
  alignSelf: 'flex-end',
  borderBottomRightRadius: radius.small,
}

const RECEIVED_BUBBLE_STYLE: CSSProperties = {
  ...BUBBLE_BASE_STYLE,
  background: colors.glassBg,
  border: `1px solid ${colors.glassBorder}`,
  alignSelf: 'flex-start',
  borderBottomLeftRadius: radius.small,
}

const TIMESTAMP_STYLE: CSSProperties = {
  fontSize: TIMESTAMP_FONT_SIZE,
  color: colors.textMuted,
  fontFamily: font.sans,
  marginTop: spacing[1],
}

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isSent = message.direction === 'sent'
  const timeLabel = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div style={{ ...ROW_BASE_STYLE, alignItems: isSent ? 'flex-end' : 'flex-start' }}>
      <div style={isSent ? SENT_BUBBLE_STYLE : RECEIVED_BUBBLE_STYLE}>
        {message.text}
      </div>
      <span style={{ ...TIMESTAMP_STYLE, textAlign: isSent ? 'right' : 'left' }}>
        {timeLabel}
      </span>
    </div>
  )
}
