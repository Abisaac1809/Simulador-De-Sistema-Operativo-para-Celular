import type { CSSProperties } from 'react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GlassButton, Typography, colors, spacing, fadeIn } from '../../design'
import type { NoteRecord } from '../../kernel/storage'
import { useNotes } from './hooks/useNotes'
import NotesList from './molecules/NotesList'
import NoteEditor from './molecules/NoteEditor'

const VIEW_LIST   = 'list'   as const
const VIEW_EDITOR = 'editor' as const

const ROOT_STYLE: CSSProperties = {
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: colors.bg,
}

const HEADER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${spacing[4]}px ${spacing[4]}px ${spacing[2]}px`,
  flexShrink: 0,
}

const VIEW_WRAPPER_STYLE: CSSProperties = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'hidden',
}

export default function NotesApp() {
  const [view, setView] = useState<'list' | 'editor'>(VIEW_LIST)
  const [activeNote, setActiveNote] = useState<NoteRecord | null>(null)
  const { noteList, createNote, deleteNote, refresh } = useNotes()

  const handleNewNote = async () => {
    const newNote = await createNote()
    setActiveNote(newNote)
    setView(VIEW_EDITOR)
  }

  return (
    <div style={ROOT_STYLE}>
      <AnimatePresence mode="wait">
        {view === VIEW_LIST && (
          <motion.div
            key={VIEW_LIST}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={VIEW_WRAPPER_STYLE}
          >
            <div style={HEADER_STYLE}>
              <Typography variant="title">Notes</Typography>
              <GlassButton variant="primary" onClick={handleNewNote}>
                <i className="fi fi-rr-plus" />
              </GlassButton>
            </div>
            <NotesList
              noteList={noteList}
              onOpen={(n) => { setActiveNote(n); setView(VIEW_EDITOR) }}
              onDelete={deleteNote}
            />
          </motion.div>
        )}

        {view === VIEW_EDITOR && activeNote && (
          <motion.div
            key={VIEW_EDITOR}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={VIEW_WRAPPER_STYLE}
          >
            <NoteEditor
              note={activeNote}
              onBack={() => { refresh(); setView(VIEW_LIST) }}
              onSaved={() => { refresh(); setView(VIEW_LIST) }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
