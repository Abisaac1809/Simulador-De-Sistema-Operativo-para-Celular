import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { spacing, fadeIn } from '../../../design'
import ConversationCard from './ConversationCard'
import EmptyState from '../atoms/EmptyState'
import type { Conversation } from '../hooks/useConversations'

const LIST_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
  overflowY: 'auto',
  padding: spacing[4],
  flex: 1,
}

interface ConversationListProps {
  conversations: Conversation[]
  onSelect: (contactId: string) => void
}

export default function ConversationList({ conversations, onSelect }: ConversationListProps) {
  return (
    <div style={LIST_STYLE}>
      {conversations.length === 0 ? (
        <EmptyState />
      ) : (
        <AnimatePresence>
          {conversations.map(c => (
            <motion.div
              key={c.contactId}
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ConversationCard conversation={c} onSelect={onSelect} />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  )
}
