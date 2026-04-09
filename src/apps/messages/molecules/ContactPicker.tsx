import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import {
  GlassButton,
  GlassCard,
  Typography,
  colors,
  spacing,
  slideLeft,
  pressScale,
} from '../../../design'
import ConversationAvatar from '../atoms/ConversationAvatar'
import EmptyState from '../atoms/EmptyState'
import SearchInput from '../atoms/SearchInput'
import { useContactPicker } from '../hooks/useContactPicker'

const ROOT_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  background: colors.bg,
}

const HEADER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: spacing[4],
  flexShrink: 0,
}

const SEARCH_WRAPPER_STYLE: CSSProperties = {
  padding: `0 ${spacing[4]}px ${spacing[3]}px`,
  flexShrink: 0,
}

const LIST_STYLE: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: `0 ${spacing[4]}px`,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
}

const CONTACT_ROW_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing[3],
  padding: `${spacing[3]}px ${spacing[4]}px`,
  cursor: 'pointer',
}

interface ContactPickerProps {
  onSelect: (contactId: string, contactName: string) => void
  onClose: () => void
}

export default function ContactPicker({ onSelect, onClose }: ContactPickerProps) {
  const { filtered, search, setSearch } = useContactPicker()

  return (
    <motion.div
      variants={slideLeft}
      initial="initial"
      animate="animate"
      exit="exit"
      style={ROOT_STYLE}
    >
      <div style={HEADER_STYLE}>
        <Typography variant="title">New Message</Typography>
        <GlassButton variant="ghost" onClick={onClose}>
          <i className="fi fi-rr-cross" />
        </GlassButton>
      </div>

      <div style={SEARCH_WRAPPER_STYLE}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search contacts…" />
      </div>

      <div style={LIST_STYLE}>
        {filtered.length === 0 ? (
          <EmptyState message="No contacts found" />
        ) : (
          filtered.map(c => (
            <motion.div
              key={c.id}
              variants={pressScale}
              initial="rest"
              whileTap="pressed"
              onClick={() => onSelect(c.id, c.name)}
            >
              <GlassCard style={CONTACT_ROW_STYLE}>
                <ConversationAvatar name={c.name} />
                <Typography variant="body">{c.name}</Typography>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
