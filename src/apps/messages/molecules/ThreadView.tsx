import type { CSSProperties } from 'react'
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GlassButton, Typography, colors, spacing, slideLeft } from '../../../design'
import MessageBubble from '../atoms/MessageBubble'
import ConversationAvatar from '../atoms/ConversationAvatar'
import MessageInput from './MessageInput'
import ConnectionStatus from '../atoms/ConnectionStatus'
import { useThread } from '../hooks/useThread'

// ── Styles ─────────────────────────────────────────────────────

const ROOT_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
}

const TOOLBAR_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[3],
  padding: spacing[4],
  flexShrink: 0,
  borderBottom: `1px solid ${colors.glassBorder}`,
}

const TOOLBAR_TITLE_AREA_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[3],
  flex: 1,
  minWidth: 0,
}

const MESSAGES_STYLE: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: `${spacing[3]}px ${spacing[4]}px`,
  display: 'flex',
  flexDirection: 'column',
}

// ── Props ───────────────────────────────────────────────────────

interface ThreadViewProps {
  contactId: string
  contactName: string
  currentUserId: string
  onBack: () => void
}

// ── Component ───────────────────────────────────────────────────

export default function ThreadView({
  contactId,
  contactName,
  currentUserId,
  onBack,
}: ThreadViewProps) {
  const { threadMessages, text, setText, send } = useThread(contactId, currentUserId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [threadMessages])

  const handleSend = () => {
    send(text)
    setText('')
  }

  return (
    <motion.div
      variants={slideLeft}
      initial="initial"
      animate="animate"
      exit="exit"
      style={ROOT_STYLE}
    >
      <div style={TOOLBAR_STYLE}>
        <GlassButton variant="ghost" onClick={onBack}>
          <i className="fi fi-rr-arrow-left" />
        </GlassButton>
        <div style={TOOLBAR_TITLE_AREA_STYLE}>
          <ConversationAvatar name={contactName} />
          <Typography variant="title">{contactName}</Typography>
        </div>
        <ConnectionStatus />
      </div>

      <div style={MESSAGES_STYLE}>
        {threadMessages.map(m => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput text={text} onChange={setText} onSend={handleSend} />
    </motion.div>
  )
}
