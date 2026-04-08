import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { spacing, fadeIn } from '../../../design'
import type { NoteRecord } from '../../../kernel/storage'
import NoteCard from './NoteCard'
import EmptyState from '../atoms/EmptyState'

const LIST_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[3],
  overflowY: 'auto',
  padding: spacing[4],
  flex: 1,
}

interface NotesListProps {
  noteList: NoteRecord[]
  onOpen: (note: NoteRecord) => void
  onDelete: (id: string) => void
}

export default function NotesList({ noteList, onOpen, onDelete }: NotesListProps) {
  return (
    <div style={LIST_STYLE}>
      {noteList.length === 0 ? (
        <EmptyState />
      ) : (
        <AnimatePresence>
          {noteList.map(note => (
            <motion.div
              key={note.id}
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <NoteCard note={note} onOpen={onOpen} onDelete={onDelete} />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  )
}
