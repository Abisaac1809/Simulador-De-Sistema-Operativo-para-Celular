import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { GlassCard, Typography, colors, font, spacing, pressScale } from '../../../design'
import ConversationAvatar from '../atoms/ConversationAvatar'
import UnreadBadge from '../atoms/UnreadBadge'
import type { Conversation } from '../hooks/useConversations'

const CARD_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: `${spacing[3]}px ${spacing[4]}px`,
  gap: spacing[3],
  cursor: 'pointer',
  width: '100%',
}

const INFO_STYLE: CSSProperties = {
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
}

const TOP_ROW_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const PREVIEW_STYLE: CSSProperties = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  color: colors.textMuted,
  fontSize: 13,
  fontFamily: font.sans,
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

interface ConversationCardProps {
  conversation: Conversation
  onSelect: (contactId: string) => void
}

export default function ConversationCard({ conversation, onSelect }: ConversationCardProps) {
  return (
    <motion.div
      variants={pressScale}
      initial="rest"
      whileTap="pressed"
      onClick={() => onSelect(conversation.contactId)}
    >
      <GlassCard style={CARD_STYLE}>
        <ConversationAvatar name={conversation.contactName} />
        <div style={INFO_STYLE}>
          <div style={TOP_ROW_STYLE}>
            <Typography variant="body">{conversation.contactName}</Typography>
            <Typography variant="caption" style={{ color: colors.textMuted }}>
              {formatTime(conversation.lastMessage.timestamp)}
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <span style={PREVIEW_STYLE}>{conversation.lastMessage.text}</span>
            <UnreadBadge count={conversation.unreadCount} />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
