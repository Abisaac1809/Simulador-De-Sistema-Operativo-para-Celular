import type { CSSProperties } from 'react'
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GlassButton, Typography, colors, spacing, slideLeft } from '../../../design'
import MessageBubble from '../atoms/MessageBubble'
import ConversationAvatar from '../atoms/ConversationAvatar'
import MessageInput from './MessageInput'
import { useThread } from '../hooks/useThread'

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

const MESSAGES_STYLE: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: `${spacing[3]}px ${spacing[4]}px`,
  display: 'flex',
  flexDirection: 'column',
}

interface ThreadViewProps {
  contactId: string
  contactName: string
  onBack: () => void
}

export default function ThreadView({ contactId, contactName, onBack }: ThreadViewProps) {
  const { threadMessages, text, setText, send } = useThread(contactId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [threadMessages])

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
        <ConversationAvatar name={contactName} />
        <Typography variant="title">{contactName}</Typography>
      </div>

      <div style={MESSAGES_STYLE}>
        {threadMessages.map(m => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput text={text} onChange={setText} onSend={send} />
    </motion.div>
  )
}
