import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { GlassButton, colors, font, spacing, slideLeft } from '../../../design'
import type { NoteRecord } from '../../../kernel/storage'
import { useNoteEditor } from '../hooks/useNoteEditor'

const TITLE_FONT_SIZE = 22
const BODY_FONT_SIZE = 16

const INPUT_BASE_STYLE: CSSProperties = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: colors.textPrimary,
  fontFamily: font.sans,
  width: '100%',
}

const ROOT_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}

const HEADER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: spacing[4],
  flexShrink: 0,
}

const DIVIDER_STYLE: CSSProperties = {
  height: 1,
  background: colors.glassBorder,
  flexShrink: 0,
}

const TITLE_INPUT_STYLE: CSSProperties = {
  ...INPUT_BASE_STYLE,
  fontSize: TITLE_FONT_SIZE,
  fontWeight: font.weight.semibold,
  padding: spacing[4],
}

const BODY_TEXTAREA_STYLE: CSSProperties = {
  ...INPUT_BASE_STYLE,
  fontSize: BODY_FONT_SIZE,
  lineHeight: 1.6,
  padding: spacing[4],
  resize: 'none',
  flex: 1,
}

interface NoteEditorProps {
  note: NoteRecord
  onBack: () => void
  onSaved: () => void
}

export default function NoteEditor({ note, onBack, onSaved }: NoteEditorProps) {
  const { title, body, setTitle, setBody, save } = useNoteEditor(note)

  return (
    <motion.div
      variants={slideLeft}
      initial="initial"
      animate="animate"
      exit="exit"
      style={ROOT_STYLE}
    >
      <div style={HEADER_STYLE}>
        <GlassButton
          variant="ghost"
          onClick={async () => { await save(); onBack() }}
        >
          <i className="fi fi-rr-arrow-left" />
        </GlassButton>
        <GlassButton
          variant="primary"
          onClick={async () => { await save(); onSaved() }}
        >
          <i className="fi fi-rr-disk" />&nbsp;Save
        </GlassButton>
      </div>
      <div style={DIVIDER_STYLE} />
      <input
        style={TITLE_INPUT_STYLE}
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
      />
      <div style={DIVIDER_STYLE} />
      <textarea
        style={BODY_TEXTAREA_STYLE}
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Start typing..."
      />
    </motion.div>
  )
}
