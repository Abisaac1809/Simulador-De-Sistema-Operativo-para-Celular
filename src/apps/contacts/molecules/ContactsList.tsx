import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { spacing, fadeIn } from '../../../design'
import type { Contact } from '../../../types'
import ContactCard from './ContactCard'
import EmptyState from '../atoms/EmptyState'

const LIST_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
  overflowY: 'auto',
  padding: spacing[4],
  flex: 1,
}

interface ContactsListProps {
  contacts: Contact[]
  onSelect: (id: string) => void
}

export default function ContactsList({ contacts, onSelect }: ContactsListProps) {
  return (
    <div style={LIST_STYLE}>
      {contacts.length === 0 ? (
        <EmptyState />
      ) : (
        <AnimatePresence>
          {contacts.map(c => (
            <motion.div
              key={c.id}
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ContactCard contact={c} onSelect={onSelect} />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  )
}
