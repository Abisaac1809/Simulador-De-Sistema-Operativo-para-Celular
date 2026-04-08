import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { GlassCard, colors, spacing, pressScale } from '../../../design'
import type { NoteRecord } from '../../../kernel/storage'
import NoteTitle from '../atoms/NoteTitle'
import NotePreview from '../atoms/NotePreview'
import NoteTimestamp from '../atoms/NoteTimestamp'

const CARD_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: `${spacing[3]}px ${spacing[4]}px`,
  gap: spacing[3],
  cursor: 'pointer',
  width: '100%',
}

const LEFT_SECTION_STYLE: CSSProperties = {
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
}

const RIGHT_SECTION_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: spacing[2],
  flexShrink: 0,
}

const DELETE_BTN_STYLE: CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: colors.danger,
  fontSize: 16,
  lineHeight: 1,
}

interface NoteCardProps {
  note: NoteRecord
  onOpen: (note: NoteRecord) => void
  onDelete: (id: string) => void
}

export default function NoteCard({ note, onOpen, onDelete }: NoteCardProps) {
  return (
    <motion.div
      variants={pressScale}
      initial="rest"
      whileTap="pressed"
      onClick={() => onOpen(note)}
    >
      <GlassCard style={CARD_STYLE}>
        <div style={LEFT_SECTION_STYLE}>
          <NoteTitle title={note.title || 'Untitled'} />
          <NotePreview body={note.body} />
        </div>
        <div style={RIGHT_SECTION_STYLE}>
          <NoteTimestamp updatedAt={note.updatedAt} />
          <button
            style={DELETE_BTN_STYLE}
            onClick={(e) => { e.stopPropagation(); onDelete(note.id) }}
            aria-label="Delete note"
          >
            <i className="fi fi-rr-trash" />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  )
}
